import { createSourceViewer, sourceRoute } from './source-viewer.js';

const article = document.querySelector('#article');
const catalog = document.querySelector('#catalog');
const demo = document.querySelector('#demo');
const search = document.querySelector('#search');
const outline = document.querySelector('#outline');
const componentMenu = document.querySelector('.component-menu');
const componentTrigger = document.querySelector('#component-trigger');
const categories = document.querySelector('#component-categories');
const catalogToggle = document.querySelector('#catalog-toggle');
const sidebar = document.querySelector('.sidebar');
const collapsedGroups = new Set();
const mobileViewport = matchMedia('(max-width: 680px)');
const isGuide = () => current === 'getting-started' || current === 'changelog';
function setCatalogOpen(open) {
  sidebar.classList.toggle('is-open', open);
  catalogToggle.setAttribute('aria-expanded', String(open));
}
catalogToggle.addEventListener('click', () => setCatalogOpen(catalogToggle.getAttribute('aria-expanded') !== 'true'));
mobileViewport.addEventListener('change', () => setCatalogOpen(false));
function setCategoriesOpen(open) {
  categories.hidden = !open;
  componentTrigger.setAttribute('aria-expanded', String(open));
}
componentMenu.addEventListener('pointerenter', event => { if (event.pointerType === 'mouse') setCategoriesOpen(true); });
componentMenu.addEventListener('pointerleave', event => { if (event.pointerType === 'mouse') setCategoriesOpen(false); });
componentMenu.addEventListener('focusout', event => { if (!componentMenu.contains(event.relatedTarget)) setCategoriesOpen(false); });
componentTrigger.addEventListener('click', event => setCategoriesOpen(event.pointerType === 'mouse' ? true : categories.hidden));
componentTrigger.addEventListener('keydown', event => {
  if (event.key === 'ArrowDown') { event.preventDefault(); setCategoriesOpen(true); categories.querySelector('a')?.focus(); }
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && !categories.hidden) { componentTrigger.focus(); setCategoriesOpen(false); }
});
document.addEventListener('click', event => { if (!componentMenu.contains(event.target)) setCategoriesOpen(false); });
categories.addEventListener('click', event => { if (event.target.closest('a')) setCategoriesOpen(false); });
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
    const slug = label.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, '-').replace(/^-|-$/g, '') || 'section';
    let id = `${current}-${slug}`;
    for (let suffix = 2; ids.has(id); suffix++) id = `${current}-${slug}-${suffix}`;
    ids.add(id); heading.id = id;
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
  if (isGuide() || search.value.trim()) return;
  const active = catalog.querySelector('a.active');
  if (!active) return;
  const group = active.closest('.catalog-group');
  group.querySelector('.catalog-items').hidden = false;
  group.querySelector('button').setAttribute('aria-expanded', 'true');
  collapsedGroups.delete(group.dataset.group);
  if (mobileViewport.matches) return;
  const visible = sidebar.getBoundingClientRect();
  const rect = active.getBoundingClientRect();
  if (rect.top < visible.top || rect.bottom > visible.bottom) sidebar.scrollTop += rect.top - visible.top - 100;
}
function renderPagination() {
  const pagination = document.querySelector('#doc-pagination');
  pagination.replaceChildren();
  const pages = isGuide()
    ? [{ id: 'getting-started', label: '开始使用' }, { id: 'changelog', label: '更新日志' }]
    : content.groups.flatMap(group => group.items);
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
function preview() {
  if (isGuide()) { demo.removeAttribute('src'); return; }
  const url = `./demo/?component=${encodeURIComponent(current)}&theme=${theme}`;
  demo.src = url;
  document.querySelector('#open-demo').href = url;
}
function render() {
  const [page, query = ''] = location.hash.slice(2).split('?');
  const next = Object.hasOwn(content.pages, page) ? page : 'getting-started';
  const params = new URLSearchParams(query);
  const section = params.get('section');
  const source = params.get('source');
  if (current === next) {
    if (source) { void sourceViewer.show(source); return; }
    const wasOpen = sourceViewer.isOpen();
    sourceViewer.hide();
    if (section || !wasOpen) scrollToSection(section);
    return;
  }
  sourceViewer.hide();
  current = next;
  setCatalogOpen(false);
  const guide = isGuide();
  document.querySelector('.workspace').classList.toggle('guide-page', guide);
  document.querySelector('.preview').hidden = guide;
  document.querySelector('#guide-nav').classList.toggle('active', guide);
  componentTrigger.classList.toggle('active', !guide);
  document.querySelector('#catalog-label').textContent = guide ? '指南目录' : '组件目录';
  for (const link of document.querySelectorAll('#guide-catalog a')) {
    const active = link.hash === `#/${current}`;
    link.classList.toggle('active', active);
    if (active) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  }
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
    const match = href.match(/(?:^|\/)([\w-]+)\.md(?:#.*)?$/);
    const id = match?.[1] === 'form' ? 'form-detail' : match?.[1];
    if (id && Object.hasOwn(content.pages, id)) link.href = `#/${id}`;
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
document.querySelector('#reload-demo').addEventListener('click', preview);
sidebar.addEventListener('click', event => { if (event.target.closest('a[href]')) setCatalogOpen(false); });
document.addEventListener('keydown', event => {
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
  const response = await fetch('./content.json');
  if (!response.ok) throw new Error(String(response.status));
  content = await response.json();
  document.querySelector('#version').textContent = `v${content.version}`;
  document.querySelector('#version').setAttribute('aria-label', `当前版本 v${content.version}，查看更新日志`);
  renderCategories();
  render();
} catch { article.textContent = '文档加载失败，请刷新页面重试。'; }
