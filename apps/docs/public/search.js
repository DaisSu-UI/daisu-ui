export function createDocumentSearch(dialog, onSelect) {
  const input = dialog.querySelector('input'), results = dialog.querySelector('[data-search-results]'), status = dialog.querySelector('[data-search-status]');
  let documents = [], matches = [], active = 0, opener;
  function select(index) { if (!matches[index]) return; const id = matches[index].id; close(); onSelect(id); }
  function highlight() {
    const options = [...results.children];
    options.forEach((option, index) => { option.setAttribute('aria-selected', String(index === active)); option.classList.toggle('active', index === active); });
    if (options[active]) { input.setAttribute('aria-activedescendant', options[active].id); options[active].scrollIntoView?.({ block: 'nearest' }); }
    else input.removeAttribute('aria-activedescendant');
  }
  function render() {
    const tokens = input.value.trim().toLowerCase().split(/\s+/).filter(Boolean);
    matches = documents.filter(page => tokens.every(token => `${page.label} ${page.id} ${page.group}`.toLowerCase().includes(token))).slice(0, 12);
    active = 0; results.replaceChildren();
    matches.forEach((page, index) => {
      const option = document.createElement('button'); option.type = 'button'; option.id = `document-result-${index}`; option.setAttribute('role', 'option');
      const label = document.createElement('span'); label.textContent = page.label;
      const group = document.createElement('small'); group.textContent = page.group;
      option.append(label, group); option.addEventListener('click', () => select(index)); results.append(option);
    });
    status.textContent = matches.length ? `${matches.length} 个结果 · 使用方向键选择，Enter 打开` : '未找到匹配文档'; highlight();
  }
  function close() { if (dialog.open) dialog.close(); opener?.focus({ preventScroll: true }); }
  input.addEventListener('input', render);
  input.addEventListener('keydown', event => {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') { event.preventDefault(); if (matches.length) active = (active + (event.key === 'ArrowDown' ? 1 : matches.length - 1)) % matches.length; highlight(); }
    else if (event.key === 'Enter') { event.preventDefault(); select(active); }
  });
  dialog.querySelector('[data-search-close]').addEventListener('click', close);
  dialog.addEventListener('cancel', event => { event.preventDefault(); close(); });
  dialog.addEventListener('click', event => { if (event.target !== dialog) return; const r = dialog.getBoundingClientRect(); if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) close(); });
  return { setDocuments(value) { documents = value; }, isOpen: () => dialog.open, open() { opener = document.activeElement; input.value = ''; render(); if (!dialog.open) dialog.showModal(); input.focus(); }, close };
}
