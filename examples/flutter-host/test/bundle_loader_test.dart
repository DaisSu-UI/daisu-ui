import 'dart:convert';
import 'dart:io';
import 'package:crypto/crypto.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:daisu_flutter_host/bundle_loader.dart';

void main() {
  test(
    'downloads remote Manifest, verifies bytes and closes the local Bundle service',
    () async {
      final bytes = utf8.encode('test bundle');
      final remote = await HttpServer.bind(InternetAddress.loopbackIPv4, 0);
      addTearDown(() => remote.close(force: true));
      remote.listen((request) async {
        if (request.uri.path == '/manifest.json') {
          request.response.write(
            jsonEncode({
              'version': 'test-1',
              'bundleUrl': './app.bundle',
              'sha256': sha256.convert(bytes).toString(),
            }),
          );
        } else {
          request.response.add(bytes);
        }
        await request.response.close();
      });
      final bundle = await BundleLoader().load(
        Uri.parse('http://127.0.0.1:${remote.port}/manifest.json'),
      );
      final client = HttpClient();
      addTearDown(() => client.close(force: true));
      final url = Uri.parse(bundle.templateUrl);
      final response = await (await client.getUrl(url)).close();
      expect(await utf8.decoder.bind(response).join(), 'test bundle');
      expect(bundle.version, 'test-1');
      await bundle.close();
      await expectLater(() async {
        final request = await client.getUrl(url);
        await request.close();
      }, throwsA(anyOf(isA<SocketException>(), isA<HttpException>())));
    },
  );
  test(
    'checksum mismatch is rejected before a local Bundle is exposed',
    () async {
      final remote = await HttpServer.bind(InternetAddress.loopbackIPv4, 0);
      addTearDown(() => remote.close(force: true));
      remote.listen((request) async {
        request.response.write(
          request.uri.path == '/manifest.json'
              ? jsonEncode({
                  'version': 'test',
                  'bundleUrl': './bundle',
                  'sha256': '0' * 64,
                })
              : 'changed bytes',
        );
        await request.response.close();
      });
      await expectLater(
        BundleLoader().load(
          Uri.parse('http://127.0.0.1:${remote.port}/manifest.json'),
        ),
        throwsA(isA<FormatException>()),
      );
    },
  );
}
