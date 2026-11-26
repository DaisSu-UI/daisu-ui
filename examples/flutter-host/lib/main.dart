import 'dart:async';
import 'package:flutter/foundation.dart';
import 'package:flutter/gestures.dart';
import 'package:flutter/material.dart';
import 'package:lynx_view/lynx_view.dart';
import 'bundle_loader.dart';

void main() => runApp(const MaterialApp(home: DaisuPage()));

class DaisuPage extends StatefulWidget {
  const DaisuPage({super.key});
  @override
  State<DaisuPage> createState() => _DaisuPageState();
}

class _DaisuPageState extends State<DaisuPage> {
  LynxViewController? _controller;
  LoadedBundle? _bundle;
  String? _error;
  bool _loading = true;
  int _attempt = 0;
  bool _started = false;

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    if (!_started) {
      _started = true;
      unawaited(_load());
    }
  }

  Future<void> _load() async {
    final attempt = ++_attempt;
    final media = MediaQuery.of(context);
    final oldController = _controller;
    final oldBundle = _bundle;
    setState(() {
      _controller = null;
      _bundle = null;
      _loading = true;
      _error = null;
    });
    await oldController?.dispose();
    await oldBundle?.close();
    LoadedBundle? next;
    try {
      const address = String.fromEnvironment('LYNX_MANIFEST_URL');
      if (address.isEmpty) throw StateError('请设置 LYNX_MANIFEST_URL');
      next = await BundleLoader().load(Uri.parse(address));
      if (!mounted || attempt != _attempt) {
        await next.close();
        return;
      }
      final controller = LynxViewController(
        templateUrl: next.templateUrl,
        initData: {
          'theme': media.platformBrightness == Brightness.dark
              ? 'dark'
              : 'light',
          'viewportWidth': media.size.width,
        },
        onLoadSuccess: () {
          if (mounted && attempt == _attempt) setState(() => _loading = false);
        },
        onLoadError: (error) {
          if (mounted && attempt == _attempt)
            setState(() {
              _loading = false;
              _error = '${error.code}: ${error.message}';
            });
        },
      );
      setState(() {
        _bundle = next;
        _controller = controller;
      });
    } catch (error) {
      await next?.close();
      if (mounted && attempt == _attempt)
        setState(() {
          _loading = false;
          _error = error.toString();
        });
    }
  }

  @override
  void dispose() {
    _attempt++;
    final controller = _controller;
    final bundle = _bundle;
    unawaited(() async {
      await controller?.dispose();
      await bundle?.close();
    }());
    super.dispose();
  }

  @override
  Widget build(BuildContext context) => Scaffold(
    appBar: AppBar(title: const Text('Daisu UI')),
    body: Stack(
      children: [
        if (_controller != null)
          Positioned.fill(
            child: LynxView(
              key: ValueKey(_controller),
              controller: _controller!,
              gestureRecognizers: {
                Factory<OneSequenceGestureRecognizer>(
                  () => EagerGestureRecognizer(),
                ),
              },
            ),
          ),
        if (_loading) const Center(child: CircularProgressIndicator()),
        if (_error != null)
          Center(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                Padding(
                  padding: const EdgeInsets.all(16),
                  child: Text(_error!),
                ),
                FilledButton(
                  onPressed: () => unawaited(_load()),
                  child: const Text('重试'),
                ),
              ],
            ),
          ),
      ],
    ),
  );
}
