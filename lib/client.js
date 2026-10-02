/**
 * dsh-skin-master — browser half (hand-bundled for the DSH client module
 * system). Registers a `sidebar.footer.action` entry that opens the skin
 * drawer: global background image/video, frosted-glass blur, chat-input
 * background, popover surfaces, filters, AI reply text and user bubble
 * colors.
 *
 * Extracted from the `dsh-community-plugins` custom-skin feature (MIT,
 * DeepSeek-Harness-NB) with the community plugin center stripped out:
 *   - all `dsc-*` own class/id/CSS-variable/JS names renamed to `dsk-*`
 *     (DeepSeek app CSS hash selectors like `[class*='kBm9Yq_body']` /
 *     `[class*='v5IAXa_body']` are kept untouched — both app generations
 *     43.x and 44.x are covered side by side);
 *   - HTTP surface moved from `/community/skin` + `/community/asset` to
 *     `/skin-master/settings` + `/skin-master/asset`;
 *   - localStorage key `dsc.skin` is still read for migration, new writes
 *     go to `dsk.skin`;
 *   - the "community skins" market block of the panel is removed.
 */
window.__ModuleLoader__.load({
  id: "dsh-skin-master",
  factory: (require) => {
    var module = { exports: {} };
    var exports = module.exports;
    Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });

    const React = require("react");
    const { jsx, jsxs, Fragment } = require("react/jsx-runtime");

    /* ------------------------------------------------------------------ *
     * Styles
     * ------------------------------------------------------------------ */
    const cssText = [
      ".dsk-btn{font:inherit;cursor:pointer;border:1px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-button-elevated-fill);color:var(--dsw-alias-label-primary);border-radius:8px;padding:4px 12px;font-size:12px;line-height:20px;display:inline-flex;align-items:center;gap:4px;white-space:nowrap}",
      ".dsk-btn:hover:not(:disabled){background:var(--dsw-alias-button-floating-hover)}",
      ".dsk-btn:disabled{opacity:.55;cursor:default}",
      ".dsk-btnPrimary{background:var(--dsw-alias-state-business-primary);border-color:transparent;color:#fff}",
      ".dsk-btnDanger{border-color:color-mix(in srgb,var(--dsw-alias-label-error) 40%,transparent);color:var(--dsw-alias-label-error)}",
      ".dsk-footerButton{display:flex;align-items:center;gap:8px;width:100%;min-width:0;box-sizing:border-box;border:none;background:transparent;color:var(--dsw-alias-label-secondary);cursor:pointer;border-radius:8px;padding:8px 10px;font:inherit;font-size:13px;line-height:20px}",
      ".dsk-footerButton:hover{background:var(--dsw-alias-interactive-bg-hover);color:var(--dsw-alias-label-primary)}",
      ".dsk-footerButtonIcon{justify-content:center;width:36px;height:36px;padding:0}",
      ".dsk-footerLabel{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}",
      ".dsk-backdrop{position:fixed;inset:0;background:rgba(0,0,0,.35);z-index:9990}",
      // Popover surfaces (composer command menu, permission/model pickers,
      // workspace list portal, shell overlays like settings, and our own
      // drawers) share one background recipe driven by the popBg skin
      // settings: opaque by default so overlays stay readable even when the
      // main skin transparency is 0. ::before carries the grain texture.
      // The variable restoration makes every inner panel (they read the
      // --dsw-alias-bg-* tokens) opaque again instead of inheriting the
      // main skin's fully-transparent tint.
      "[class*='overlay'],[class*='_portal_'],[class*='_list_'],[class*='_menu'],[class*='VBkzZa_menu'],html[data-dsh-taskboard-active]{--dsw-alias-bg-base:rgba(18,18,20,var(--dsk-pop-alpha,1))!important;--dsw-alias-bg-layer-1:rgba(24,24,27,var(--dsk-pop-alpha,1))!important;--dsw-alias-bg-layer-2:rgba(30,30,34,var(--dsk-pop-alpha,1))!important;--dsw-alias-bg-layer-3:rgba(36,36,40,var(--dsk-pop-alpha,1))!important;--dsw-specific-sidebar-fill:rgba(22,22,24,var(--dsk-pop-alpha,1))!important;--dsw-alias-bg-module-platform:rgba(40,40,44,var(--dsk-pop-alpha,1))!important}",
      ".I_ks9a_menu,.dsk-drawer,[data-shell-overlay='true'] [data-slot]>*,[class*='_portal_'],[class*='_list_'],[class*='_menu'],[class*='VBkzZa_menu']{background-color:rgba(36,36,40,var(--dsk-pop-alpha,1)) !important;backdrop-filter:blur(var(--dsk-pop-blur,0px)) !important}",
      ".I_ks9a_menu::before,.dsk-drawer::before,[data-shell-overlay='true'] [data-slot]>*::before,[class*='_portal_']::before,[class*='_list_']::before,[class*='_menu']::before,[class*='VBkzZa_menu']::before{content:\"\";position:absolute;inset:0;z-index:-1;pointer-events:none;border-radius:inherit;opacity:var(--dsk-pop-grain,0);background-image:url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='120' height='120' filter='url(%23n)'/%3E%3C/svg%3E\")}",
      ".dsk-drawer{position:fixed;top:0;right:0;bottom:0;width:min(480px,100vw);background:var(--dsw-alias-bg-layer-3,var(--dsw-specific-sidebar-fill,#1c1c1e));color:var(--dsw-alias-label-primary);z-index:9991;display:flex;flex-direction:column;box-shadow:-12px 0 32px rgba(0,0,0,.3);font-size:13px;line-height:1.5}",
      ".dsk-head{display:flex;align-items:center;gap:8px;padding:14px 16px;border-bottom:1px solid var(--dsw-alias-border-l2);flex:none}",
      ".dsk-title{font-size:15px;font-weight:600;flex:1;min-width:0}",
      ".dsk-close{font:inherit;cursor:pointer;border:none;background:transparent;color:var(--dsw-alias-label-secondary);font-size:18px;line-height:1;padding:4px 8px;border-radius:6px}",
      ".dsk-close:hover{background:var(--dsw-alias-interactive-bg-hover);color:var(--dsw-alias-label-primary)}",
      ".dsk-body{flex:1;overflow-y:auto;padding:8px 12px 16px;min-height:0}",
      ".dsk-notice{border:1px solid var(--dsw-alias-border-l2);border-radius:8px;padding:8px 12px;margin:8px 4px 0;font-size:12px;line-height:18px;display:flex;gap:10px;align-items:center;flex-wrap:wrap}",
      ".dsk-group{border:1px solid var(--dsw-alias-border-l2);border-radius:10px;padding:10px 12px;margin:8px 0}",
      ".dsk-groupTitle{font-size:12px;font-weight:600;margin:0 0 8px;color:var(--dsw-alias-label-secondary)}",
      ".dsk-row{display:flex;align-items:center;gap:8px;margin:6px 0;min-width:0}",
      ".dsk-rowLabel{flex:none;font-size:12px;color:var(--dsw-alias-label-secondary);min-width:56px}",
      ".dsk-textInput{flex:1;min-width:0;border:1px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-bg-layer-3);color:var(--dsw-alias-label-primary);border-radius:8px;padding:4px 8px;font:inherit;font-size:12px}",
      ".dsk-range{flex:1;min-width:0;accent-color:var(--dsw-alias-state-business-primary)}",
      ".dsk-rangeVal{flex:none;width:38px;text-align:right;font-size:11px;color:var(--dsw-alias-label-tertiary)}",
      ".dsk-colorInput{flex:none;width:40px;height:28px;padding:2px;border:1px solid var(--dsw-alias-border-l2);border-radius:6px;background:var(--dsw-alias-bg-layer-3);cursor:pointer}",
      ".dsk-check{display:inline-flex;align-items:center;gap:4px;font-size:12px;color:var(--dsw-alias-label-secondary);cursor:pointer}",
      ".dsk-fileInput{display:none}",
      ".dsk-chip{font:inherit;cursor:pointer;border:1px solid var(--dsw-alias-border-l2);background:transparent;color:var(--dsw-alias-label-secondary);border-radius:999px;padding:3px 10px;font-size:11px;line-height:16px}",
      ".dsk-chipOn{background:var(--dsw-alias-bg-module-platform);color:var(--dsw-alias-label-primary)}",
      // AI reply text color: the markdown body and its inner text elements
      // carry their own theme color, so the override must reach inside the
      // body with !important. An empty --dsk-chat-color falls back to the
      // theme default via inherit. Two app generations are covered: the
      // 43.x frontend ships the assistant markdown body as kBm9Yq_body,
      // while 44.x moved it into the dsh-client-ui-chat module as
      // v5IAXa_body.
      "[class*='kBm9Yq_body'],[class*='v5IAXa_body'],[class*='kBm9Yq_body'] *,[class*='v5IAXa_body'] *{color:var(--dsk-chat-color,inherit) !important}",
      // My sent messages: user bubble background and its text color. The
      // background alpha comes from the opacity slider (hex color or the
      // theme's default 44,44,46 base), and the blur gives it the same
      // frosted-glass treatment as the input card. 43.x names the bubble
      // P5DUYG_bubble, 44.x renamed it to cJsG2q_bubble.
      "[class*='P5DUYG_bubble'],[class*='cJsG2q_bubble']{background-color:var(--dsk-inputbox-bg-rgba,rgba(44,44,46,1)) !important;color:var(--dsk-inputbox-text,inherit) !important;backdrop-filter:blur(var(--dsk-inputbox-blur,0px)) !important}",
      "[class*='P5DUYG_bubble'] *,[class*='cJsG2q_bubble'] *{color:var(--dsk-inputbox-text,inherit) !important}",
      // Chat-input background: ::before carries the image (so blur/opacity/
      // position/scale hit the image only), ::after is the gradient fade
      // overlay. No overflow:hidden here: it would clip the composer's own
      // popovers (the "+" menu opens upward, outside the card). The image
      // never escapes the card anyway — background paints inside the element
      // and the scale slider resizes background-size instead of transforming
      // the layer; only cross mode intentionally grows past the card.
      ".dsk-input-bg{position:relative !important}",
      // One single image: size/repeat/position follow the chosen mode
      // (fill/fit/stretch/tile/center/cross) via CSS variables; the image
      // layer stays inside the card except in cross mode, where it spans
      // past the input area (the layer grows to 220% and the full image
      // shows centred on it).
      ".dsk-input-bg::before{content:\"\";position:absolute;inset:var(--dsk-input-inset,0);background-image:var(--dsk-input-img);background-size:var(--dsk-input-size,cover);background-repeat:var(--dsk-input-repeat,no-repeat);background-position:var(--dsk-input-pos,50% 50%);filter:blur(var(--dsk-input-blur,0px));opacity:var(--dsk-input-opacity,1);transform:scale(var(--dsk-input-scale,1));z-index:0;pointer-events:none;border-radius:inherit;mask-image:var(--dsk-input-mask,none);-webkit-mask-image:var(--dsk-input-mask,none)}",
      ".dsk-input-bg.dsk-cross{overflow:visible !important}",
      ".dsk-input-bg.dsk-cross::before{inset:-60%}",
      ".dsk-input-bg::after{content:\"\";position:absolute;inset:0;background-image:var(--dsk-input-grad);z-index:1;pointer-events:none;border-radius:inherit}",
      ".dsk-input-bg>*{position:relative;z-index:2}",
      ".dsk-inputCard{position:relative !important;background-color:rgba(44,44,46,var(--dsk-input-bg-alpha,1)) !important;backdrop-filter:blur(10px) !important}",
      ".dsk-hint{font-size:11px;line-height:16px;color:var(--dsw-alias-label-tertiary);margin:4px 0 6px}",
      ".dsk-cardActions{display:flex;gap:6px;margin-top:8px;flex-wrap:wrap}",
      ".dsk-switch{position:relative;display:inline-block;width:34px;height:20px;flex:none;cursor:pointer}",
      ".dsk-switch input{position:absolute;opacity:0;width:100%;height:100%;margin:0;cursor:pointer}",
      ".dsk-switchTrack{position:absolute;inset:0;border-radius:999px;background:var(--dsw-alias-bg-module-platform);border:1px solid var(--dsw-alias-border-l2);transition:background .15s ease}",
      ".dsk-switchThumb{position:absolute;top:2px;left:2px;width:14px;height:14px;border-radius:50%;background:var(--dsw-alias-label-secondary);transition:transform .15s ease}",
      ".dsk-switch input:checked + .dsk-switchTrack{background:var(--dsw-alias-state-business-primary);border-color:transparent}",
      ".dsk-switch input:checked + .dsk-switchTrack .dsk-switchThumb{transform:translateX(14px);background:#fff}",
      ".dsk-bgPreview{width:100%;height:64px;border:1px dashed var(--dsw-alias-border-l2);border-radius:8px;overflow:hidden;position:relative;cursor:grab;background:rgba(0,0,0,.35);margin:6px 0;touch-action:none}",
      ".dsk-bgPreview:active{cursor:grabbing}",
      ".dsk-bgPreviewImg{position:absolute;inset:0;background-repeat:no-repeat;background-size:cover}",
      ".dsk-link{color:var(--dsw-alias-label-secondary);text-decoration:none}",
      ".dsk-link:hover{color:var(--dsw-alias-label-primary)}",
      ".dsk-spin{display:inline-block;width:12px;height:12px;border:2px solid currentColor;border-right-color:transparent;border-radius:50%;animation:dsk-spin .7s linear infinite;vertical-align:-2px}",
      "@keyframes dsk-spin{to{transform:rotate(360deg)}}",
    ].join("");

    const tagId = "dsh-skin-master/skin.css";
    if (typeof document !== "undefined" && document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId) + "]") === null) {
      const tag = document.createElement("style");
      tag.dataset.plugin = "dsh-skin-master";
      tag.dataset.pluginCss = tagId;
      tag.textContent = cssText;
      document.head.appendChild(tag);
    }

    /* ------------------------------------------------------------------ *
     * Custom skin engine (plain DOM; works independent of the panel UI)
     * ------------------------------------------------------------------ */
    const SKIN_STORAGE_KEY = "dsk.skin";
    const LEGACY_SKIN_STORAGE_KEY = "dsc.skin"; // read-only migration source
    const SKIN_DEFAULTS = {
      enabled: false,
      imageUrl: "",
      imageMode: "cover", // cover | contain | repeat
      videoUrl: "",
      videoVolume: 0.5,
      videoMuted: false,
      blur: 0,
      opacity: 0, // panel background opacity, % — 0 lets the background show through untouched; 100 fully covers it
      brightness: 100,
      contrast: 100,
      saturate: 100,
      scale: 0, // background image zoom: -100 (shrink) .. 0 (original) .. +100 (enlarge)
      // Chat-input background: image fills the input card's right side with
      // a soft gradient transition; position/blur/opacity of the image and
      // the input card's own transparency are adjustable.
      inputBg: {
        enabled: false,
        imageUrl: "",
        mode: "fill",   // fill | fit | stretch | repeat | center | cross
        transition: 55, // gradient midpoint from the left, %
        posX: 50,       // image horizontal anchor, %
        posY: 50,       // image vertical anchor, %
        blur: 0,        // image blur (frosted), px
        opacity: 100,   // image opacity, %
        inputOpacity: 100, // input card transparency, % (100 = opaque)
        scale: 0,       // image zoom: -100 .. 0 .. +100
      },
      // Popover / drawer surfaces (command menu, model picker, skin
      // drawers…): independent of the global background transparency so
      // they stay readable even when the main skin is fully transparent.
      popBg: {
        alpha: 40,  // surface opacity, % (100 = opaque)
        blur: 10,   // frosted-glass blur behind the surface, px
        grain: 5,   // grain texture strength, % (0 = off)
      },
      // AI reply text color. Empty = keep the app's default; any hex color
      // overrides the assistant message body (via --dsk-chat-color).
      chatColor: "",
      // My sent messages: user bubble background + text color. Empty = default.
      inputBox: {
        bgColor: "",   // user message bubble background, hex or empty
        textColor: "", // user message text color, hex or empty
        opacity: 100,  // bubble background opacity, % (100 = opaque)
        blur: 0,       // frosted-glass blur behind the bubble, px
      },
    };

    function readSkin() {
      try {
        // Migration: read the legacy `dsc.skin` key when the new one has
        // never been written, so old users keep their wallpaper seamlessly.
        let raw = window.localStorage.getItem(SKIN_STORAGE_KEY);
        if (raw === null) raw = window.localStorage.getItem(LEGACY_SKIN_STORAGE_KEY);
        const parsed = JSON.parse(raw || "{}");
        // Migrate the old default (opacity 100, untouched sliders): it fully
        // covered the background on panels that use plain variable fills.
        if (parsed.opacity === 100 && parsed.blur === 0 && parsed.brightness === 100 && parsed.contrast === 100 && parsed.saturate === 100) {
          parsed.opacity = SKIN_DEFAULTS.opacity;
        }
        return { ...SKIN_DEFAULTS, ...parsed };
      } catch {
        return { ...SKIN_DEFAULTS };
      }
    }

    /** Authoritative settings from the host (survives restarts; Electron
     *  localStorage is not reliably flushed before shutdown). */
    async function loadSkinFromServer() {
      try {
        const res = await fetch("/skin-master/settings");
        const data = await res.json();
        if (data && data.ok && data.value) return { ...SKIN_DEFAULTS, ...data.value };
      } catch { /* fall through to localStorage */ }
      return readSkin();
    }

    let skinPersistTimer = null;

    function persistSkin(cfg) {
      try { window.localStorage.setItem(SKIN_STORAGE_KEY, JSON.stringify(cfg)); } catch { /* ignore */ }
      clearTimeout(skinPersistTimer);
      skinPersistTimer = setTimeout(() => {
        fetch("/skin-master/settings", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify(cfg),
        }).catch(() => { /* transient */ });
      }, 400);
    }

    /** Upload a locally-picked file so it stays available after a restart. */
    async function uploadSkinAsset(file) {
      const name = `${Date.now().toString(36)}-${String(file.name || "asset").replace(/[^A-Za-z0-9._-]/g, "_")}`;
      const res = await fetch("/skin-master/asset?name=" + encodeURIComponent(name), { method: "POST", body: file });
      const data = await res.json().catch(() => null);
      if (!data || data.ok !== true) throw new Error((data && data.message) || "文件上传失败");
      return data.url;
    }

    function writeSkin(cfg) {
      try { window.localStorage.setItem(SKIN_STORAGE_KEY, JSON.stringify(cfg)); } catch { /* ignore */ }
      try { applySkin(cfg); } catch { /* skin code must never break the app */ }
      persistSkin(cfg);
    }

    let skinNodes = null;
    let skinStyleTag = null;

    function ensureSkinNodes() {
      // The app (or an extension) can wipe body children; a detached skin
      // root must be rebuilt, not reused.
      if (skinNodes && !document.body.contains(skinNodes.root)) skinNodes = null;
      if (skinNodes) return skinNodes;
      const root = document.createElement("div");
      root.id = "dsk-skin-root";
      root.style.cssText = "position:fixed;inset:0;z-index:-1;pointer-events:none;overflow:hidden";
      const media = document.createElement("div");
      media.id = "dsk-skin-media";
      media.style.cssText = "position:absolute;inset:0;width:100%;height:100%";
      const blur = document.createElement("div");
      blur.id = "dsk-skin-blur";
      blur.style.cssText = "position:absolute;inset:0;width:100%;height:100%;backdrop-filter:none";
      root.appendChild(media);
      root.appendChild(blur);
      document.body.appendChild(root);
      skinNodes = { root, media, blur };
      return skinNodes;
    }

    function removeSkinNodes() {
      if (skinNodes) {
        try { skinNodes.root.remove(); } catch { /* ignore */ }
        skinNodes = null;
      }
    }

    function ensureSkinStyle() {
      if (skinStyleTag) return skinStyleTag;
      skinStyleTag = document.createElement("style");
      skinStyleTag.id = "dsk-skin-css";
      document.head.appendChild(skinStyleTag);
      return skinStyleTag;
    }

    const cssUrlEscape = (s) => String(s).replace(/["\\]/g, "\\$&");

    /** Zoom slider (-100..+100) → transform scale ratio (0.1 .. 2.0). */
    const scaleRatio = (value) => {
      const pct = Math.min(Math.max(Number(value ?? 0), -100), 100);
      return String(Math.max(100 + pct, 10) / 100);
    };

    // Last applied config, used to skip redundant re-applies. Rebuilding the
    // background video on every slider tick makes the main background blink
    // (destroy + re-decode), so only parts that actually changed get updated.
    let lastSkinCfg = null;

    const inputBgFields = ["enabled", "imageUrl", "mode", "transition", "posX", "posY", "blur", "opacity", "inputOpacity", "scale"];

    const cfgFieldDiff = (a, b, fields) => {
      for (const k of fields) if (a?.[k] !== b?.[k]) return true;
      return false;
    };

    /* ------------------------------------------------------------------ *
     * Background video watchdog — keep the wallpaper looping forever
     * ------------------------------------------------------------------ */
    /** Try (playback-policy safe) to start playback; rejections are retried
     * by the watchdog instead of surfacing. */
    function kickVideo(video) {
      try {
        const p = video.play();
        if (p && typeof p.catch === "function") p.catch(() => { /* retried on the next tick */ });
      } catch { /* ignore */ }
    }

    let videoWatchTimer = null;
    let videoLastTick = { time: -1, at: 0 };

    /** Periodic safety net for the background video: undo external pauses,
     * detect a frozen clock (dead buffer / decoder hiccup) and reload the
     * source, and rebuild the whole layer if the app wiped the skin root. */
    function ensureVideoWatchdog() {
      if (videoWatchTimer) return;
      videoWatchTimer = window.setInterval(() => {
        try {
          const cfg = lastSkinCfg;
          if (!cfg || !cfg.enabled || !cfg.videoUrl) return;
          if (!skinNodes || !document.body.contains(skinNodes.root)) {
            applySkin(cfg); // rebuilds root + video (DOM cross-check in applySkin)
            return;
          }
          const video = skinNodes.media.querySelector("video");
          if (!video) return;
          const now = Date.now();
          if (video.paused) {
            // Nobody ever pauses the wallpaper on purpose; anything that
            // paused it (autoplay-policy race, app interference) is undone.
            kickVideo(video);
            videoLastTick = { time: video.currentTime, at: now };
            return;
          }
          // A live clock is proof of health; a frozen one (still "playing"
          // but time stuck for ~6s) means the buffer dried up or the
          // decoder wedged — reload the source as a last resort.
          if (Math.abs(video.currentTime - videoLastTick.time) > 0.01) {
            videoLastTick = { time: video.currentTime, at: now };
            return;
          }
          if (now - videoLastTick.at > 6000) {
            videoLastTick = { time: -1, at: now };
            try { video.load(); } catch { /* ignore */ }
            kickVideo(video);
          }
        } catch { /* the watchdog must never throw */ }
      }, 2000);
    }

    function applySkin(cfg) {
      const prev = lastSkinCfg;
      // Chat-input background and its transparency are independent of the
      // global background switch: touch them only when they changed.
      if (!prev || cfgFieldDiff(prev.inputBg, cfg && cfg.inputBg, inputBgFields)) {
        applyInputBg(cfg && cfg.inputBg);
        applyInputOpacity(cfg && cfg.inputBg);
      }
      // Popover/drawer surfaces follow their own opacity/blur/grain settings,
      // independent of the global background switch.
      if (!prev || cfgFieldDiff(prev.popBg, cfg && cfg.popBg, ["alpha", "blur", "grain"])) {
        applyPopBg(cfg && cfg.popBg);
      }
      // AI reply text color.
      if (!prev || ((prev.chatColor ?? "") !== ((cfg && cfg.chatColor) ?? ""))) {
        applyChatColor(cfg && cfg.chatColor);
      }
      // My sent messages colors.
      if (!prev || cfgFieldDiff(prev.inputBox, cfg && cfg.inputBox, ["bgColor", "textColor", "opacity", "blur"])) {
        applyInputBox(cfg && cfg.inputBox);
      }
      // The background layer is what gets frosted: the app UI turns slightly
      // translucent and blurs what sits behind it, so the effect also works
      // on top of a community theme skin (as long as a background exists).
      const bgActive = Boolean(cfg && cfg.enabled && (cfg.imageUrl || cfg.videoUrl));
      const prevActive = Boolean(prev && prev.enabled && (prev.imageUrl || prev.videoUrl));
      if (!bgActive) {
        if (prevActive || !prev) {
          if (skinStyleTag) skinStyleTag.textContent = "";
          document.documentElement.classList.remove("dsk-skin-on");
          removeSkinNodes();
        }
        lastSkinCfg = cfg;
        return;
      }
      const nodes = ensureSkinNodes();
      const blur = Math.min(Math.max(Number(cfg.blur) || 0, 0), 40);
      const a = Math.min(Math.max(Number(cfg.opacity ?? 100), 0), 100) / 100;
      const filter = `brightness(${cfg.brightness}%) contrast(${cfg.contrast}%) saturate(${cfg.saturate}%)`;

      // Rebuild the media element only when its source/type actually changed;
      // otherwise just refresh the live styles (filter/scale/volume/muted).
      // The DOM is also cross-checked: after an external wipe of the skin
      // root (app update, extension) the config matches but the element is
      // gone, and the missing type must be rebuilt.
      const domHasVideo = Boolean(nodes.media.querySelector("video"));
      const domHasImage = Boolean(nodes.media.style.backgroundImage);
      const domMatches = cfg.videoUrl ? domHasVideo : domHasImage;
      const mediaChanged = !prev || prev.imageUrl !== cfg.imageUrl || prev.videoUrl !== cfg.videoUrl || prev.imageMode !== cfg.imageMode || !domMatches;
      if (mediaChanged) {
        if (cfg.videoUrl) {
          nodes.media.innerHTML = "";
          nodes.media.style.backgroundImage = "";
          const video = document.createElement("video");
          video.preload = "auto"; // start buffering as early as possible at boot
          video.src = cfg.videoUrl;
          video.autoplay = true;
          video.loop = true; // native looping; the watchdog below is the safety net
          video.playsInline = true;
          video.muted = cfg.videoMuted;
          video.volume = Math.min(Math.max(Number(cfg.videoVolume) || 0, 0), 1);
          video.style.cssText = "width:100%;height:100%;object-fit:cover;filter:" + filter + ";transform:scale(" + scaleRatio(cfg.scale) + ")";
          // Loop safety net: `loop` alone dies silently when the wrap-around
          // seek fails (server without Range support), the decoder errors
          // mid-stream, or something external pauses the element. These
          // listeners + the video watchdog keep it playing no matter what.
          video.addEventListener("ended", () => {
            try { video.currentTime = 0; } catch { /* ignore */ }
            kickVideo(video);
          });
          video.addEventListener("pause", () => {
            // The wallpaper is never paused on purpose; undo external pauses
            // (autoplay-policy races, app interference) shortly after.
            window.setTimeout(() => {
              try { if (video.paused && video.isConnected) kickVideo(video); } catch { /* ignore */ }
            }, 120);
          });
          video.addEventListener("error", () => {
            try { video.load(); } catch { /* ignore */ }
            kickVideo(video);
          });
          nodes.media.appendChild(video);
        } else {
          nodes.media.innerHTML = "";
          nodes.media.style.backgroundImage = `url("${cssUrlEscape(cfg.imageUrl)}")`;
          nodes.media.style.backgroundSize = cfg.imageMode === "repeat" ? "auto" : (cfg.imageMode === "contain" ? "contain" : "cover");
          nodes.media.style.backgroundPosition = "center";
          nodes.media.style.backgroundRepeat = cfg.imageMode === "repeat" ? "repeat" : "no-repeat";
          nodes.media.style.filter = filter;
          nodes.media.style.transform = "scale(" + scaleRatio(cfg.scale) + ")";
        }
      } else {
        const video = nodes.media.querySelector("video");
        if (video) {
          video.muted = cfg.videoMuted;
          video.volume = Math.min(Math.max(Number(cfg.videoVolume) || 0, 0), 1);
          video.style.filter = filter;
          video.style.transform = "scale(" + scaleRatio(cfg.scale) + ")";
        } else {
          nodes.media.style.filter = filter;
          nodes.media.style.transform = "scale(" + scaleRatio(cfg.scale) + ")";
        }
      }
      // Soft-focus the background image itself.
      nodes.blur.style.backdropFilter = blur > 0 ? `blur(${blur}px)` : "none";

      const tint = (r, g, b) => `rgba(${r},${g},${b},${a})`;
      const rules = [
        "html.dsk-skin-on,html.dsk-skin-on body{background:transparent}",
        "html.dsk-skin-on :root{",
        `--dsw-alias-bg-base:${tint(18,18,20)};`,
        `--dsw-alias-bg-layer-1:${tint(24,24,27)};`,
        `--dsw-alias-bg-layer-2:${tint(30,30,34)};`,
        `--dsw-alias-bg-layer-3:${tint(36,36,40)};`,
        `--dsw-specific-sidebar-fill:${tint(22,22,24)};`,
        `--dsw-alias-bg-module-platform:${tint(40,40,44)};`,
        "}",
        "html.dsk-skin-on body{",
        `--dsw-alias-bg-base:${tint(18,18,20)};`,
        `--dsw-alias-bg-layer-1:${tint(24,24,27)};`,
        `--dsw-alias-bg-layer-2:${tint(30,30,34)};`,
        `--dsw-alias-bg-layer-3:${tint(36,36,40)};`,
        `--dsw-specific-sidebar-fill:${tint(22,22,24)};`,
        `--dsw-alias-bg-module-platform:${tint(40,40,44)};`,
        "}",
      ];
      if (blur > 0) {
        // Frosted glass across the whole app: the translucent UI containers
        // blur the background layer behind them. Works with community themes
        // too, since they consume the same variables.
        rules.push(`html.dsk-skin-on body > div > div{backdrop-filter:blur(${blur}px)}`);
      }
      ensureSkinStyle().textContent = rules.join("\n");
      document.documentElement.classList.add("dsk-skin-on");
      lastSkinCfg = cfg;
    }

    /**
     * Locate the chat input card — the solid-background wrapper around the
     * composer's editable area.
     *
     * Two app generations:
     * - 44.x replaced the composer <textarea> with a Lexical rich editor
     *   (`[data-lexical-editor="true"]`). Its wrapper carries no background,
     *   so walk up to the first solid-background ancestor — the composer
     *   card (RlGAzG_card, className contains "card"). Some other surfaces
     *   (sidebar search, queued-row editors) also host editors, so prefer
     *   ancestors whose class looks like a card and fall back to the first
     *   solid one, then to the known card hash.
     * - 43.x used a plain <textarea>; the same walk-up finds its wrapper.
     */
    function findInputCard() {
      const solidBg = (el) => {
        const bg = getComputedStyle(el).backgroundColor;
        return Boolean(bg && bg !== "rgba(0, 0, 0, 0)" && bg !== "transparent");
      };
      const walkUp = (from) => {
        let el = from.parentElement;
        while (el && el !== document.body) {
          if (solidBg(el)) return el;
          el = el.parentElement;
        }
        return null;
      };
      for (const ed of document.querySelectorAll('[data-lexical-editor="true"]')) {
        const card = walkUp(ed);
        if (card && /card/i.test(String(card.className))) return card;
      }
      const ta = document.querySelector("textarea");
      if (ta) {
        const card = walkUp(ta) || ta.parentElement;
        if (card) return card;
      }
      for (const ed of document.querySelectorAll('[data-lexical-editor="true"]')) {
        const card = walkUp(ed);
        if (card) return card;
      }
      return document.querySelector("[class*='RlGAzG_card']");
    }

    /**
     * Chat-input background. A ::before pseudo-layer carries the image (so
     * blur/opacity/position hit the image only) with its original aspect
     * ratio (height fills the card, width may overflow and slide); a ::after
     * layer carries the gradient fade overlay. The display mode picks the
     * sizing/repeat/position recipe; "cross" grows the layer beyond the card
     * so the full image can span past the input area.
     */
    function applyInputBg(inputBg) {
      const active = Boolean(inputBg && inputBg.enabled && inputBg.imageUrl);
      const card = findInputCard();
      if (!active || !card) {
        if (card) card.classList.remove("dsk-input-bg", "dsk-cross");
        return;
      }
      const mid = Math.min(Math.max(Number(inputBg.transition) || 55, 10), 90);
      const solid = Math.max(mid - 12, 0);
      const fade = Math.min(mid + 22, 100);
      const mode = inputBg.mode || "fill";
      // Scale slider → displayed image width as a % of the input card:
      // 0 = the image's width exactly matches the card (both sides flush),
      // + = enlarged (edges crop, position sliders slide it), - = shrunk
      // (the card bottom shows through). The image keeps its aspect ratio
      // (height follows width); only stretch mode scales both axes.
      const sw = 100 + Math.min(Math.max(Number(inputBg.scale) || 0, -100), 100);
      const size =
        mode === "stretch" ? `${sw}% ${sw}%` :
        mode === "fit" ? "contain" :
        `${sw}% auto`;
      card.classList.add("dsk-input-bg");
      card.classList.toggle("dsk-cross", mode === "cross");
      card.style.setProperty("--dsk-input-img", `url("${cssUrlEscape(inputBg.imageUrl)}")`);
      card.style.setProperty("--dsk-input-size", size);
      card.style.setProperty("--dsk-input-repeat", mode === "repeat" ? "repeat" : "no-repeat");
      card.style.setProperty("--dsk-input-pos", mode === "center" ? "center" : `${inputBg.posX}% ${inputBg.posY}%`);
      // The solid fade band shares the input card's transparency variable so
      // lowering the card opacity never leaves an opaque dark band over the
      // transition zone (the var() is resolved at paint time, after
      // applyInputOpacity has set it).
      card.style.setProperty("--dsk-input-grad", `linear-gradient(to right, rgba(44,44,46,var(--dsk-input-bg-alpha,1)) 0%, rgba(44,44,46,var(--dsk-input-bg-alpha,1)) ${solid}%, rgba(44,44,46,0) ${fade}%, rgba(44,44,46,0) 100%)`);
      card.style.setProperty("--dsk-input-blur", `${Math.min(Math.max(Number(inputBg.blur) || 0, 0), 40)}px`);
      card.style.setProperty("--dsk-input-opacity", String(Math.min(Math.max(Number(inputBg.opacity) ?? 100, 0), 100) / 100));
      // Fade the image itself across the transition band (matches the dark
      // gradient's solid/fade points), so the picture melts into the tinted
      // side instead of being covered by a hard edge. Cross mode spans the
      // whole layer, so its mask would misalign — skipped there.
      card.style.setProperty("--dsk-input-mask", mode === "cross"
        ? "none"
        : `linear-gradient(to right, transparent 0%, transparent ${solid}%, #000 ${fade}%, #000 100%)`);
    }

    /** Input-card transparency — independent of the input background switch. */
    function applyInputOpacity(inputBg) {
      const alpha = Math.min(Math.max(Number(inputBg && inputBg.inputOpacity) ?? 100, 0), 100) / 100;
      const card = findInputCard();
      if (!card) return;
      // Always refresh the variable (even at 100%): the gradient overlay
      // reads it, so stale values would leave the fade band semi-transparent
      // after the opacity was raised back up.
      card.style.setProperty("--dsk-input-bg-alpha", String(alpha));
      if (alpha >= 1) {
        card.classList.remove("dsk-inputCard");
        return;
      }
      card.classList.add("dsk-inputCard");
    }

    /** Popover/drawer surfaces: opacity, frosted blur, grain texture. */
    function applyPopBg(popBg) {
      const alpha = Math.min(Math.max(Number(popBg && popBg.alpha) ?? 100, 0), 100) / 100;
      const blur = Math.min(Math.max(Number(popBg && popBg.blur) || 0, 0), 40);
      const grain = Math.min(Math.max(Number(popBg && popBg.grain) || 0, 0), 100) * 0.35 / 100;
      const root = document.documentElement;
      root.style.setProperty("--dsk-pop-alpha", String(alpha));
      root.style.setProperty("--dsk-pop-blur", `${blur}px`);
      root.style.setProperty("--dsk-pop-grain", String(grain));
    }

    /** AI reply text color ("" keeps the app default via the var fallback). */
    function applyChatColor(color) {
      document.documentElement.style.setProperty("--dsk-chat-color", color ? String(color) : "");
    }

    /** Hex #rrggbb → rgba() with the given alpha; null for empty/invalid. */
    const hexToRgba = (hex, alpha) => {
      if (!hex || !/^#[0-9a-fA-F]{6}$/.test(hex)) return null;
      const n = parseInt(hex.slice(1), 16);
      return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${alpha})`;
    };

    /** My sent messages: bubble background + text color ("" = default). */
    function applyInputBox(inputBox) {
      const root = document.documentElement;
      const alpha = Math.min(Math.max(Number(inputBox && inputBox.opacity) ?? 100, 0), 100) / 100;
      const blur = Math.min(Math.max(Number(inputBox && inputBox.blur) || 0, 0), 40);
      const bg = inputBox && inputBox.bgColor;
      // Opacity always applies: over the user color when set, else over the
      // theme's default bubble base (44,44,46), like the input card.
      root.style.setProperty("--dsk-inputbox-bg-rgba", hexToRgba(bg, alpha) || `rgba(44, 44, 46, ${alpha})`);
      root.style.setProperty("--dsk-inputbox-text", (inputBox && inputBox.textColor) ? String(inputBox.textColor) : "");
      root.style.setProperty("--dsk-inputbox-blur", `${blur}px`);
    }

    /** Initialize once at plugin apply: restore the persisted skin. */
    async function initSkin() {
      // The host web server may not be ready on the very first paint; retry
      // a few times instead of silently starting with the defaults.
      let cfg = null;
      for (let i = 0; i < 5 && !cfg; i++) {
        try {
          cfg = await loadSkinFromServer();
        } catch {
          await new Promise((r2) => setTimeout(r2, 400));
        }
      }
      if (!cfg) cfg = { ...SKIN_DEFAULTS };
      try {
        applySkin(cfg);
      } catch { /* never let skin code break the app */ }
      ensureVideoWatchdog();
      // The composer card may not exist yet on first paint; the input
      // background would silently stay off until the panel re-applies it.
      // Poll until the textarea shows up and the background is applied.
      let tries = 0;
      const timer = window.setInterval(() => {
        tries++;
        try {
          if (findInputCard()) {
            applyInputBg(cfg && cfg.inputBg);
            applyInputOpacity(cfg && cfg.inputBg);
            window.clearInterval(timer);
            return;
          }
        } catch { /* keep retrying */ }
        if (tries > 60) window.clearInterval(timer); // ~18s backstop
      }, 300);
      // The composer card is re-created by React on every conversation
      // switch / new session, which drops our classes. Keep a lightweight
      // observer alive: whenever a textarea exists without our background
      // classes (and the skin wants one), re-apply from the latest config.
      watchInputCard();
    }

    /** Keep the input background applied across conversation switches. */
    function watchInputCard() {
      const mo = new MutationObserver(() => {
        try {
          const cfg = lastSkinCfg;
          if (!cfg) return;
          const ib = cfg.inputBg || {};
          // Background image and the independent frosted transparency both
          // get dropped when React re-creates the composer card; restore
          // whichever is missing.
          const wantBg = Boolean(ib.enabled && ib.imageUrl);
          const wantOpacity = Number(ib.inputOpacity ?? 100) < 100;
          if (!wantBg && !wantOpacity) return;
          const card = findInputCard();
          if (!card) return;
          if ((wantBg && !card.classList.contains("dsk-input-bg")) || (wantOpacity && !card.classList.contains("dsk-inputCard"))) {
            applyInputBg(ib);
            applyInputOpacity(ib);
          }
        } catch { /* observer must never throw */ }
      });
      mo.observe(document.body, { childList: true, subtree: true });
    }

    /* ------------------------------------------------------------------ *
     * Dictionaries
     * ------------------------------------------------------------------ */
    const zh = {
      "skinTitle": "皮肤大师",
      "skinOpen": "打开皮肤大师",
      "close": "关闭",
      "skinEnabled": "启用背景",
      "skinBgImage": "背景图片",
      "skinBgVideo": "背景视频",
      "skinUrl": "图片 / 视频 URL",
      "skinLocal": "选择本地文件",
      "skinLocalSaved": "本地文件已保存（重启后依然有效）",
      "skinUploading": "上传中…",
      "skinLocalHint": "本地文件已上传到宿主保存，重启应用后依然有效",
      "skinMode": "显示模式",
      "skinModeCover": "封面",
      "skinModeContain": "适应",
      "skinModeRepeat": "平铺",
      "skinVolume": "音量",
      "skinMuted": "静音",
      "skinBlur": "模糊（毛玻璃）",
      "skinOpacity": "界面透明",
      "skinBrightness": "亮度",
      "skinContrast": "对比度",
      "skinSaturate": "饱和度",
      "skinScale": "图片缩放",
      "skinFilterReset": "滤镜恢复默认",
      "skinEffects": "效果",
      "skinFilters": "滤镜",
      "skinReset": "恢复默认",
      "skinResetOk": "已恢复默认皮肤",
      "skinClearBg": "清除背景",
      "skinNoBgHint": "模糊 / 透明 / 滤镜需要背景层才能生效，请先设置背景图片或视频（主题模式下同样适用）",
      "chatBgTitle": "输入框背景",
      "chatBgEnable": "启用输入框背景",
      "chatBgMode": "图片模式",
      "chatBgModeFill": "填充",
      "chatBgModeFit": "适应",
      "chatBgModeStretch": "拉伸",
      "chatBgModeRepeat": "平铺",
      "chatBgModeCenter": "居中",
      "chatBgModeCross": "跨区",
      "chatBgTransition": "过渡位置",
      "chatBgPosX": "图片左右位置",
      "chatBgPosY": "图片上下位置",
      "chatBgBlur": "图片模糊",
      "chatBgOpacity": "图片透明",
      "chatBgInputOpacity": "输入框透明",
      "inputOpacityTitle": "输入框透明",
      "popBgTitle": "展开框背景",
      "popBgHint": "作用于命令菜单、模型选择、工作区、搜索等弹出框，以及皮肤大师面板",
      "popBgAlpha": "透明度",
      "popBgBlur": "模糊度",
      "popBgGrain": "颗粒度",
      "popBgReset": "恢复默认",
      "chatColorTitle": "AI 回复文本",
      "chatColorLabel": "颜色",
      "chatColorDefault": "默认",
      "chatColorReset": "恢复默认",
      "inputBoxTitle": "我发送的消息",
      "inputBoxBg": "消息颜色",
      "inputBoxText": "文字颜色",
      "inputBoxOpacity": "透明度",
      "inputBoxBlur": "模糊度",
      "chatBgDragHint": "拖动调整图片位置",
    };
    const en = {
      "skinTitle": "Skin Master",
      "skinOpen": "Open Skin Master",
      "close": "Close",
      "skinEnabled": "Enable background",
      "skinBgImage": "Background image",
      "skinBgVideo": "Background video",
      "skinUrl": "Image / video URL",
      "skinLocal": "Choose local file",
      "skinLocalSaved": "Local file saved (persists across restarts)",
      "skinUploading": "Uploading…",
      "skinLocalHint": "Local files are stored by the host and persist across restarts",
      "skinMode": "Mode",
      "skinModeCover": "Cover",
      "skinModeContain": "Contain",
      "skinModeRepeat": "Repeat",
      "skinVolume": "Volume",
      "skinMuted": "Muted",
      "skinBlur": "Blur (frosted glass)",
      "skinOpacity": "UI transparency",
      "skinBrightness": "Brightness",
      "skinContrast": "Contrast",
      "skinSaturate": "Saturation",
      "skinScale": "Image scale",
      "skinFilterReset": "Reset filters",
      "skinEffects": "Effects",
      "skinFilters": "Filters",
      "skinReset": "Reset to default",
      "skinResetOk": "Skin reset to default",
      "skinClearBg": "Clear background",
      "skinNoBgHint": "Blur / transparency / filters need a background layer — set an image or video first (also works on top of community themes)",
      "chatBgTitle": "Input background",
      "chatBgEnable": "Enable input background",
      "chatBgMode": "Image mode",
      "chatBgModeFill": "Fill",
      "chatBgModeFit": "Fit",
      "chatBgModeStretch": "Stretch",
      "chatBgModeRepeat": "Tile",
      "chatBgModeCenter": "Center",
      "chatBgModeCross": "Span",
      "chatBgTransition": "Transition position",
      "chatBgPosX": "Image X position",
      "chatBgPosY": "Image Y position",
      "chatBgBlur": "Image blur",
      "chatBgOpacity": "Image opacity",
      "chatBgInputOpacity": "Input transparency",
      "inputOpacityTitle": "Input transparency",
      "popBgTitle": "Popover background",
      "popBgHint": "Applies to the command menu, model/permission pickers, workspace & search overlays, and the Skin Master drawer",
      "popBgAlpha": "Opacity",
      "popBgBlur": "Blur",
      "popBgGrain": "Grain",
      "popBgReset": "Reset",
      "chatColorTitle": "AI reply text",
      "chatColorLabel": "Color",
      "chatColorDefault": "Default",
      "chatColorReset": "Reset",
      "inputBoxTitle": "My messages",
      "inputBoxBg": "Bubble color",
      "inputBoxText": "Text color",
      "inputBoxOpacity": "Opacity",
      "inputBoxBlur": "Blur",
      "chatBgDragHint": "Drag to move the image",
    };

    const NS = "dsh.skin-master";

    function pickT() {
      const lang = typeof navigator !== "undefined" && navigator.language && navigator.language.toLowerCase().startsWith("zh")
        ? "zh"
        : "en";
      const dict = lang === "zh" ? zh : en;
      return (key) => dict[key] ?? en[key] ?? key;
    }

    /* ------------------------------------------------------------------ *
     * Skin panel
     * ------------------------------------------------------------------ */
    function SkinPanel(props) {
      const t = props.t || pickT();
      const [open, setOpen] = React.useState(false);
      const [cfg, setCfg] = React.useState(readSkin);
      const [notice, setNotice] = React.useState(null);
      const imgFileRef = React.useRef(null);
      const vidFileRef = React.useRef(null);
      const alive = React.useRef(true);

      const update = (patch) => {
        const next = { ...cfg, ...patch };
        // Importing a background image/video turns the background on by
        // itself — but only when the patch actually carries a background
        // source. A plain {enabled:false} toggle must never be overridden
        // here, or the switch could never be turned off once a url is set.
        if ((patch.imageUrl || patch.videoUrl) && (next.imageUrl || next.videoUrl)) next.enabled = true;
        setCfg(next);
        writeSkin(next);
      };

      const reset = () => {
        const next = { ...SKIN_DEFAULTS };
        setCfg(next);
        writeSkin(next);
        setNotice(t("skinResetOk"));
      };

      const clearBg = () => {
        const next = { ...cfg, imageUrl: "", videoUrl: "" };
        setCfg(next);
        writeSkin(next);
      };

      React.useEffect(() => {
        alive.current = true;
        // Authoritative settings from the host (restart-safe).
        loadSkinFromServer().then((saved) => {
          if (!alive.current) return;
          setCfg(saved);
          applySkin(saved);
        }).catch(() => { /* keep local state */ });
        return () => { alive.current = false; };
      }, []);

      const pickLocal = (kind) => async (e) => {
        const file = e.target.files && e.target.files[0];
        if (!file) return;
        try {
          setNotice(t("skinUploading"));
          const url = await uploadSkinAsset(file);
          if (kind === "image") update({ imageUrl: url, videoUrl: "" });
          else update({ videoUrl: url, imageUrl: "" });
          setNotice(t("skinLocalSaved"));
        } catch (err) {
          setNotice(String(err.message || err));
        }
        e.target.value = "";
      };

      const inputUpdate = (patch) => update({ inputBg: { ...(cfg.inputBg || {}), ...patch } });
      const inputBoxUpdate = (patch) => update({ inputBox: { ...(cfg.inputBox || {}), ...patch } });
      const [dragPreview, setDragPreview] = React.useState(null);
      const previewRef = React.useRef(null);

      React.useEffect(() => {
        if (!dragPreview) return undefined;
        const onMove = (e) => {
          const { startX, startY, baseX, baseY, rect } = dragPreview;
          const dx = ((e.clientX - startX) / rect.width) * 100;
          const dy = ((e.clientY - startY) / rect.height) * 100;
          inputUpdate({
            posX: Math.round(Math.min(Math.max(baseX + dx, 0), 100)),
            posY: Math.round(Math.min(Math.max(baseY + dy, 0), 100)),
          });
        };
        const onUp = () => setDragPreview(null);
        window.addEventListener("mousemove", onMove);
        window.addEventListener("mouseup", onUp);
        return () => {
          window.removeEventListener("mousemove", onMove);
          window.removeEventListener("mouseup", onUp);
        };
      }, [dragPreview]);

      const onPreviewDown = (e) => {
        e.preventDefault();
        const rect = previewRef.current && previewRef.current.getBoundingClientRect();
        if (!rect) return;
        setDragPreview({
          startX: e.clientX,
          startY: e.clientY,
          baseX: (cfg.inputBg && cfg.inputBg.posX) ?? 50,
          baseY: (cfg.inputBg && cfg.inputBg.posY) ?? 50,
          rect,
        });
      };

      const inputPickLocal = async (e) => {
        const file = e.target.files && e.target.files[0];
        if (!file) return;
        try {
          setNotice(t("skinUploading"));
          const url = await uploadSkinAsset(file);
          inputUpdate({ imageUrl: url });
          setNotice(t("skinLocalSaved"));
        } catch (err) {
          setNotice(String(err.message || err));
        }
        e.target.value = "";
      };

      // Mirror of the mode→background-size recipe used by applyInputBg, for
      // the drag preview box.
      const previewBgSize = (ib) => {
        const mode = (ib && ib.mode) || "fill";
        const sw = 100 + Math.min(Math.max(Number(ib && ib.scale) || 0, -100), 100);
        return mode === "stretch" ? `${sw}% ${sw}%`
          : mode === "fit" ? "contain"
          : `${sw}% auto`;
      };

      // Same image fade as applyInputBg, so the preview shows the transition.
      const previewMask = (ib) => {
        if (!ib || ib.mode === "cross") return "none";
        const mid = Math.min(Math.max(Number(ib.transition) || 55, 10), 90);
        const solid = Math.max(mid - 12, 0);
        const fade = Math.min(mid + 22, 100);
        return `linear-gradient(to right, transparent 0%, transparent ${solid}%, #000 ${fade}%, #000 100%)`;
      };

      const slider = (label, key, min, max, step = 1, suffix = "", path) => {        const current = path ? (cfg[path] || {}) : cfg;
        const defs = path ? (SKIN_DEFAULTS[path] || {}) : SKIN_DEFAULTS;
        return jsxs("div", { key: key, className: "dsk-row", children: [
          jsx("span", { key: "l", className: "dsk-rowLabel", children: label }),
          jsx("input", {
            key: "r",
            type: "range",
            className: "dsk-range",
            min: min,
            max: max,
            step: step,
            value: current[key] ?? defs[key],
            onChange: (e) => {
              const value = Number(e.target.value);
              if (path) update({ [path]: { ...(cfg[path] || {}), [key]: value } });
              else update({ [key]: value });
            },
          }),
          jsx("span", { key: "v", className: "dsk-rangeVal", children: String(current[key] ?? defs[key]) + suffix }),
        ] });
      };

      return jsx(Fragment, { children: [
        jsx("button", {
          key: "entry",
          type: "button",
          className: "dsk-footerButton" + (props.wide ? "" : " dsk-footerButtonIcon"),
          "aria-label": t("skinOpen"),
          title: t("skinOpen"),
          onClick: () => setOpen(true),
          children: [
            jsx("svg", { key: "icon", width: 16, height: 16, viewBox: "0 0 16 16", fill: "none", "aria-hidden": true, children: jsx("path", { d: "M7.98 1.6a6.4 6.4 0 1 0 6.4 6.4 6.4 6.4 0 0 0-6.4-6.4Zm2.93 3.55a1.2 1.2 0 0 1 .85 2.07 1.2 1.2 0 0 1-1.7 0 4.1 4.1 0 0 0-5.97 5.28A5.6 5.6 0 0 1 7.98 2.4a5.6 5.6 0 0 1 2.93 2.75Z", fill: "currentColor" }) }),
            props.wide ? jsx("span", { key: "label", className: "dsk-footerLabel", children: t("skinTitle") }) : null,
          ],
        }),
        open ? jsx(Fragment, { key: "panel", children: [
          jsx("div", { key: "backdrop", className: "dsk-backdrop", onClick: () => setOpen(false) }),
          jsx("div", { key: "drawer", className: "dsk-drawer", children: [
            jsx("div", { key: "head", className: "dsk-head", children: [
              jsx("span", { key: "title", className: "dsk-title", children: t("skinTitle") }),
              jsx("button", { key: "close", type: "button", className: "dsk-close", "aria-label": t("close"), onClick: () => setOpen(false), children: "×" }),
            ] }),
            jsx("div", { key: "body", className: "dsk-body", children: [
              jsx("div", { key: "enable", className: "dsk-row", children: [
                jsx("span", { key: "label", className: "dsk-rowLabel", children: t("skinEnabled") }),
                jsx("label", { key: "switch", className: "dsk-switch", children: [
                  jsx("input", { key: "box", type: "checkbox", checked: cfg.enabled, onChange: (e) => update({ enabled: e.target.checked }) }),
                  jsx("span", { key: "track", className: "dsk-switchTrack", children: jsx("span", { className: "dsk-switchThumb" }) }),
                ] }),
              ] }),
              notice ? jsx("div", { key: "notice", className: "dsk-notice", children: jsx("span", { children: notice }) }) : null,
              jsx("div", { key: "bg", className: "dsk-group", children: [
                jsx("div", { key: "title", className: "dsk-groupTitle", children: t("skinBgImage") }),
                jsx("div", { key: "row1", className: "dsk-row", children: [
                  jsx("span", { key: "l", className: "dsk-rowLabel", children: t("skinUrl") }),
                  jsx("input", {
                    key: "i",
                    className: "dsk-textInput",
                    type: "text",
                    placeholder: "https://…",
                    value: cfg.imageUrl && !cfg.videoUrl ? cfg.imageUrl : "",
                    onChange: (e) => update({ imageUrl: e.target.value, videoUrl: "" }),
                  }),
                ] }),
                jsx("div", { key: "row2", className: "dsk-row", children: [
                  jsx("span", { key: "l", className: "dsk-rowLabel", children: t("skinLocal") }),
                  jsx("input", { key: "f", ref: imgFileRef, className: "dsk-fileInput", type: "file", accept: "image/*", onChange: pickLocal("image") }),
                  jsx("button", { key: "b", type: "button", className: "dsk-btn", onClick: () => imgFileRef.current && imgFileRef.current.click(), children: t("skinLocal") }),
                  jsx("button", { key: "c", type: "button", className: "dsk-btn", onClick: clearBg, children: t("skinClearBg") }),
                ] }),
                jsx("div", { key: "row3", className: "dsk-row", children: [
                  jsx("span", { key: "l", className: "dsk-rowLabel", children: t("skinMode") }),
                  ["cover", "contain", "repeat"].map((m) =>
                    jsx("button", {
                      key: m,
                      type: "button",
                      className: "dsk-chip" + (cfg.imageMode === m ? " dsk-chipOn" : ""),
                      onClick: () => update({ imageMode: m }),
                      children: t(m === "cover" ? "skinModeCover" : m === "contain" ? "skinModeContain" : "skinModeRepeat"),
                    })),
                ] }),
              ] }),
              jsx("div", { key: "vid", className: "dsk-group", children: [
                jsx("div", { key: "title", className: "dsk-groupTitle", children: t("skinBgVideo") }),
                jsx("div", { key: "row1", className: "dsk-row", children: [
                  jsx("span", { key: "l", className: "dsk-rowLabel", children: t("skinUrl") }),
                  jsx("input", {
                    key: "i",
                    className: "dsk-textInput",
                    type: "text",
                    placeholder: "https://…",
                    value: cfg.videoUrl ? cfg.videoUrl : "",
                    onChange: (e) => update({ videoUrl: e.target.value, imageUrl: "" }),
                  }),
                ] }),
                jsx("div", { key: "row2", className: "dsk-row", children: [
                  jsx("span", { key: "l", className: "dsk-rowLabel", children: t("skinLocal") }),
                  jsx("input", { key: "f", ref: vidFileRef, className: "dsk-fileInput", type: "file", accept: "video/*", onChange: pickLocal("video") }),
                  jsx("button", { key: "b", type: "button", className: "dsk-btn", onClick: () => vidFileRef.current && vidFileRef.current.click(), children: t("skinLocal") }),
                ] }),
                slider(t("skinVolume"), "videoVolume", 0, 100, 1, "%"),
                jsx("div", { key: "row3", className: "dsk-row", children: [
                  jsx("label", { key: "label", className: "dsk-check", children: [
                    jsx("input", { key: "box", type: "checkbox", checked: cfg.videoMuted, onChange: (e) => update({ videoMuted: e.target.checked }) }),
                    jsx("span", { key: "text", children: t("skinMuted") }),
                  ] }),
                ] }),
              ] }),
              jsx("div", { key: "fx", className: "dsk-group", children: [
                jsx("div", { key: "title", className: "dsk-groupTitle", children: t("skinEffects") }),
                !cfg.imageUrl && !cfg.videoUrl ? jsx("div", { key: "hint", className: "dsk-hint", children: t("skinNoBgHint") }) : null,
                slider(t("skinBlur"), "blur", 0, 40, 1, "px"),
                slider(t("skinOpacity"), "opacity", 0, 100, 1, "%"),
                slider(t("skinScale"), "scale", -100, 100, 1, ""),
              ] }),
              jsx("div", { key: "fl", className: "dsk-group", children: [
                jsx("div", { key: "title", className: "dsk-groupTitle", children: t("skinFilters") }),
                slider(t("skinBrightness"), "brightness", 50, 150, 1, "%"),
                slider(t("skinContrast"), "contrast", 50, 150, 1, "%"),
                slider(t("skinSaturate"), "saturate", 0, 200, 1, "%"),
                jsx("div", { key: "actions", className: "dsk-cardActions", children: [
                  jsx("button", { key: "reset", type: "button", className: "dsk-btn", onClick: () => update({ brightness: 100, contrast: 100, saturate: 100 }), children: t("skinFilterReset") }),
                ] }),
              ] }),
              jsx("div", { key: "chat", className: "dsk-group", children: [
                jsx("div", { key: "title", className: "dsk-groupTitle", children: t("chatBgTitle") }),
                jsx("div", { key: "enable", className: "dsk-row", children: [
                  jsx("span", { key: "label", className: "dsk-rowLabel", children: t("chatBgEnable") }),
                  jsx("label", { key: "switch", className: "dsk-switch", children: [
                    jsx("input", { key: "box", type: "checkbox", checked: Boolean(cfg.inputBg && cfg.inputBg.enabled), onChange: (e) => inputUpdate({ enabled: e.target.checked }) }),
                    jsx("span", { key: "track", className: "dsk-switchTrack", children: jsx("span", { className: "dsk-switchThumb" }) }),
                  ] }),
                ] }),
                jsx("div", { key: "row1", className: "dsk-row", children: [
                  jsx("span", { key: "l", className: "dsk-rowLabel", children: t("skinUrl") }),
                  jsx("input", {
                    key: "i",
                    className: "dsk-textInput",
                    type: "text",
                    placeholder: "https://…",
                    value: (cfg.inputBg && cfg.inputBg.imageUrl) || "",
                    onChange: (e) => inputUpdate({ imageUrl: e.target.value }),
                  }),
                ] }),
                jsx("div", { key: "row2", className: "dsk-row", children: [
                  jsx("span", { key: "l", className: "dsk-rowLabel", children: t("skinLocal") }),
                  jsx("input", { key: "f", className: "dsk-fileInput", type: "file", accept: "image/*", onChange: inputPickLocal }),
                  jsx("button", { key: "b", type: "button", className: "dsk-btn", onClick: (e) => { const input = e.currentTarget.previousElementSibling; if (input) input.click(); }, children: t("skinLocal") }),
                  jsx("button", { key: "c", type: "button", className: "dsk-btn", onClick: () => inputUpdate({ imageUrl: "" }), children: t("skinClearBg") }),
                ] }),
                jsx("div", { key: "mode", className: "dsk-row", children: [
                  jsx("span", { key: "l", className: "dsk-rowLabel", children: t("chatBgMode") }),
                  ["fill", "fit", "stretch", "repeat", "center", "cross"].map((m) =>
                    jsx("button", {
                      key: m,
                      type: "button",
                      className: "dsk-chip" + ((cfg.inputBg && cfg.inputBg.mode || "fill") === m ? " dsk-chipOn" : ""),
                      onClick: () => inputUpdate({ mode: m }),
                      children: t("chatBgMode" + m.charAt(0).toUpperCase() + m.slice(1)),
                    })),
                ] }),
                jsx("div", { key: "preview", ref: previewRef, className: "dsk-bgPreview", onMouseDown: onPreviewDown, title: t("chatBgDragHint"), children: [
                  jsx("div", {
                    key: "img",
                    className: "dsk-bgPreviewImg",
                    style: {
                      backgroundImage: (cfg.inputBg && cfg.inputBg.imageUrl) ? `url("${cssUrlEscape(cfg.inputBg.imageUrl)}")` : "none",
                      backgroundSize: previewBgSize(cfg.inputBg),
                      backgroundRepeat: (cfg.inputBg && cfg.inputBg.mode === "repeat") ? "repeat" : "no-repeat",
                      backgroundPosition: (cfg.inputBg && cfg.inputBg.mode === "center") ? "center" : `${(cfg.inputBg && cfg.inputBg.posX) ?? 50}% ${(cfg.inputBg && cfg.inputBg.posY) ?? 50}%`,
                      WebkitMaskImage: previewMask(cfg.inputBg),
                      maskImage: previewMask(cfg.inputBg),
                    },
                  }),
                ] }),
                slider(t("chatBgTransition"), "transition", 10, 90, 1, "%", "inputBg"),
                slider(t("chatBgPosX"), "posX", 0, 100, 1, "%", "inputBg"),
                slider(t("chatBgPosY"), "posY", 0, 100, 1, "%", "inputBg"),
                slider(t("chatBgBlur"), "blur", 0, 40, 1, "px", "inputBg"),
                slider(t("chatBgOpacity"), "opacity", 0, 100, 1, "%", "inputBg"),
                slider(t("skinScale"), "scale", -100, 100, 1, "", "inputBg"),
              ] }),
              jsx("div", { key: "inputCard", className: "dsk-group", children: [
                jsx("div", { key: "title", className: "dsk-groupTitle", children: t("inputOpacityTitle") }),
                slider(t("chatBgInputOpacity"), "inputOpacity", 0, 100, 1, "%", "inputBg"),
              ] }),
              jsx("div", { key: "pop", className: "dsk-group", children: [
                jsx("div", { key: "title", className: "dsk-groupTitle", children: t("popBgTitle") }),
                jsx("div", { key: "hint", className: "dsk-hint", children: t("popBgHint") }),
                slider(t("popBgAlpha"), "alpha", 0, 100, 1, "%", "popBg"),
                slider(t("popBgBlur"), "blur", 0, 40, 1, "px", "popBg"),
                slider(t("popBgGrain"), "grain", 0, 100, 1, "%", "popBg"),
                jsx("div", { key: "actions", className: "dsk-cardActions", children: [
                  jsx("button", { key: "reset", type: "button", className: "dsk-btn", onClick: () => update({ popBg: { alpha: 40, blur: 10, grain: 5 } }), children: t("popBgReset") }),
                ] }),
              ] }),
              jsx("div", { key: "inputBox", className: "dsk-group", children: [
                jsx("div", { key: "title", className: "dsk-groupTitle", children: t("inputBoxTitle") }),
                jsx("div", { key: "row1", className: "dsk-row", children: [
                  jsx("span", { key: "l", className: "dsk-rowLabel", children: t("inputBoxBg") }),
                  jsx("input", {
                    key: "c",
                    type: "color",
                    className: "dsk-colorInput",
                    value: (cfg.inputBox && cfg.inputBox.bgColor) || "#f9fafb",
                    onChange: (e) => inputBoxUpdate({ bgColor: e.target.value }),
                  }),
                  jsx("span", { key: "v", className: "dsk-rangeVal", children: (cfg.inputBox && cfg.inputBox.bgColor) || t("chatColorDefault") }),
                ] }),
                jsx("div", { key: "row2", className: "dsk-row", children: [
                  jsx("span", { key: "l", className: "dsk-rowLabel", children: t("inputBoxText") }),
                  jsx("input", {
                    key: "c",
                    type: "color",
                    className: "dsk-colorInput",
                    value: (cfg.inputBox && cfg.inputBox.textColor) || "#1c1c1e",
                    onChange: (e) => inputBoxUpdate({ textColor: e.target.value }),
                  }),
                  jsx("span", { key: "v", className: "dsk-rangeVal", children: (cfg.inputBox && cfg.inputBox.textColor) || t("chatColorDefault") }),
                ] }),
                jsx("div", { key: "row3", className: "dsk-row", children: [
                  jsx("span", { key: "l", className: "dsk-rowLabel", children: t("inputBoxOpacity") }),
                  jsx("input", { key: "r", type: "range", className: "dsk-range", min: 0, max: 100, step: 1, value: (cfg.inputBox && cfg.inputBox.opacity) ?? 100, onChange: (e) => inputBoxUpdate({ opacity: Number(e.target.value) }) }),
                  jsx("span", { key: "v", className: "dsk-rangeVal", children: String((cfg.inputBox && cfg.inputBox.opacity) ?? 100) + "%" }),
                ] }),
                jsx("div", { key: "row4", className: "dsk-row", children: [
                  jsx("span", { key: "l", className: "dsk-rowLabel", children: t("inputBoxBlur") }),
                  jsx("input", { key: "r", type: "range", className: "dsk-range", min: 0, max: 40, step: 1, value: (cfg.inputBox && cfg.inputBox.blur) || 0, onChange: (e) => inputBoxUpdate({ blur: Number(e.target.value) }) }),
                  jsx("span", { key: "v", className: "dsk-rangeVal", children: String((cfg.inputBox && cfg.inputBox.blur) || 0) + "px" }),
                ] }),
                jsx("div", { key: "actions", className: "dsk-cardActions", children: [
                  jsx("button", { key: "reset", type: "button", className: "dsk-btn", onClick: () => inputBoxUpdate({ bgColor: "", textColor: "", opacity: 100, blur: 0 }), children: t("chatColorReset") }),
                ] }),
              ] }),
              jsx("div", { key: "chatColor", className: "dsk-group", children: [
                jsx("div", { key: "title", className: "dsk-groupTitle", children: t("chatColorTitle") }),
                jsx("div", { key: "row", className: "dsk-row", children: [
                  jsx("span", { key: "l", className: "dsk-rowLabel", children: t("chatColorLabel") }),
                  jsx("input", {
                    key: "c",
                    type: "color",
                    className: "dsk-colorInput",
                    value: cfg.chatColor || "#f9fafb",
                    onChange: (e) => update({ chatColor: e.target.value }),
                  }),
                  jsx("span", { key: "v", className: "dsk-rangeVal", children: cfg.chatColor || t("chatColorDefault") }),
                  jsx("button", { key: "r", type: "button", className: "dsk-btn", onClick: () => update({ chatColor: "" }), children: t("chatColorReset") }),
                ] }),
              ] }),
              jsx("div", { key: "actions", className: "dsk-cardActions", children: [
                jsx("button", { key: "reset", type: "button", className: "dsk-btn dsk-btnDanger", onClick: reset, children: t("skinReset") }),
              ] }),
            ] }),
          ] }),
        ] }) : null,
      ] });
    }

    /* ------------------------------------------------------------------ *
     * Plugin contract
     * ------------------------------------------------------------------ */
    const inject = ["slots", "locale"];

    function apply(ctx) {
      ctx.effect(() => ctx.locale.register(NS, { zh, en }), "dsh-skin-master: dictionaries");
      const t = ctx.locale.bind(NS);
      ctx.slots.inject("sidebar.footer.action", () => ctx.slots.register({
        name: "sidebar.footer.action",
        id: "skin-master-panel",
        locale: NS,
      }, SkinPanel));
      ctx.effect(() => initSkin(), "dsh-skin-master: apply persisted skin");
      void t;
    }

    exports.apply = apply;
    exports.inject = inject;
    return module.exports;
  },
});
