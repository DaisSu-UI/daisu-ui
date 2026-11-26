import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { dirname, extname, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
const root = process.env.DAISU_DOCS_ROOT ? resolve(process.env.DAISU_DOCS_ROOT) : resolve(dirname(fileURLToPath(import.meta.url)), 'dist');
const basePath = process.env.DAISU_DOCS_BASE_PATH || '/';
if (!basePath.startsWith('/') || !basePath.endsWith('/') || /[?#\\]/.test(basePath) || basePath.split('/').some(part => part === '.' || part === '..')) {
  throw new Error('DAISU_DOCS_BASE_PATH must be an absolute URL path with a trailing slash');
}
const mime = { '.zip': 'application/zip', '.md': 'text/markdown; charset=utf-8', '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.txt': 'text/plain; charset=utf-8', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.wasm': 'application/wasm', '.bundle': 'application/octet-stream' };
const server = createServer(async (request, response) => {
  try {
    const url = new URL(request.url, 'http://localhost');
    const pathname = decodeURIComponent(url.pathname);
    if (basePath !== '/' && pathname === basePath.slice(0, -1)) {
      response.writeHead(301, { Location: basePath + url.search }).end(); return;
    }
    if (!pathname.startsWith(basePath)) { response.writeHead(404).end('Not found'); return; }
    let path = resolve(root, pathname.slice(basePath.length));
    if (path !== root && !path.startsWith(root + sep)) { response.writeHead(403).end(); return; }
    if ((await stat(path)).isDirectory()) path = resolve(path, 'index.html');
    response.writeHead(200, { 'Content-Type': mime[extname(path)] || 'application/octet-stream', 'Cache-Control': 'no-cache' });
    response.end(await readFile(path));
  } catch { response.writeHead(404).end('Not found'); }
});
const host = process.env.DAISU_DOCS_HOST || '0.0.0.0';
server.listen(Number(process.env.DAISU_DOCS_PORT || 3090), host, () => {
  const address = host === '0.0.0.0' ? 'localhost' : host;
  console.log(`Daisu UI docs: http://${address}:${server.address().port}${basePath} (host: ${host})`);
});
