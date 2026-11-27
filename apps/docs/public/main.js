import { createDemoPreview } from './demo-preview.js';
import { resolveDocumentationHref } from './documentation-links.js';
import { createDocumentSearch } from './search.js';
import { createSourceViewer, sourceRoute } from './source-viewer.js';
import { aiPages, relatedAiPages, relatedGuidePages, articlePages, documentationGroups, guideGroups, pageSection, headingId, createNavigationMenus } from './navigation.js';

const article = document.querySelector('#article');
const catalog = document.querySelector('#catalog');
const demo = document.querySelector('#demo');
const search = document.querySelector('#search');
const outline = document.querySelector('#outline');
const componentTrigger = document.querySelector('#component-trigger');
const categories = document.querySelector('#component-categories');
const catalogToggle = document.querySelector('#catalog-toggle');
const sidebar = document.querySelector('.sidebar');
const home = document.querySelector('#home');
const workspace = document.querySelector('.workspace');
const collapsedGroups = new Set();
const mobileViewport = matchMedia('(max-width: 680px)');
const isGuide = () => pageSection(current) !== 'components';
const navigationMenus = createNavigationMenus(document.querySelectorAll('[data-nav-menu]'));
function setCatalogOpen(open) {
  if (open) navigationMenus.closeAll();
  sidebar.classList.toggle('is-open', open);
  catalogToggle.setAttribute('aria-expanded', String(open));
}
catalogToggle.addEventListener('click', () => setCatalogOpen(catalogToggle.getAttribute('aria-expanded') !== 'true'));
mobileViewport.addEventListener('change', () => { setCatalogOpen(false); navigationMenus.closeAll(); });
let theme = localStorage.getItem('daisu-docs-theme') || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
document.documentElement.dataset.theme = theme;
let content;
let current;
let headings = [];
let outlineFrame;
function syncOutline() {
  const offset = document.querySelector('header').getBoundingClientRect().bottom + 48;
  let active = headings[0];
  for (const heading of headings) {
    if (heading.getBoundingClientRect().top > offset) break;
    active = heading;
  }
  for (const link of outline.querySelectorAll('a')) {
    const selected = link.dataset.section === active?.id;
    link.classList.toggle('active', selected);
    if (selected) link.setAttribute('aria-current', 'location');
    else link.removeAttribute('aria-current');
  }
}
function queueOutline() {
  cancelAnimationFrame(outlineFrame);
  outlineFrame = requestAnimationFrame(syncOutline);
}
window.addEventListener('scroll', queueOutline, { passive: true });
window.addEventListener('resize', queueOutline);
const sourceViewer = createSourceViewer(document.querySelector('#source-viewer'), () => {
  const [page, query = ''] = location.hash.slice(2).split('?');
  const params = new URLSearchParams(query);
  params.delete('source');
  const suffix = params.size ? `?${params}` : '';
  history.replaceState(history.state, '', `#/${page || 'getting-started'}${suffix}`);
  sourceViewer.hide();
});
const documentSearch = createDocumentSearch(document.querySelector('#document-search'), target => { location.hash = target.startsWith('#/') ? target : `#/${target}`; });
document.querySelector('#document-search-trigger').addEventListener('click', () => { navigationMenus.closeAll(); setCatalogOpen(false); documentSearch.open(); });
document.querySelector('.main-nav').addEventListener('click', event => { if (event.target.closest('[data-menu-trigger]')) setCatalogOpen(false); });
function scrollToSection(section) {
  if (!section) { window.scrollTo(0, 0); return; }
  const heading = document.getElementById(section);
  if (heading && article.contains(heading)) heading.scrollIntoView({ block: 'start' });
}
function sectionLink(id) {
  return `#/${current}?section=${encodeURIComponent(id)}`;
}
function renderOutline() {
  outline.replaceChildren();
  const ids = new Set();
  for (const heading of article.querySelectorAll('h2, h3')) {
    const label = heading.textContent;
    const base = headingId(current, label);
    let id = base;
    for (let suffix = 2; ids.has(id); suffix++) id = `${base}-${suffix}`;
    ids.add(id); heading.id = id; heading.dataset.label = label;
    const anchor = document.createElement('a');
    anchor.className = 'heading-anchor'; anchor.href = sectionLink(id);
    anchor.setAttribute('aria-label', `定位到${label}`); anchor.textContent = '#';
    heading.append(anchor);
    if (heading.tagName !== 'H2') continue;
    const item = document.createElement('li');
    const link = document.createElement('a');
    link.href = sectionLink(id); link.textContent = label; link.dataset.section = id;
    item.append(link); outline.append(item);
  }
  document.querySelector('.page-outline').hidden = !outline.children.length;
  headings = [...article.querySelectorAll('h2')];
  queueOutline();
}
function renderCatalog() {
  const keyword = search.value.trim().toLowerCase();
  catalog.replaceChildren();
  let count = 0;
  for (const group of content.groups) {
    const items = group.items.filter(item => `${group.label} ${item.id} ${item.label}`.toLowerCase().includes(keyword));
    if (!items.length) continue;
    const section = document.createElement('section');
    section.className = 'catalog-group';
    section.dataset.group = group.id;
    const heading = document.createElement('h2');
    const toggle = document.createElement('button');
    toggle.type = 'button';
    toggle.className = 'catalog-heading';
    const expanded = !!keyword || !collapsedGroups.has(group.id);
    toggle.setAttribute('aria-expanded', String(expanded));
    toggle.setAttribute('aria-controls', `catalog-${group.id}`);
    const title = document.createElement('span');
    title.textContent = group.label;
    const chevron = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    chevron.setAttribute('class', 'chevron');
    chevron.setAttribute('viewBox', '0 0 16 16');
    chevron.setAttribute('aria-hidden', 'true');
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', 'm4 6 4 4 4-4');
    chevron.append(path); toggle.append(title, chevron); heading.append(toggle);
    const list = document.createElement('div');
    list.className = 'catalog-items'; list.id = `catalog-${group.id}`; list.hidden = !expanded;
    toggle.addEventListener('click', () => {
      const open = list.hidden;
      list.hidden = !open; toggle.setAttribute('aria-expanded', String(open));
      if (open) collapsedGroups.delete(group.id); else collapsedGroups.add(group.id);
    });
    section.append(heading, list); catalog.append(section);
    for (const item of items) {
      const link = document.createElement('a');
      link.href = `#/${item.id}`;
      link.textContent = item.label;
      link.title = item.label;
      if (item.id === current) { link.className = 'active'; link.setAttribute('aria-current', 'page'); }
      list.append(link);
      count++;
    }
  }
  document.querySelector('#no-results').hidden = count !== 0;
  if (isGuide()) document.querySelector('#no-results').hidden = true;
}
function revealCurrentComponent() {
  if (search.value.trim()) return;
  const active = (isGuide() ? document.querySelector('#guide-catalog') : catalog).querySelector('a.active');
  if (!active) return;
  if (!isGuide()) {
    const group = active.closest('.catalog-group');
    group.querySelector('.catalog-items').hidden = false;
    group.querySelector('button').setAttribute('aria-expanded', 'true');
    collapsedGroups.delete(group.dataset.group);
  }
  if (mobileViewport.matches) return;
  const visible = sidebar.getBoundingClientRect(), rect = active.getBoundingClientRect();
  if (rect.top < visible.top || rect.bottom > visible.bottom) sidebar.scrollTop += rect.top - visible.top - 100;
}
function renderPagination() {
  const pagination = document.querySelector('#doc-pagination');
  pagination.replaceChildren();
  const pages = isGuide() ? articlePages : content.groups.flatMap(group => group.items);
  const index = pages.findIndex(page => page.id === current);
  for (const [offset, label, direction] of [[-1, '上一篇', 'previous'], [1, '下一篇', 'next']]) {
    const page = pages[index + offset];
    if (!page) continue;
    const link = document.createElement('a');
    link.href = `#/${page.id}`; link.className = direction;
    const caption = document.createElement('span');
    caption.textContent = `${direction === 'previous' ? '← ' : ''}${label}${direction === 'next' ? ' →' : ''}`;
    const title = document.createElement('strong');
    title.textContent = page.label;
    link.append(caption, title); pagination.append(link);
  }
}
function renderCategories() {
  categories.replaceChildren();
  for (const group of content.groups) {
    if (!group.items.length) continue;
    const link = document.createElement('a');
    link.href = `#/${group.items[0].id}`;
    link.dataset.group = group.id;
    const name = document.createElement('span');
    name.textContent = group.label;
    const count = document.createElement('small');
    count.textContent = `${group.items.length} 个组件`;
    link.append(name, count);
    categories.append(link);
  }
}
function pageLink(page, description = false) {
  const link = document.createElement('a');
  link.href = page.href || `#/${page.id}`;
  if (page.external) { link.target = '_blank'; link.rel = 'noopener noreferrer'; }
  link.className = 'guide';
  const copy = document.createElement('span');
  copy.className = 'menu-copy';
  const label = document.createElement('span'); label.textContent = page.label; copy.append(label);
  if (description && page.description) { const small = document.createElement('small'); small.textContent = page.description; copy.append(small); }
  link.append(copy); return link;
}
function navigationGroup(group, heading = true) {
  const section = document.createElement('section'); section.className = 'documentation-group';
  if (heading) { const title = document.createElement('h2'); title.textContent = group.label; section.append(title); }
  for (const page of group.pages) section.append(pageLink(page));
  return section;
}
function renderDocumentationNavigation() {
  const catalog = document.querySelector('#guide-catalog'), guide = document.querySelector('#guide-pages');
  catalog.replaceChildren(); guide.replaceChildren();
  for (const group of documentationGroups) catalog.append(navigationGroup(group));
  for (const group of guideGroups) guide.append(navigationGroup(group));
  const design = documentationGroups.find(group => group.id === 'design');
  document.querySelector('#design-pages').replaceChildren(navigationGroup(design, false));
  for (const section of ['practice', 'composition']) {
    document.querySelector(`#${section}-pages`).replaceChildren(navigationGroup(documentationGroups.find(group => group.id === section), false));
  }
  document.querySelector('#ai-pages').replaceChildren(navigationGroup({ pages: aiPages }, false));
}
function versionLink(release) {
  const link = document.createElement('a');
  link.className = 'guide'; link.href = `#/changelog?section=${encodeURIComponent(release.section)}`;
  link.dataset.section = release.section;
  link.setAttribute('aria-label', `v${release.version} 的更新记录`);
  const label = document.createElement('span'); label.textContent = `v${release.version}`;
  const description = document.createElement('small'); description.textContent = release.current ? '当前版本' : '历史更新';
  link.append(label, description); return link;
}
function renderVersionNavigation() {
  const menu = document.querySelector('#version-pages');
  menu.replaceChildren();
  const title = document.createElement('div'); title.className = 'menu-label'; title.textContent = '版本更新记录'; menu.append(title);
  for (const release of content.versions || []) menu.append(versionLink(release));
  const all = pageLink({ id: 'changelog', label: '完整更新日志' }); all.classList.add('menu-footer'); menu.append(all);
  document.querySelector('#version-label').textContent = `v${content.version}`;
  const trigger = document.querySelector('#version'); trigger.disabled = false; trigger.setAttribute('aria-label', `当前文档版本 v${content.version}，打开版本导航`);
}
function updateNavigation(params) {
  const section = pageSection(current);
  navigationMenus.closeAll();
  document.querySelector('.workspace').classList.toggle('guide-page', section !== 'components');
  document.querySelector('.preview').hidden = section !== 'components';
  document.querySelector('#guide-trigger').classList.toggle('active', section === 'guide');
  document.querySelector('#practice-trigger').classList.toggle('active', section === 'practice' || section === 'versions');
  document.querySelector('#composition-trigger').classList.toggle('active', section === 'composition');
  document.querySelector('#design-trigger').classList.toggle('active', section === 'design');
  componentTrigger.classList.toggle('active', section === 'components');
  document.querySelector('#ai-trigger').classList.toggle('active', section === 'ai');
  document.querySelector('#version').classList.toggle('active', section === 'versions');
  document.querySelector('#catalog-label').textContent = section === 'components' ? '组件目录' : '文档目录';
  document.querySelector('#guide-catalog').hidden = section === 'components';
  for (const link of document.querySelectorAll('#guide-catalog a, [data-menu-panel] a')) {
    const selected = link.dataset.section ? current === 'changelog' && params.get('section') === link.dataset.section : link.hash === `#/${current}` && (!link.closest('#version-pages') || !params.get('section'));
    link.classList.toggle('active', selected || (current === 'ai-mcp' && link.hash === '#/ai-cli') || (current === 'local-runner' && link.hash === '#/publishing'));
    if (selected) link.setAttribute('aria-current', link.dataset.section ? 'location' : 'page'); else link.removeAttribute('aria-current');
  }
}
const demoPreview = createDemoPreview(demo, {
  status: document.querySelector('#demo-status'), select: document.querySelector('#demo-examples'),
  retry: document.querySelector('#reload-demo'), open: document.querySelector('#open-demo'),
  onExamples() {
    article.querySelectorAll('.view-demo').forEach(button => button.remove());
    let group;
    for (const heading of article.querySelectorAll('h2, h3')) {
      if (heading.tagName === 'H2') group = heading.dataset.label;
      const example = demoPreview.match(heading.dataset.label, heading.tagName === 'H3' ? group : undefined);
      if (!example) continue;
      const button = document.createElement('button'); button.type = 'button'; button.className = 'view-demo'; button.textContent = '查看演示';
      button.addEventListener('click', () => { demoPreview.focus(example.id); const params = new URLSearchParams({ section: heading.id, example: example.id }); history.replaceState(history.state, '', `#/${current}?${params}`); if (mobileViewport.matches) demo.scrollIntoView({ block: 'start' }); });
      heading.append(button);
    }
  },
});
function preview() {
  if (isGuide()) { demoPreview.load(null); return; }
  const url = `./demo/?component=${encodeURIComponent(current)}&theme=${theme}`;
  demoPreview.load(url);
}
function render() {
  const [page, query = ''] = location.hash.slice(2).split('?');
  const next = !page || page === 'home' ? 'home' : Object.hasOwn(content.pages, page) ? page : 'getting-started';
  const params = new URLSearchParams(query);
  const section = params.get('section');
  const source = params.get('source');
  const isHome = next === 'home';
  home.hidden = !isHome;
  workspace.hidden = isHome;
  document.querySelector('.brand').removeAttribute('aria-current');
  if (isHome) {
    const changed = current !== next;
    current = next;
    sourceViewer.hide();
    demoPreview.load(null);
    setCatalogOpen(false);
    updateNavigation(params);
    for (const link of categories.querySelectorAll('a')) link.classList.remove('active');
    headings = [];
    document.querySelector('.brand').setAttribute('aria-current', 'page');
    document.title = 'Daisu UI · 袋鼠 UI · ReactLynx 组件库';
    if (changed) window.scrollTo(0, 0);
    return;
  }
  if (current === next) {
    updateNavigation(params);
    if (params.get('example')) demoPreview.focus(params.get('example'));
    if (source) { void sourceViewer.show(source); return; }
    const wasOpen = sourceViewer.isOpen();
    sourceViewer.hide();
    if (section || !wasOpen) scrollToSection(section);
    return;
  }
  sourceViewer.hide();
  current = next;
  setCatalogOpen(false);
  updateNavigation(params);
  for (const link of categories.querySelectorAll('a')) {
    const active = content.groups.find(group => group.id === link.dataset.group)?.items.some(item => item.id === current);
    link.classList.toggle('active', !!active);
  }
  article.innerHTML = content.pages[current];
  document.title = `${article.querySelector('h1')?.textContent || '文档'} · Daisu UI`;
  // Keep component Markdown links within this site.
  for (const link of article.querySelectorAll('a[href]')) {
    const href = link.getAttribute('href');
    const sourceMatch = href.match(/^\.\/sources\/(.+\.txt)$/);
    if (sourceMatch) { link.href = sourceRoute(current, sourceMatch[1]); continue; }
    link.href = resolveDocumentationHref(href, current, content.aliases);
  }
  for (const block of article.querySelectorAll('pre')) {
    const wrapper = document.createElement('div');
    wrapper.className = 'code-block';
    const toolbar = document.createElement('div');
    toolbar.className = 'code-toolbar';
    const language = document.createElement('span');
    language.textContent = block.querySelector('code')?.className.match(/language-([\w-]+)/)?.[1] || 'text';
    block.tabIndex = 0; block.setAttribute('aria-label', `${language.textContent} 示例代码`);
    const button = document.createElement('button');
    button.className = 'copy'; button.textContent = '复制';
    button.type = 'button'; button.setAttribute('aria-label', '复制代码');
    button.addEventListener('click', async () => {
      try { await navigator.clipboard.writeText(block.querySelector('code').textContent); button.textContent = '已复制'; }
      catch { button.textContent = '请手动复制'; }
      setTimeout(() => { button.textContent = '复制'; }, 1800);
    });
    toolbar.append(language, button);
    block.before(wrapper); wrapper.append(toolbar, block);
  }
  for (const table of article.querySelectorAll('table')) {
    const wrapper = document.createElement('div');
    wrapper.className = 'table-scroll'; wrapper.tabIndex = 0;
    wrapper.setAttribute('role', 'region'); wrapper.setAttribute('aria-label', 'API 表格，可横向滚动');
    table.before(wrapper); wrapper.append(table);
  }
  if (current === 'compatibility') {
    const table = article.querySelector('table');
    if (table) {
      const label = document.createElement('label'); label.className = 'compatibility-filter'; label.textContent = '筛选组件或平台要求';
      const filter = document.createElement('input'); filter.type = 'search'; filter.id = 'compatibility-filter'; filter.placeholder = '例如：Upload、未接入、input';
      label.append(filter); table.closest('.table-scroll').before(label);
      filter.addEventListener('input', () => { const query = filter.value.trim().toLowerCase(); for (const row of table.querySelectorAll('tbody tr')) row.hidden = !row.textContent.toLowerCase().includes(query); });
    }
  }
  renderOutline(); renderCatalog(); renderPagination(); preview(); scrollToSection(section); revealCurrentComponent(); queueOutline();
  if (source) void sourceViewer.show(source);
}
document.querySelector('#theme').addEventListener('click', () => {
  theme = theme === 'dark' ? 'light' : 'dark';
  document.documentElement.dataset.theme = theme;
  document.querySelector('#theme').setAttribute('aria-checked', String(theme === 'dark'));
  localStorage.setItem('daisu-docs-theme', theme);
  if (content) preview();
});
search.addEventListener('input', () => { if (content) renderCatalog(); });

sidebar.addEventListener('click', event => { if (event.target.closest('a[href]')) setCatalogOpen(false); });
document.addEventListener('keydown', event => {
  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k' && !sourceViewer.isOpen()) { event.preventDefault(); if (content) documentSearch.open(); return; }
  if (documentSearch.isOpen()) return;
  const typing = event.target instanceof Element && event.target.closest('input, textarea, [contenteditable=true]');
  if (event.key === '/' && !typing && !event.ctrlKey && !event.metaKey && !event.altKey && !isGuide() && !sourceViewer.isOpen()) {
    event.preventDefault(); if (mobileViewport.matches) setCatalogOpen(true); search.focus();
  }
  if (event.key === 'Escape' && !sourceViewer.isOpen()) {
    if (event.target === search) { search.value = ''; if (content) renderCatalog(); search.blur(); }
    if (catalogToggle.getAttribute('aria-expanded') === 'true') { setCatalogOpen(false); catalogToggle.focus(); }
  }
});
document.querySelector('#theme').setAttribute('aria-checked', String(theme === 'dark'));
window.addEventListener('hashchange', () => { if (content) render(); });
try {
  const response = await fetch('./content.json', { cache: 'no-cache' });
  if (!response.ok) throw new Error(String(response.status));
  content = await response.json();
  const componentCount = content.groups.reduce((total, group) => total + group.items.length, 0);
  for (const counter of home.querySelectorAll('[data-home-component-count]')) counter.textContent = String(componentCount);
  home.querySelector('[data-home-version]').textContent = `v${content.version}`;
  documentSearch.setDocuments([...relatedAiPages.map(page => ({ ...page, group: 'AI' })), ...relatedGuidePages.map(page => ({ ...page, group: '工程实践' })), ...documentationGroups.flatMap(group => group.pages.filter(page => page.id).map(page => ({ ...page, group: group.label }))), ...content.groups.flatMap(group => group.items.map(page => ({ ...page, group: group.label })))]);
  documentSearch.setLoader(async () => { const response = await fetch('./search-index.json', { cache: 'no-cache' }); if (!response.ok) throw Error('Search index unavailable'); const records = await response.json(); if (!Array.isArray(records)) throw Error('Invalid search index'); return records; });
  document.querySelector('#document-search-trigger').disabled = false;
  renderCategories(); renderDocumentationNavigation(); renderVersionNavigation();
  render();
} catch {
  const page = location.hash.slice(2).split('?')[0];
  if (page && page !== 'home') { home.hidden = true; workspace.hidden = false; }
  article.textContent = '文档加载失败，请刷新页面重试。';
}
