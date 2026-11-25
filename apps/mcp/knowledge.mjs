import { readFile } from 'node:fs/promises';

const root = new URL('../../', import.meta.url);
const text = path => readFile(new URL(path, root), 'utf8');
const normalize = value => value.toLowerCase().replace(/[^a-z0-9]/g, '');

export async function loadKnowledge() {
  const manifest = JSON.parse(await text('docs/ui/component-sources.json'));
  const { version } = JSON.parse(await text('packages/daisu-ui/package.json'));
  const entries = await Promise.all(Object.entries(manifest).map(async ([id, entry]) => {
    const markdown = await text(entry.doc);
    return { id, ...entry, markdown, title: markdown.match(/^#\s+(.+)$/m)?.[1] || id };
  }));
  function component(name) {
    const key = normalize(name);
    const found = entries.find(entry => normalize(entry.id) === key || entry.components.some(item => normalize(item.name) === key));
    if (!found) throw new Error(`Unknown component: ${name}. Use list_components to find available names.`);
    return found;
  }
  return {
    version,
    list(query = '') {
      const key = query.toLowerCase();
      return entries.filter(entry => `${entry.id} ${entry.title} ${entry.components.map(item => item.name).join(' ')}`.toLowerCase().includes(key))
        .map(entry => ({ id: entry.id, title: entry.title, components: entry.components.map(item => item.name), demo: !!entry.demo }));
    },
    document(name, section = 'full') {
      const entry = component(name);
      if (section === 'full') return entry.markdown;
      const sections = entry.markdown.split(/(?=^## )/m);
      const selected = sections.filter(part => {
        const title = part.split('\n', 1)[0];
        return section === 'api' ? /^## (?:Attributes|Props|Events|Methods|Slots|参数|属性|事件|方法|数据类型)/i.test(title)
          : section === 'tokens' ? /^## 主题定制/.test(title)
          : part.includes('```tsx') && !/^## (?:数据类型|主题定制)/.test(title);
      });
      return selected.length ? `# ${entry.title}\n\n${selected.join('\n')}` : `# ${entry.title}\n\nNo ${section} section is documented. Read the full component document.`;
    },
    async demo(name) {
      const entry = component(name);
      return entry.demo ? `${entry.demo}\n\n${await text(entry.demo)}` : `No standalone demo source is available for ${entry.title}. Read its document examples.`;
    },
    search(query, limit) {
      const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
      return entries.map(entry => {
        const source = `${entry.title}\n${entry.markdown}`;
        const lower = source.toLowerCase();
        if (!terms.every(term => lower.includes(term))) return null;
        const index = lower.indexOf(terms[0]);
        return { id: entry.id, title: entry.title, excerpt: source.slice(Math.max(0, index - 80), index + 320), score: terms.filter(term => entry.title.toLowerCase().includes(term)).length };
      }).filter(Boolean).sort((a, b) => b.score - a.score).slice(0, limit).map(({ score, ...item }) => item);
    },
    changelog: () => text('packages/daisu-ui/CHANGELOG.md'),
    resources: [
      { uri: 'daisu-ui://docs/llms', name: 'Daisu UI 文档索引', mimeType: 'text/plain', path: 'docs/ui/llms.txt' },
      { uri: 'daisu-ui://docs/llms-full', name: 'Daisu UI 完整文档', mimeType: 'text/plain', path: 'docs/ui/llms-full.txt' },
      { uri: 'daisu-ui://docs/agent-rules', name: 'Daisu UI 开发规则', mimeType: 'text/markdown', path: 'AGENTS.md' },
    ],
    readResource: text,
  };
}
