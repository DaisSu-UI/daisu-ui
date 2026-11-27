/** Browser host only: no DOM access enters the ReactLynx bundle. */
export function connectDocsPreview(
  view: HTMLElement,
  token: string | null,
  component: string,
) {
  const initial = new URLSearchParams(location.search).get("example");
  let initialFocused = false;
  if (!token && !initial) return { error() {}, dispose() {} };
  const anchors = new Map<string, Element>();
  let previous = "",
    scheduled = 0;
  const send = (message: Record<string, unknown>) =>
    token &&
    window.parent !== window &&
    window.parent.postMessage(
      { channel: "daisu-demo", token, component, ...message },
      location.origin,
    );
  const update = () => {
    scheduled = 0;
    const container = view.shadowRoot || view;
    if (!container.querySelector(".ui-demo-page")) return;
    anchors.clear();
    const counts = new Map<string, number>();
    const examples = [
      ...container.querySelectorAll(".demo-example-title, .demo-group-title"),
    ]
      .map((element) => {
        const title = element.textContent?.trim() || "";
        const groupElement = element.classList.contains("demo-group-title")
          ? null : element.closest(".demo-group")?.querySelector(".demo-group-title");
        const group = groupElement?.textContent?.trim() || "";
        // Links use the authored identity even when the displayed copy changes language.
        const sourceTitle = element.getAttribute('data-demotitle') || title;
        const sourceGroup = groupElement?.getAttribute('data-demotitle') || group;
        const name = `${sourceGroup}/${sourceTitle}`;
        const count = (counts.get(name) || 0) + 1;
        counts.set(name, count);
        const id = encodeURIComponent(name) + "-" + count;
        anchors.set(id, element);
        return { id, title, group };
      })
      .filter((item) => item.title);
    if (initial && !initialFocused && anchors.has(initial)) {
      initialFocused = true;
      anchors
        .get(initial)
        ?.scrollIntoView({ block: "start", behavior: "instant" });
    }
    const signature = JSON.stringify(examples);
    if (signature !== previous) {
      previous = signature;
      send({ type: "ready", examples });
    }
  };
  const observer = new MutationObserver(() => {
    if (!scheduled) scheduled = requestAnimationFrame(update);
  });
  observer.observe(view.shadowRoot || view, {
    childList: true,
    subtree: true,
    characterData: true,
  });
  const receive = (event: MessageEvent) => {
    const data = event.data;
    if (
      event.source !== window.parent ||
      event.origin !== location.origin ||
      data?.channel !== "daisu-docs" ||
      data.token !== token ||
      data.type !== "focus"
    )
      return;
    const target = anchors.get(data.id);
    target?.scrollIntoView({ block: "start", behavior: "instant" });
    send({
      type: "focused",
      found: !!target,
      id: data.id,
      title: target?.textContent?.trim() || "",
    });
  };
  window.addEventListener("message", receive);
  view.addEventListener("load", update);
  update();
  return {
    error() {
      send({ type: "error" });
    },
    dispose() {
      observer.disconnect();
      cancelAnimationFrame(scheduled);
      window.removeEventListener("message", receive);
      view.removeEventListener("load", update);
    },
  };
}
