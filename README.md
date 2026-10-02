# dsh-skin-master · 皮肤大师

DeepSeek Harness（DSH）桌面端的**自定义皮肤插件**：给整个应用换壁纸、开毛玻璃、定制输入框与弹出框外观、调整 AI 回复文本和消息气泡颜色。

> 本插件从 [DeepSeek-Harness-NB](https://github.com/Lzhimie/DeepSeek-Harness-NB) 的社区插件模块（`dsh-community-plugins`）中提取"自定义皮肤"功能，剥离社区插件中心依赖后独立发布，MIT 许可。

![Uploading image.png…]()

## 功能

- **背景图片 / 背景视频**：支持 URL 或本地文件（本地上传持久化，重启有效）；封面 / 适应 / 平铺三种显示模式；视频支持音量与静音。
- **效果**：背景模糊（毛玻璃）、界面透明度、图片缩放。
- **滤镜**：亮度 / 对比度 / 饱和度，一键恢复默认。
- **输入框背景**：在聊天输入卡片上铺一张图，6 种图片模式（填充 / 适应 / 拉伸 / 平铺 / 居中 / 跨区）、渐变过渡位置、拖拽预览调整图片位置、图片模糊 / 透明 / 缩放；输入框透明度独立调节（毛玻璃效果）。
- **展开框背景**：命令菜单、模型选择、工作区、搜索等弹出框的透明度 / 毛玻璃模糊 / 颗粒纹理。
- **我发送的消息**：气泡背景色、文字颜色、透明度、模糊度。
- **AI 回复文本**：自定义颜色。
- 所有设置实时生效，并持久化到宿主磁盘，重启应用后自动恢复。

## 安装

### 方式一：社区插件中心（推荐）

在 DeepSeek Harness 桌面端的社区插件中心搜索 `dsh-skin-master`，一键安装后重启客户端即可。

### 方式二：发给 AI 一句话自动安装（零命令行，推荐新手）

复制下面整段话（点代码块右上角的复制按钮），粘贴发给 DeepSeek Harness 里的 AI，它就会帮你把插件装好：

```text
请帮我安装 DeepSeek Harness 的皮肤插件 dsh-skin-master：
1. 运行 `dsh plugin --profile desktop add "github:Lzhimie/dsh-skin-master"`。如果提示找不到 dsh 命令，到 DeepSeek Harness 安装目录的 resources/runtime/cli/bin/ 下用 dsh.cmd 的完整路径执行；如果下载失败，请配置系统代理后重试。
2. 编辑 ~/.dsh/profiles/desktop/cordis.patch.yml，在文件末尾追加以下内容：
   - insert:
       - id: skin-master
         name: dsh-skin-master
3. 全部完成后提醒我重启 DeepSeek Harness 生效。
```

> 安装包从 GitHub 拉取，需网络能访问 github.com（必要时开代理）。重启后在侧边栏底部点击调色盘图标打开「皮肤大师」。

### 方式三：命令行 / 手动

```bash
# 使用 DSH 命令行安装
dsh plugin --profile web add dsh-skin-master
```

或手动克隆本仓库后，在你的 profile 的 `cordis.patch.yml` 中加入：

```yaml
- insert:
    - id: skin-master
      name: dsh-skin-master
```

然后重启 DeepSeek Harness。

## 使用说明

侧边栏底部点击调色盘图标打开「皮肤大师」抽屉：

- **启用背景**：全局壁纸总开关。
- **背景图片 / 背景视频**：填 URL 或选本地文件；图片组含显示模式与「清除背景」。
- **效果**：模糊（毛玻璃）、界面透明、图片缩放。注意：模糊 / 透明 / 滤镜需要背景层才能生效。
- **滤镜**：亮度 / 对比度 / 饱和度。
- **输入框背景**：输入卡片图片壁纸，可用 6 种模式 chips 切换，拖动预览框调整图片位置。
- **输入框透明**：输入卡片自身透明度（毛玻璃）。
- **展开框背景**：弹出框透明度 / 模糊度 / 颗粒度。
- **我发送的消息**：气泡颜色、文字颜色、透明度、模糊度。
- **AI 回复文本**：自定义颜色。
- 底部「恢复默认」一键还原全部设置。

## 数据存储位置

- 设置文件：`<DSH 主目录>/dsh-skin-master/skin.json`
- 本地上传的背景文件：`<DSH 主目录>/dsh-skin-master/assets/`

（主目录解析顺序：`DSH_HOME` 环境变量 → profile 目录布局推断 → `~/.dsh`（官方默认主目录）。）

## 迁移说明

- 若你之前使用过原「社区插件中心」的自定义皮肤功能，本插件会**只读继承**旧的 `<主目录>/community-skin.json` 设置与浏览器内旧配置（`dsc.skin`），无需重新设置；在你第一次修改设置后才写入新文件。

## 出处与许可

- 功能提取自 DeepSeek-Harness-NB 的 `dsh-community-plugins` 模块（MIT License）。
- 本插件以 [MIT](./LICENSE) 许可发布，Copyright (c) 2026 Lzhimie。

另见[英文说明](./README_EN.md)。
