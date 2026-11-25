import { cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { basename, dirname, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import MarkdownIt from 'markdown-it';
import hljs from 'highlight.js/lib/core';
import javascript from 'highlight.js/lib/languages/javascript';
import typescript from 'highlight.js/lib/languages/typescript';
import css from 'highlight.js/lib/languages/css';
import xml from 'highlight.js/lib/languages/xml';
import bash from 'highlight.js/lib/languages/bash';
import json from 'highlight.js/lib/languages/json';
import markdownLanguage from 'highlight.js/lib/languages/markdown';
import ts from 'typescript';
import { articlePages, changelogVersions } from './public/navigation.js';

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, '../..');
const output = resolve(here, 'dist');
for (const [name, language] of Object.entries({ javascript, typescript, css, xml, bash, json, markdown: markdownLanguage })) hljs.registerLanguage(name, language);
hljs.registerAliases(['tsx', 'ts'], { languageName: 'typescript' });
hljs.registerAliases(['jsx', 'js'], { languageName: 'javascript' });
hljs.registerAliases(['html', 'vue'], { languageName: 'xml' });
hljs.registerAliases(['sh', 'shell'], { languageName: 'bash' });
const markdown = new MarkdownIt({
  html: false, linkify: true, typographer: true,
  highlight(code, language) {
    return language && hljs.getLanguage(language) ? hljs.highlight(code, { language, ignoreIllegals: true }).value : '';
  },
});
const source = await readFile(resolve(root, 'apps/demo/src/features/ui-demo/catalog.ts'), 'utf8');
const catalogJS = ts.transpile(source, { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 });
const { componentGroups } = await import(`data:text/javascript;base64,${Buffer.from(catalogJS).toString('base64')}`);
const docsGroups = componentGroups.map(group => ({ ...group, items: group.items.filter(item => item.id !== 'ai-guide') })).filter(group => group.items.length);
const aliases = { 'form-detail': 'form', 'input-number': 'stepper', tabs: 'tab' };
const pages = {};
for (const group of docsGroups) {
  for (const item of group.items) {
    let content;
    for (const name of [item.id, aliases[item.id]].filter(Boolean)) {
      try { content = await readFile(resolve(root, `docs/ui/components/${name}.md`), 'utf8'); break; }
      catch (error) { if (error.code !== 'ENOENT') throw error; }
    }
    if (!content) throw new Error(`Missing component documentation: ${item.id}`);
    content = content.replaceAll("from '@/ui'", "from 'daisu-ui'").replaceAll('from "@/ui"', 'from "daisu-ui"');
    pages[item.id] = markdown.render(content);
  }
}
const changelog = await readFile(resolve(root, 'packages/daisu-ui/CHANGELOG.md'), 'utf8');
for (const page of articlePages) pages[page.id] = markdown.render(page.id === 'changelog' ? changelog : await readFile(resolve(root, page.source), 'utf8'));
const packageInfo = JSON.parse(await readFile(resolve(root, 'packages/daisu-ui/package.json'), 'utf8'));
await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
await cp(resolve(here, 'public'), output, { recursive: true });
await mkdir(resolve(output, 'sources'), { recursive: true });
async function emitSource(path, key) {
  const code = await readFile(path, 'utf8');
  const language = path.endsWith('.md') ? 'markdown' : 'typescript';
  const destination = resolve(output, 'sources', key);
  await mkdir(dirname(destination), { recursive: true });
  await writeFile(destination, code);
  await writeFile(destination + '.json', JSON.stringify({
    name: basename(path),
    path: relative(root, path),
    language,
    code,
    html: hljs.highlight(code, { language, ignoreIllegals: true }).value,
    lines: code.trimEnd().split('\n').length,
  }));
}
const sourceManifest = JSON.parse(await readFile(resolve(root, 'docs/ui/component-sources.json'), 'utf8'));
for (const [id, entry] of Object.entries(sourceManifest)) {
  const folder = resolve(output, 'sources', id);
  await mkdir(folder, { recursive: true });
  for (const component of entry.components) {
    await emitSource(resolve(root, component.path), `${id}/${basename(component.path)}.txt`);
  }
  if (entry.demo) await emitSource(resolve(root, entry.demo), `${id}/demo.tsx.txt`);
  await emitSource(resolve(root, entry.doc), `${id}/docs.md.txt`);
}
for (const [source, filename] of [
  ['packages/daisu-ui/src/Button.tsx', 'Button.tsx.txt'],
  ['apps/demo/src/features/ui-demo/examples/button.tsx', 'button-demo.tsx.txt'],
  ['docs/ui/components/button.md', 'button.md.txt'],
]) await emitSource(resolve(root, source), filename);
const versions = changelogVersions(changelog, packageInfo.version);
await writeFile(resolve(output, 'content.json'), JSON.stringify({ version: packageInfo.version, versions, groups: docsGroups, pages }));
for (const [source, name] of [['llms.txt', 'llms.txt'], ['llms-full.txt', 'llms-full.txt'], ['COMPONENT_AI_NOTES.md', 'component-ai-notes.txt']]) await cp(resolve(root, 'docs/ui', source), resolve(output, name));
await cp(resolve(root, 'apps/demo/h5-dist'), resolve(output, 'demo'), { recursive: true });
console.log(`Documentation built: ${Object.keys(pages).length} pages, embedded Demo → ${output}`);
