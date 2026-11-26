# Flutter 完整接入

本页提供远端 Manifest 下载、SHA-256 校验、本机 Bundle 服务、LynxViewController 生命周期与错误重试的宿主模板。UI 不内置 Flutter 业务协议，也不把 Bundle 打进 Flutter 安装包。

## 先核对引擎版本

当前 UI 的 Bundle 编译目标和开发类型均为 Lynx 4.0。2026-11-26 核对 pub.dev 发布归档：lynx_view 1.13.4 的依赖范围包含 lynx_view_android 1.12.4 与 lynx_view_ios 1.11.0；这两份平台包中的 Gradle / podspec 声明 Lynx 4.0.0。此前的 4.2 Bundle 必须按 4.0 重新构建，替换远端文件并更新 Manifest 哈希。

| 核对项 | 本次结果 | 接入前要求 |
| --- | --- | --- |
| ReactLynx 编译目标 | 4.0；开发类型固定 @lynx-js/types@4.0.0 | 与宿主原生引擎匹配 |
| lynx_view Dart API | 已核对 1.13.4 的公开控制器接口 | 锁定实际安装版本 |
| Android 平台归档 | 1.12.4，声明 Lynx 4.0.0 | 核对实际 Gradle 依赖及 XElement 注册 |
| iOS 平台归档 | 1.11.0，声明 Lynx 4.0.0 | 核对实际 Pods 及元素注册 |
| 原生设备验收 | 本轮未执行 | 分 Android / iOS 记录设备与结果 |

平台依赖有范围约束，实际解析结果以 pubspec.lock、Podfile.lock 和 Gradle 依赖树为准；表中记录的是明确核对过的归档，不推断未来版本。只改 Dart 版本、类型包、engineVersion 或一个 Gradle 强制版本都不代表整套宿主已兼容。使用已适配的插件分支时，应锁定真实提交，并保留许可证；不要在本库中伪造已通过的兼容声明。

## 获取宿主模板

[下载 Flutter 宿主模板 ZIP](./downloads/daisu-ui-flutter-host.zip)。它是集成模板，不是已通过真机验收的插件发行版。准备好兼容的宿主后：

```bash
flutter create --platforms android,ios daisu_host
cd daisu_host
# 将下载包中的 lib/ 与 pubspec.yaml 复制到工程。
# 核对并锁定 lynx_view 的 4.0 引擎依赖及所需元素注册。
flutter pub get
flutter analyze
flutter run --dart-define=LYNX_MANIFEST_URL=https://your-domain.example/ui/manifest.json
```

模板保留 lynx_view 1.13.4 的真实 Dart API 作为核对基线，搭配 4.0 目标 Bundle。模板不包含账号、Token、原生 SDK 或 Bundle。Android 配置网络权限；开发 HTTP 例外只用于调试，线上使用 HTTPS。iOS 真机也应使用可访问的 HTTPS 地址。

## 构建并发布 Bundle

先运行 [浏览器完整接入](./web-quickstart.md) 的最小工程，取得 dist/app.lynx.bundle。将它上传到版本化资源目录，生成以下 Manifest；哈希必须来自上传的同一份文件：

```json
{
  "version": "0.1.0-beta.4-demo.1",
  "bundleUrl": "./app.lynx.bundle",
  "sha256": "替换为实际Bundle文件的64位SHA256"
}
```

```bash
sha256sum dist/app.lynx.bundle
```

这是宿主模板采用的最小 Manifest 格式，不宣称与所有业务宿主协议相同。真实项目可适配自己的版本、签名、缓存与回滚协议。

## 运行时加载流程

模板的 BundleLoader 在 Flutter 运行时读取 Manifest、下载 Bundle 并比对 SHA-256；验证成功后开启仅监听回环地址的本机 HTTP 服务，再将地址交给 LynxViewController(templateUrl: ..., initData: ...)。这避免依赖各平台插件对 file:// 的不同支持。

LynxView 放在 Expanded / SizedBox 等有明确尺寸的布局中；无尺寸的 PlatformView 不会正确加载。示例注入 theme、viewportWidth 等普通数据，不传 DOM 对象或 Promise。页面销毁时释放控制器并关闭本机服务，重试前释放上一轮资源。

## 本机回环服务的网络配置

Manifest 和远端 Bundle 在线上使用 HTTPS；校验后的本机服务使用 http://127.0.0.1，两者需要分别配置。Android 应声明 INTERNET 权限，并为 127.0.0.1 配置明确的 HTTP 例外；不要仅设置调试环境的全局 cleartext 开关后就认为发布版本也能加载。

在 Android app/src/main/res/xml/daisu_network_security.xml 中添加：

```xml
<network-security-config>
  <base-config cleartextTrafficPermitted="false" />
  <domain-config cleartextTrafficPermitted="true">
    <domain includeSubdomains="false">127.0.0.1</domain>
  </domain-config>
</network-security-config>
```

在 AndroidManifest.xml 中声明 android.permission.INTERNET，并为 application 指定 android:networkSecurityConfig="@xml/daisu_network_security"。iOS 根据目标系统与所选插件的 URL 加载方式核对 ATS 本机访问配置，例如 NSAllowsLocalNetworking；这些配置仍须用实际构建验收，不能据 Dart 测试推断原生网络策略已经通过。

## 手势与业务桥接

LynxView.gestureRecognizers 决定 Flutter 与 Lynx 的手势竞争。模板为独立全屏页面配置 EagerGestureRecognizer；嵌入 Flutter 的可滚动区域时，应按页面设计配置，不能直接照搬并吞掉父级滚动。

Upload、原生媒体、图片裁剪、返回键拦截等由消费项目提供宿主协议。浏览器的 @daisu-ui/ui/web 注册函数不在 Flutter 原生 Bundle 中执行，不能代替原生元素或播放器。详见 [兼容性总表](./compatibility.md)。

## 验收清单

核对 Manifest 与哈希不一致时拒绝加载、下载失败能重试、页面关闭会释放资源、主题与尺寸注入正确；然后在两端验证输入法、SVG、弹层、列表、返回键及手势。完整报告记录原生引擎版本和平台插件锁定结果，不能仅记录“浏览器通过”。
