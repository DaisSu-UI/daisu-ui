const clean = (text) =>
  text
    .normalize("NFKC")
    .replace(/[#\s·：:]/g, "")
    .toLowerCase();

export function createDemoPreview(
  frame,
  { status, select, retry, open, onExamples },
  { timeout = 20000 } = {},
) {
  let token,
    timer,
    currentUrl,
    ready = false,
    examples = [],
    request = 0;
  const setStatus = (message, state) => {
    status.textContent = message;
    status.dataset.state = state;
    frame.setAttribute("aria-busy", String(state === "loading"));
  };
  const send = (message) =>
    frame.contentWindow?.postMessage(
      { channel: "daisu-docs", token, ...message },
      location.origin,
    );
  function load(url) {
    clearTimeout(timer);
    ready = false;
    examples = [];
    select.replaceChildren();
    select.disabled = true;
    if (!url) {
      token = null;
      frame.removeAttribute("src");
      setStatus("", "idle");
      return;
    }
    token = `${Date.now()}-${++request}`;
    const target = new URL(url, location.href);
    target.searchParams.set("docsToken", token);
    currentUrl = url;
    open.href = url;
    frame.src = target.href;
    setStatus("正在加载交互示例…", "loading");
    timer = setTimeout(() => {
      if (!ready) setStatus("示例加载超时，可重试或独立打开", "error");
    }, timeout);
  }
  function focus(id) {
    if (!ready) return false;
    select.value = id;
    const [page, query = ""] = location.hash.slice(2).split("?");
    const params = new URLSearchParams(query);
    params.set("example", id);
    history.replaceState(history.state, "", `#/${page}?${params}`);
    const target = new URL(currentUrl, location.href);
    target.searchParams.set("example", id);
    open.href = target.href;
    send({ type: "focus", id });
    return true;
  }
  const receive = (event) => {
    const message = event.data;
    if (
      event.origin !== location.origin ||
      event.source !== frame.contentWindow ||
      message?.channel !== "daisu-demo" ||
      message.token !== token ||
      !token
    )
      return;
    if (message.type === "error") {
      clearTimeout(timer);
      setStatus("示例加载失败，可重试或独立打开", "error");
      return;
    }
    if (message.type === "ready" && Array.isArray(message.examples)) {
      ready = true;
      clearTimeout(timer);
      examples = message.examples.filter(
        (item) => typeof item.id === "string" && typeof item.title === "string",
      );
      select.replaceChildren(new Option("选择要查看的示例", ""));
      for (const item of examples)
        select.append(
          new Option(
            `${item.group ? item.group + " · " : ""}${item.title}`,
            item.id,
          ),
        );
      select.disabled = !examples.length;
      setStatus(
        examples.length ? `${examples.length} 个交互示例` : "交互示例已加载",
        "ready",
      );
      onExamples?.(examples, focus);
      const initial = new URL(location.href).hash.split("?")[1];
      const selected = new URLSearchParams(initial).get("example");
      if (selected && examples.some((item) => item.id === selected))
        focus(selected);
    }
    if (message.type === "focused")
      setStatus(
        message.found
          ? `正在查看：${message.title}`
          : "未找到该示例，请重新选择",
        message.found ? "ready" : "error",
      );
  };
  window.addEventListener("message", receive);
  frame.addEventListener("error", () =>
    setStatus("示例加载失败，可重试或独立打开", "error"),
  );
  select.addEventListener("change", () => {
    if (select.value) focus(select.value);
  });
  retry.addEventListener("click", () => {
    if (currentUrl) load(currentUrl);
  });
  return {
    load,
    focus,
    destroy() {
      clearTimeout(timer);
      window.removeEventListener("message", receive);
    },
    match(title, group) {
      return examples.find(
        (item) =>
          clean(item.title) === clean(title) &&
          (!group || !item.group || clean(item.group) === clean(group)),
      );
    },
  };
}
