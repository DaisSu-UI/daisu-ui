import 'dart:convert';
import 'dart:io';
import 'package:crypto/crypto.dart';
import 'package:flutter/foundation.dart';

class LoadedBundle {
  LoadedBundle(this._server, this.version);
  final HttpServer _server;
  final String version;
  String get templateUrl => 'http://127.0.0.1:${_server.port}/app.lynx.bundle';
  Future<void> close() async {
    await _server.close(force: true);
  }
}

class BundleLoader {
  void _checkUrl(Uri url) {
    if (url.scheme != 'https' && !(kDebugMode && url.scheme == 'http')) {
      throw FormatException('Bundle 地址需要 HTTPS；仅调试模式允许 HTTP');
    }
  }

  Future<Uint8List> _download(HttpClient client, Uri url) async {
    _checkUrl(url);
    final request = await client
        .getUrl(url)
        .timeout(const Duration(seconds: 20));
    final response = await request.close().timeout(const Duration(seconds: 20));
    if (response.statusCode != HttpStatus.ok)
      throw HttpException('下载失败：${response.statusCode}', uri: url);
    return consolidateHttpClientResponseBytes(
      response,
    ).timeout(const Duration(seconds: 30));
  }

  Future<LoadedBundle> load(Uri manifestUrl) async {
    final client = HttpClient();
    try {
      final decoded = jsonDecode(
        utf8.decode(await _download(client, manifestUrl)),
      );
      if (decoded is! Map<String, dynamic>)
        throw const FormatException('Manifest 格式无效');
      final version = decoded['version'],
          path = decoded['bundleUrl'],
          hash = decoded['sha256'];
      if (version is! String ||
          version.isEmpty ||
          path is! String ||
          hash is! String ||
          !RegExp(r'^[a-fA-F0-9]{64}$').hasMatch(hash)) {
        throw const FormatException('Manifest 需要 version、bundleUrl 和 SHA-256');
      }
      final bytes = await _download(client, manifestUrl.resolve(path));
      if (sha256.convert(bytes).toString() != hash.toLowerCase())
        throw const FormatException('Bundle SHA-256 校验失败');
      final server = await HttpServer.bind(InternetAddress.loopbackIPv4, 0);
      server.listen((request) async {
        if (request.method != 'GET' || request.uri.path != '/app.lynx.bundle') {
          request.response.statusCode = HttpStatus.notFound;
        } else {
          request.response.headers.contentType = ContentType.binary;
          request.response.contentLength = bytes.length;
          request.response.add(bytes);
        }
        await request.response.close();
      });
      return LoadedBundle(server, version);
    } finally {
      client.close(force: true);
    }
  }
}
