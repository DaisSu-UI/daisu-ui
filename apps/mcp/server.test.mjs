import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import { tmpdir } from 'node:os';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';

let client;
before(async () => {
  client = new Client({ name: 'daisu-ui-integration-test', version: '1.0.0' });
  await client.connect(new StdioClientTransport({ command: process.execPath, args: [fileURLToPath(new URL('./index.mjs', import.meta.url))], cwd: tmpdir(), stderr: 'pipe' }));
});
after(async () => { await client?.close(); });
const call = (name, args = {}) => client.callTool({ name, arguments: args });
const resultText = result => result.content.map(item => item.text).join('\n');

test('stdio initialization and tools discovery work outside the repository cwd', async () => {
  assert.equal(client.getServerVersion().name, 'daisu-ui');
  const { tools } = await client.listTools();
  assert.deepEqual(tools.map(tool => tool.name), ['list_components', 'get_component', 'get_demo', 'search_docs', 'get_changelog']);
  const components = JSON.parse(resultText(await call('list_components', { query: 'Button' })));
  assert(components.some(item => item.id === 'button'));
});
test('component names, related public exports and API/theme sections resolve real documents', async () => {
  assert.match(resultText(await call('get_component', { component: 'Button', section: 'api' })), /onTap/);
  assert.match(resultText(await call('get_component', { component: 'ConfigProvider', section: 'tokens' })), /--cso-ui-/);
  assert.match(resultText(await call('get_component', { component: 'FormItem' })), /FormItem/);
  assert.match(resultText(await call('get_component', { component: 'Button', section: 'examples' })), /<Button/);
});
test('demo source, document search and changelog return current repository content', async () => {
  assert.match(resultText(await call('get_demo', { component: 'Button' })), /apps\/demo\/src\/features\/ui-demo\/examples\/button.tsx/);
  const found = JSON.parse(resultText(await call('search_docs', { query: 'Button onTap', limit: 2 })));
  assert(found.length > 0 && found.length <= 2);
  assert.equal(found[0].id, 'button');
  assert.match(resultText(await call('get_changelog')), /0\.1\.0-beta\.1/);
});
test('resources expose actual documentation and reject arbitrary file access', async () => {
  const { resources } = await client.listResources();
  assert.equal(resources.length, 3);
  const result = await client.readResource({ uri: 'daisu-ui://docs/llms' });
  assert.match(result.contents[0].text, /Daisu UI/);
  await assert.rejects(client.readResource({ uri: 'file:///etc/passwd' }));
});
test('invalid queries and unknown component paths produce actionable errors', async () => {
  assert.equal((await call('search_docs', { query: ' ', limit: 0 })).isError, true);
  assert.equal((await call('get_component', { component: '../../etc/passwd' })).isError, true);
  assert.equal((await call('get_component', { component: 'Button', path: '/etc/passwd' })).isError, true);
  assert.match(resultText(await call('get_component', { component: 'MissingComponent' })), /list_components/);
});
