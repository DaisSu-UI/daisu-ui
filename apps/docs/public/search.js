const normalize = (value) =>
  String(value || "")
    .normalize("NFKC")
    .toLowerCase();

export function searchDocuments(documents, query, limit = 12) {
  const tokens = normalize(query).trim().split(/\s+/).filter(Boolean);
  const matches = documents
    .map((page, order) => {
      const title = normalize(`${page.label} ${page.id} ${page.group}`);
      const heading = normalize(page.heading);
      const text = normalize(page.text);
      if (
        !tokens.every((token) => `${title} ${heading} ${text}`.includes(token))
      )
        return null;
      const score = tokens.reduce(
        (sum, token) =>
          sum +
          (heading === token ? 100 : heading.includes(token) ? 40 : 0) +
          (title.includes(token) ? 20 : 0) +
          (text.includes(token) ? 1 : 0),
        0,
      );
      const first =
        tokens
          .map((token) => text.indexOf(token))
          .filter((index) => index >= 0)
          .sort((a, b) => a - b)[0] ?? 0;
      const start = Math.max(0, first - 24);
      return {
        ...page,
        score,
        order,
        snippet: page.text
          ? `${start ? "…" : ""}${page.text.slice(start, start + 110)}`
          : "",
      };
    })
    .filter(Boolean)
    .sort((a, b) => b.score - a.score || a.order - b.order);
  return { total: matches.length, matches: matches.slice(0, limit) };
}

export function createDocumentSearch(dialog, onSelect) {
  const input = dialog.querySelector("input"),
    results = dialog.querySelector("[data-search-results]"),
    status = dialog.querySelector("[data-search-status]");
  let documents = [],
    matches = [],
    active = 0,
    opener,
    loader,
    loading = false,
    loaded = false,
    failed = false;
  function select(index) {
    if (!matches[index]) return;
    const target = matches[index].href || matches[index].id;
    close();
    onSelect(target);
  }
  function highlight() {
    const options = [...results.children];
    options.forEach((option, index) => {
      option.setAttribute("aria-selected", String(index === active));
      option.classList.toggle("active", index === active);
    });
    if (options[active]) {
      input.setAttribute("aria-activedescendant", options[active].id);
      options[active].scrollIntoView?.({ block: "nearest" });
    } else input.removeAttribute("aria-activedescendant");
  }
  function render() {
    const found = searchDocuments(documents, input.value);
    matches = found.matches;
    active = 0;
    results.replaceChildren();
    matches.forEach((page, index) => {
      const option = document.createElement("button");
      option.type = "button";
      option.id = `document-result-${index}`;
      option.setAttribute("role", "option");
      const body = document.createElement("span");
      body.className = "search-result-body";
      const label = document.createElement("span");
      label.textContent =
        page.label + (page.heading ? ` · ${page.heading}` : "");
      body.append(label);
      if (page.snippet) {
        const snippet = document.createElement("small");
        snippet.className = "search-snippet";
        snippet.textContent = page.snippet;
        body.append(snippet);
      }
      const group = document.createElement("small");
      group.textContent = page.group;
      option.append(body, group);
      option.addEventListener("click", () => select(index));
      results.append(option);
    });
    status.textContent = loading
      ? "正在加载全文索引…"
      : failed
        ? "全文索引加载失败，当前仅按标题检索；重新打开可重试"
        : found.total
          ? `${found.total} 个结果${found.total > matches.length ? `，显示前 ${matches.length} 项` : ""} · 使用方向键选择，Enter 打开`
          : "未找到匹配文档";
    highlight();
  }
  async function load() {
    if (!loader || loading || loaded) return;
    loading = true;
    failed = false;
    render();
    try {
      documents = await loader();
      loaded = true;
    } catch {
      failed = true;
    } finally {
      loading = false;
      render();
    }
  }
  function close() {
    if (dialog.open) dialog.close();
    opener?.focus({ preventScroll: true });
  }
  input.addEventListener("input", render);
  input.addEventListener("keydown", (event) => {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      if (matches.length)
        active =
          (active + (event.key === "ArrowDown" ? 1 : matches.length - 1)) %
          matches.length;
      highlight();
    } else if (event.key === "Enter") {
      event.preventDefault();
      select(active);
    }
  });
  dialog.querySelector("[data-search-close]").addEventListener("click", close);
  dialog.addEventListener("cancel", (event) => {
    event.preventDefault();
    close();
  });
  dialog.addEventListener("click", (event) => {
    if (event.target !== dialog) return;
    const r = dialog.getBoundingClientRect();
    if (
      event.clientX < r.left ||
      event.clientX > r.right ||
      event.clientY < r.top ||
      event.clientY > r.bottom
    )
      close();
  });
  return {
    setDocuments(value) {
      documents = value;
    },
    setLoader(value) {
      loader = value;
      loaded = false;
    },
    isOpen: () => dialog.open,
    open() {
      opener = document.activeElement;
      input.value = "";
      render();
      if (!dialog.open) dialog.showModal();
      input.focus();
      void load();
    },
    close,
  };
}
