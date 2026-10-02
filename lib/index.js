/**
 * dsh-skin-master — host half.
 *
 * Provides the `/skin-master` HTTP surface on the harness web server:
 *   GET  /skin-master/settings      → persisted skin settings (JSON)
 *   POST /skin-master/settings      → { ...skin config } write settings
 *   POST /skin-master/asset?name=x  → upload a local background file
 *   GET  /skin-master/asset/<name>  → serve an uploaded background file
 *
 * Storage lives under the harness home directory (no dependency on the
 * community plugin center):
 *   <home>/dsh-skin-master/skin.json        — settings
 *   <home>/dsh-skin-master/assets/<safe>    — uploaded background files
 *
 * Migration: if `skin.json` does not exist but the legacy
 * `<home>/community-skin.json` (from dsh-community-plugins) does, the legacy
 * content is served read-only so old users keep their wallpaper seamlessly.
 *
 * The entry itself is mounted through the profile's cordis.patch.yml insert
 * layer, so it hot-loads without restarting the harness.
 */
import { fileURLToPath } from "node:url";
import { basename, dirname, extname, join, resolve } from "node:path";
import { createReadStream, existsSync, mkdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";

const extensionOf = (name) => extname(name).toLowerCase();

const NAME = "dsh-skin-master";
const inject = ["webServer"];

/** Resolve the harness home directory (DSH_HOME → profile layout → ~/.dsh). */
function resolveHome(ctx) {
  const env = process.env.DSH_HOME;
  if (env && env.trim()) return resolve(env.trim());
  try {
    const profileDir = fileURLToPath(ctx.baseUrl);
    const name = basename(profileDir);
    if ((name === "web" || name === "desktop") && basename(dirname(profileDir)) === "profiles") {
      return dirname(dirname(profileDir)); // <home>/profiles/<name> → <home>
    }
  } catch { /* fall through to the default home */ }
  return join(homedir(), ".dsh"); // the official default DSH home
}

function readJsonBody(req) {
  return new Promise((resolve2, reject) => {
    const chunks = [];
    req.on("data", (chunk) => chunks.push(chunk));
    req.on("end", () => {
      const raw = Buffer.concat(chunks).toString("utf8");
      try {
        resolve2(raw ? JSON.parse(raw) : {});
      } catch (error) {
        reject(new Error(`invalid JSON body: ${error.message}`));
      }
    });
    req.on("error", reject);
  });
}

function apply(ctx) {
  const home = resolveHome(ctx);
  const dataDir = join(home, "dsh-skin-master");
  const assetsDir = join(dataDir, "assets");
  const settingsPath = join(dataDir, "skin.json");
  const legacySettingsPath = join(home, "community-skin.json");

  /** Read the persisted skin settings; fall back to the legacy file once. */
  const getSkinSettings = () => {
    try {
      const parsed = JSON.parse(readFileSync(settingsPath, "utf8"));
      return parsed && typeof parsed === "object" ? parsed : {};
    } catch { /* not written yet — try the legacy file */ }
    // Read-only migration: serve the old dsh-community-plugins skin file
    // without writing it back, so the plugin stays side-effect free until
    // the user changes something.
    try {
      const legacy = JSON.parse(readFileSync(legacySettingsPath, "utf8"));
      return legacy && typeof legacy === "object" ? legacy : {};
    } catch {
      return {};
    }
  };

  /** Persist the skin settings (the backend is the source of truth because
   * Electron localStorage is not reliably flushed before shutdown). */
  const setSkinSettings = (settings) => {
    try {
      mkdirSync(dataDir, { recursive: true });
      writeFileSync(settingsPath, JSON.stringify(settings ?? {}, null, 2) + "\n");
      return { ok: true };
    } catch (error) {
      return { ok: false, message: `皮肤设置保存失败：${error instanceof Error ? error.message : String(error)}` };
    }
  };

  /**
   * Persist a locally-picked background file so it survives restarts, and
   * serve it back through the same-origin web server.
   * @returns {{ok: boolean, url?: string, message?: string}}
   */
  const saveSkinAsset = (name, buffer) => {
    const safe = String(name ?? "asset").replace(/[^A-Za-z0-9._-]/g, "_");
    try {
      mkdirSync(assetsDir, { recursive: true });
      writeFileSync(join(assetsDir, safe), buffer);
      return { ok: true, url: `/skin-master/asset/${encodeURIComponent(safe)}` };
    } catch (error) {
      return { ok: false, message: `文件保存失败：${error instanceof Error ? error.message : String(error)}` };
    }
  };

  /** Resolve a skin asset request path (traversal-safe) to an absolute file path. */
  const skinAssetPath = (name) => {
    const safe = String(name ?? "").replace(/[^A-Za-z0-9._-]/g, "_");
    if (!safe) return null;
    const file = join(assetsDir, safe);
    return existsSync(file) ? file : null;
  };

  ctx.effect(() => ctx.webServer.register({
    kind: "prefix",
    path: "/skin-master",
    handler: async (req, res) => {
      const url = new URL(req.url ?? "/", "http://x");
      const suffix = url.pathname.slice("/skin-master".length) || "/";
      const method = req.method ?? "GET";
      const send = (status, body) => {
        res.writeHead(status, {
          "content-type": "application/json; charset=utf-8",
          "cache-control": "no-store",
        });
        res.end(JSON.stringify(body));
      };
      try {
        if (suffix === "/settings" && method === "GET") {
          send(200, { ok: true, value: getSkinSettings() });
          return;
        }
        if (suffix === "/settings" && method === "POST") {
          const body = await readJsonBody(req);
          const result = setSkinSettings(body);
          send(result.ok ? 200 : 400, result);
          return;
        }
        if (suffix === "/asset" && method === "POST") {
          const name = url.searchParams.get("name") || "asset.bin";
          const chunks = [];
          for await (const chunk of req) chunks.push(chunk);
          const result = saveSkinAsset(name, Buffer.concat(chunks));
          send(result.ok ? 200 : 400, result);
          return;
        }
        // Assets are served with full Range/streaming support: the Chromium
        // media stack seeks (the loop wrap-around included) with `Range`
        // requests, and a plain 200-full-body reply without `Accept-Ranges`
        // makes a background video stall mid-play or freeze on the last
        // frame instead of looping. Files are streamed, not readFileSync'd
        // into memory (a 300 MB wallpaper would block the event loop).
        if (suffix.startsWith("/asset/") && (method === "GET" || method === "HEAD")) {
          const name = decodeURIComponent(suffix.slice("/asset/".length));
          const file = skinAssetPath(name);
          if (!file) {
            send(404, { ok: false, error: { code: "not-found", message: "asset not found" } });
            return;
          }
          const mime = {
            ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg",
            ".gif": "image/gif", ".webp": "image/webp", ".svg": "image/svg+xml",
            ".mp4": "video/mp4", ".webm": "video/webm", ".mov": "video/quicktime",
          }[extensionOf(name)] ?? "application/octet-stream";
          let total;
          try {
            total = statSync(file).size;
          } catch (error) {
            send(500, { ok: false, error: { code: "internal", message: error.message } });
            return;
          }
          const headers = {
            "content-type": mime,
            "accept-ranges": "bytes",
            "cache-control": "no-cache",
          };
          let start = 0;
          let end = total - 1;
          let status = 200;
          // Single-range parsing only (bytes=a-b / bytes=a- / bytes=-n);
          // Chromium never sends multi-range requests for media.
          const match = /^bytes=(\d*)-(\d*)$/.exec(String(req.headers.range ?? "").trim());
          if (match && (match[1] !== "" || match[2] !== "")) {
            if (match[1] === "") {
              start = Math.max(total - Number(match[2]), 0); // suffix: last N bytes
            } else {
              start = Number(match[1]);
              end = match[2] === "" ? total - 1 : Math.min(Number(match[2]), total - 1);
            }
            if (start >= total || start > end) {
              res.writeHead(416, { "content-range": `bytes */${total}` });
              res.end();
              return;
            }
            status = 206;
            headers["content-range"] = `bytes ${start}-${end}/${total}`;
          }
          headers["content-length"] = String(end - start + 1);
          res.writeHead(status, headers);
          if (method === "HEAD") {
            res.end();
            return;
          }
          const stream = createReadStream(file, { start, end });
          stream.on("error", () => {
            try { res.destroy(); } catch { /* ignore */ }
          });
          stream.pipe(res);
          return;
        }
        send(404, { ok: false, error: { code: "not-found", message: `${method} /skin-master${suffix}` } });
      } catch (error) {
        send(500, {
          ok: false,
          error: { code: "internal", message: error instanceof Error ? error.message : String(error) },
        });
      }
    },
  }), "skin-master: routes");
}

// No `default` export: the loader's unwrapExports would collapse the module
// to its default and drop the named `inject` export (codebase convention).
export { apply, inject, NAME as name };
