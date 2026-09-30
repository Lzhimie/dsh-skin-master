# dsh-skin-master · Skin Master

A **custom skin plugin** for the DeepSeek Harness (DSH) desktop app: global wallpaper (image / video), frosted-glass blur, chat-input background, popover surfaces, filters, AI reply text and user bubble colors.

> Extracted from the community-plugins module (`dsh-community-plugins`) of [DeepSeek-Harness-NB](https://github.com/Lzhimie/DeepSeek-Harness-NB), with the community plugin center stripped out. Released under the MIT license.

## Features

- **Background image / video** — URL or local file (uploads persist across restarts); cover / contain / repeat modes; video volume & mute.
- **Effects** — background blur, UI transparency, image scale.
- **Filters** — brightness / contrast / saturation.
- **Input background** — an image on the chat input card: 6 modes (fill / fit / stretch / tile / center / span), gradient transition position, drag-to-position preview, image blur / opacity / scale; independent frosted input-card transparency.
- **Popover background** — opacity / blur / grain for command menus, pickers, overlays.
- **My messages** — bubble color, text color, opacity, blur.
- **AI reply text** — custom color.
- All settings apply live and persist on disk across restarts.

## Install

**Option A — Community plugin center (recommended):** search `dsh-skin-master` in the DSH desktop community plugin center, install, restart the app.

**Option B — CLI / manual:**

```bash
dsh plugin --profile web add dsh-skin-master
```

or clone this repo and add to your profile's `cordis.patch.yml`:

```yaml
- insert:
    - id: skin-master
      name: dsh-skin-master
```

then restart DeepSeek Harness.

## Storage

- Settings: `<DSH home>/dsh-skin-master/skin.json`
- Uploaded assets: `<DSH home>/dsh-skin-master/assets/`

**Migration:** settings from the legacy `community-skin.json` (and the browser `dsc.skin` key) are inherited read-only — no re-configuration needed.

## License

MIT — Copyright (c) 2026 Lzhimie. Extracted from DeepSeek-Harness-NB (`dsh-community-plugins`, MIT).
