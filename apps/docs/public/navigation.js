export const aiPages = [
  { id: 'ai-guide', label: 'AI 总览', source: 'docs/ui/AI_GUIDE.md' },
  { id: 'ai-llm', label: 'LLMs.txt', source: 'apps/docs/ai/llm.md' },
  { id: 'ai-mcp', label: 'MCP 接入', source: 'apps/docs/ai/mcp.md' },
  { id: 'ai-skills', label: 'AI Skills', source: 'apps/docs/ai/skills.md' },
];
export const documentationGroups = [
  { id: 'quickstart', label: '快速开始', section: 'guide', pages: [
    { id: 'introduction', label: '介绍', source: 'apps/docs/pages/introduction.md' },
    { id: 'getting-started', label: '快速上手', source: 'apps/docs/getting-started.md' },
    { id: 'faq', label: '常见问题', source: 'apps/docs/pages/faq.md' },
  ] },
  { id: 'design', label: '设计系统', section: 'design', pages: [
    { id: 'design', label: '设计', source: 'apps/docs/pages/design.md' },
    { id: 'theme-customization', label: '定制主题', source: 'apps/docs/pages/theme.md' },
    { id: 'dark-mode', label: '深色模式', source: 'apps/docs/pages/dark-mode.md' },
    { id: 'style-overrides', label: '样式覆盖', source: 'apps/docs/pages/styles.md' },
  ] },
  { id: 'ai', label: 'AI', section: 'ai', pages: aiPages },
  { id: 'practice', label: '工程实践', section: 'guide', pages: [
    { id: 'integration', label: '组件库集成', source: 'apps/docs/pages/integration.md' },
    { id: 'platforms', label: '平台适配', source: 'apps/docs/pages/platforms.md' },
    { id: 'changelog', label: '更新日志', source: 'packages/daisu-ui/CHANGELOG.md' },
  ] },
  { id: 'community', label: '社区', section: 'guide', pages: [
    { id: 'contributing', label: '贡献指南', source: 'apps/docs/pages/contributing.md' },
    { label: '源码仓库', href: 'https://git.zilueit.com/daisu-ui/daisu-ui', external: true },
  ] },
];
export const guideGroups = documentationGroups.filter(group => group.section === 'guide');
export const articlePages = documentationGroups.flatMap(group => group.pages).filter(page => page.id);
export function pageSection(id) {
  if (id === 'changelog') return 'versions';
  return documentationGroups.find(group => group.pages.some(page => page.id && page.id === id))?.section || 'components';
}
export function headingId(page, label) {
  const slug = label.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, '-').replace(/^-|-$/g, '') || 'section';
  return `${page}-${slug}`;
}
/** Only versions backed by actual changelog headings become navigation targets. */
export function changelogVersions(markdown, currentVersion) {
  const versions = [], seen = new Set();
  for (const match of markdown.matchAll(/^##[ \t]+(v?(\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?))[ \t]*$/gm)) {
    if (seen.has(match[2])) continue;
    seen.add(match[2]);
    versions.push({ version: match[2], section: headingId('changelog', match[1]), current: match[2] === currentVersion });
  }
  if (!seen.has(currentVersion)) throw new Error(`Missing changelog entry for ${currentVersion}`);
  return versions;
}
/** Shared disclosure behavior for mouse, touch and keyboard navigation. */
export function createNavigationMenus(roots, document = globalThis.document) {
  const controller = new AbortController(), options = { signal: controller.signal };
  const menus = [...roots].map(root => ({ root, trigger: root.querySelector('[data-menu-trigger]'), panel: root.querySelector('[data-menu-panel]'), hovered: false }));
  const close = menu => { menu.panel.hidden = true; menu.trigger.setAttribute('aria-expanded', 'false'); menu.hovered = false; };
  const closeAll = () => menus.forEach(close);
  const open = menu => { menus.filter(other => other !== menu).forEach(close); menu.panel.hidden = false; menu.trigger.setAttribute('aria-expanded', 'true'); };
  const links = menu => [...menu.panel.querySelectorAll('a[href]:not([aria-disabled=true])')];
  for (const menu of menus) {
    close(menu);
    menu.trigger.addEventListener('click', () => { const show = menu.panel.hidden || menu.hovered; menu.hovered = false; if (show) open(menu); else close(menu); }, options);
    menu.root.addEventListener('pointerenter', event => { if (event.pointerType === 'mouse' && !menu.trigger.disabled) { open(menu); menu.hovered = true; } }, options);
    menu.root.addEventListener('pointerleave', event => { if (event.pointerType === 'mouse' && !menu.root.contains(document.activeElement)) close(menu); }, options);
    menu.root.addEventListener('focusout', event => { if (!menu.root.contains(event.relatedTarget)) close(menu); }, options);
    menu.panel.addEventListener('click', event => { if (event.target.closest('a[href]')) { close(menu); menu.trigger.focus({ preventScroll: true }); } }, options);
    menu.root.addEventListener('keydown', event => {
      const items = links(menu);
      if (event.key === 'Escape' && !menu.panel.hidden) { event.preventDefault(); event.stopPropagation(); close(menu); menu.trigger.focus(); return; }
      if (event.target === menu.trigger && (event.key === 'ArrowDown' || event.key === 'ArrowUp')) {
        event.preventDefault(); open(menu); (event.key === 'ArrowDown' ? items[0] : items.at(-1))?.focus(); return;
      }
      if (menu.panel.hidden || !items.includes(document.activeElement)) return;
      const index = items.indexOf(document.activeElement);
      const next = event.key === 'ArrowDown' ? (index + 1) % items.length : event.key === 'ArrowUp' ? (index + items.length - 1) % items.length : event.key === 'Home' ? 0 : event.key === 'End' ? items.length - 1 : null;
      if (next !== null) { event.preventDefault(); items[next].focus(); }
    }, options);
  }
  document.addEventListener('click', event => { if (!menus.some(menu => menu.root.contains(event.target))) closeAll(); }, options);
  return { closeAll, destroy() { closeAll(); controller.abort(); } };
}
