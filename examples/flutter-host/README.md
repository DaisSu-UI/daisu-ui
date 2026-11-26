# Flutter 宿主模板

先在空目录 flutter create --platforms android,ios daisu_host，再复制本目录的 lib 和 pubspec.yaml，运行 flutter pub get、flutter analyze。通过 --dart-define=LYNX_MANIFEST_URL=https://your-domain.example/manifest.json 指定 Manifest。

lynx_view 1.13.4 的 Dart API 已核对，但其声明的平台包仍可能解析到 Lynx 4.0，当前 UI 目标是 4.2。必须先完成原生引擎与 XElement 适配并锁定插件来源；本模板不宣称原生真机验收通过，不包含 Bundle。详见文档站 Flutter 接入与兼容性总表。
