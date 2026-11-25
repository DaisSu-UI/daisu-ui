export function sourceRoute(page, key) {
  const query = new URLSearchParams({ section: `${page}-源代码`, source: key });
  return `#/${page}?${query}`;
}

export function createSourceViewer(dialog, onDismiss) {
  const name = dialog.querySelector('#source-name');
  const path = dialog.querySelector('#source-path');
  const meta = dialog.querySelector('#source-meta');
  const code = dialog.querySelector('#source-code');
  const copy = dialog.querySelector('#source-copy');
  const close = dialog.querySelector('#source-close');
  let currentKey = null;
  let controller;
  let text = '';
  let copyTimer;

  function hide() {
    currentKey = null;
    controller?.abort();
    clearTimeout(copyTimer);
    if (dialog.open) dialog.close();
    document.body.classList.remove('source-viewer-open');
  }

  async function show(key) {
    if (currentKey === key && dialog.open) return;
    controller?.abort();
    controller = new AbortController();
    const request = controller;
    currentKey = key;
    text = '';
    clearTimeout(copyTimer);
    copy.disabled = true;
    copy.textContent = '复制源码';
    name.textContent = key.split('/').at(-1).replace(/\.txt$/, '');
    path.textContent = '';
    meta.textContent = '正在加载…';
    code.textContent = '正在加载源码…';
    if (!dialog.open) dialog.showModal();
    document.body.classList.add('source-viewer-open');
    dialog.querySelector('.source-scroll').scrollTo(0, 0);
    try {
      const parts = key.split('/');
      if (!key.endsWith('.txt') || !parts.every(part => /^[a-zA-Z0-9][a-zA-Z0-9._-]*$/.test(part))) throw new Error('Invalid source path');
      const url = `./sources/${parts.map(encodeURIComponent).join('/')}.json`;
      const response = await fetch(url, { signal: request.signal });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const source = await response.json();
      if (request.signal.aborted || currentKey !== key) return;
      if (typeof source.code !== 'string' || typeof source.html !== 'string') throw new Error('Invalid source');
      text = source.code;
      name.textContent = source.name;
      path.textContent = source.path;
      meta.textContent = `${source.language.toUpperCase()} · ${source.lines} 行`;
      code.className = `language-${source.language}`;
      code.innerHTML = source.html;
      copy.disabled = false;
    } catch (error) {
      if (request.signal.aborted || currentKey !== key) return;
      meta.textContent = '加载失败';
      code.textContent = '源码暂时无法加载，请关闭后重试。';
    }
  }

  close.addEventListener('click', onDismiss);
  dialog.addEventListener('cancel', event => { event.preventDefault(); onDismiss(); });
  dialog.addEventListener('close', () => { if (!dialog.open && currentKey) onDismiss(); });
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const rect = dialog.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) onDismiss();
  });
  copy.addEventListener('click', async () => {
    const key = currentKey;
    try {
      await navigator.clipboard.writeText(text);
      if (currentKey !== key) return;
      copy.textContent = '已复制';
    } catch {
      if (currentKey !== key) return;
      copy.textContent = '请手动复制';
    }
    clearTimeout(copyTimer);
    copyTimer = setTimeout(() => { copy.textContent = '复制源码'; }, 1800);
  });
  return { show, hide, isOpen: () => dialog.open };
}
