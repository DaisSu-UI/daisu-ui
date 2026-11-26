import { test, expect } from "@playwright/test";
import MarkdownIt from "markdown-it";

test("home is the default entry and documentation links return to it", async ({
  page,
  request,
}) => {
  const content = await (await request.get("content.json")).json();
  const count = String(content.groups.reduce((total, group) => total + group.items.length, 0));
  await page.goto("./");
  await expect(page.locator("#home")).toBeVisible();
  await expect(page.locator("#home-heading")).toContainText("ReactLynx");
  await expect(page.locator("[data-home-version]")).toHaveText(`v${content.version}`);
  await expect(page.locator("[data-home-component-count]")).toHaveText([count, count]);
  await expect(page.locator(".home-feature")).toHaveCount(8);
  await expect(page.locator(".workspace")).toBeHidden();
  await expect(page.locator("#demo")).not.toHaveAttribute("src");
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBeTruthy();
  await page.getByRole("link", { name: "快速开始", exact: true }).click();
  await expect(page.locator("#article h1")).toBeVisible();
  await expect(page.locator("#home")).toBeHidden();
  await page.getByRole("link", { name: "Daisu UI · 袋鼠 UI 首页", exact: true }).click();
  await expect(page.locator("#home")).toBeVisible();
  await page.reload();
  await expect(page.locator(".brand")).toHaveAttribute("aria-current", "page");
  await expect(page.locator(".workspace")).toBeHidden();
});

test("home preserves theme and supports search and component previews", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "light" });
  await page.goto("./#/home");
  await expect(page.getByRole("button", { name: "搜索文档", exact: true })).toBeEnabled();
  await page.getByRole("switch", { name: "深色模式" }).click();
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await expect(page.locator("#home")).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBeTruthy();
  await page.keyboard.press("Control+k");
  await page.locator("#document-search-input").fill("usePressState");
  await expect(page.locator("#document-search").getByRole("option").first()).toContainText("usePressState");
  await page.locator("#document-search-input").press("Enter");
  await expect(page.locator("#article h1")).toHaveText("工具与按压反馈");
  await page.locator(".brand").click();
  await page.getByRole("link", { name: "浏览组件", exact: true }).click();
  await expect(page.locator("#demo-status")).toHaveAttribute("data-state", "ready", { timeout: 30000 });
  await page.locator(".brand").click();
  await expect(page.locator("#demo")).not.toHaveAttribute("src");
  await expect(page.locator("#home")).toBeVisible();
});

test("project site keeps source links and resources under its mount path", async ({
  page,
  request,
  baseURL,
}) => {
  const base = new URL(baseURL);
  if (base.pathname !== "/") {
    expect((await request.get("/content.json")).status()).toBe(404);
    const redirect = await request.get(base.pathname.slice(0, -1), {
      maxRedirects: 0,
    });
    expect(redirect.status()).toBe(301);
    expect(redirect.headers().location).toBe(base.pathname);
  }
  const outside = [];
  page.on("request", (request) => {
    const url = new URL(request.url());
    if (
      ["http:", "https:"].includes(url.protocol) &&
      url.origin === base.origin &&
      !url.pathname.startsWith(base.pathname)
    )
      outside.push(url.pathname);
  });
  await page.goto("./#/button");
  await page.locator('#article a[href*="source="]').first().click();
  await expect(page.locator("#source-viewer")).toBeVisible();
  await expect(page.locator("#source-copy")).toBeEnabled();
  await expect(page.locator("#source-code")).not.toBeEmpty();
  await expect(page.locator("#demo-status")).toHaveAttribute(
    "data-state",
    "ready",
    { timeout: 30000 },
  );
  await page.reload();
  await expect(page.locator("#source-copy")).toBeEnabled();
  expect(new URL(page.url()).pathname).toBe(base.pathname);
  expect(outside).toEqual([]);
});

test("public Markdown documents and their local resources are readable", async ({
  request,
}) => {
  const index = await request.get("llms.txt");
  expect(index.ok()).toBeTruthy();
  const markdown = new MarkdownIt(),
    pages = [];
  for (const token of markdown.parse(await index.text(), {}))
    for (const child of token.children || [])
      if (
        child.type === "link_open" &&
        /^\.\/.+\.md$/.test(child.attrGet("href"))
      )
        pages.push(child.attrGet("href"));
  const content = await (await request.get("content.json")).json();
  expect(new Set(pages).size).toBe(Object.keys(content.pages).length);
  const links = new Set();
  for (const path of pages) {
    const response = await request.get(path);
    expect(response.ok(), path).toBeTruthy();
    expect(response.headers()["content-type"]).toContain("text/markdown");
    for (const token of markdown.parse(await response.text(), {}))
      for (const child of token.children || [])
        if (["link_open", "image"].includes(child.type)) {
          const href = child.attrGet(child.type === "image" ? "src" : "href");
          if (href?.startsWith("./")) links.add(href.split("#")[0].slice(2));
        }
  }
  for (const href of links)
    expect((await request.get(href)).ok(), href).toBeTruthy();
});

test("body/API search opens the matching section with keyboard navigation", async ({
  page,
}) => {
  await page.goto("./#/getting-started");
  await page.getByRole("button", { name: "搜索文档", exact: true }).click();
  await page.locator("#document-search-input").fill("usePressState");
  await expect(page.locator("[data-search-status]")).toContainText("个结果");
  await expect(page.getByRole("option").first()).toContainText("usePressState");
  await page.locator("#document-search-input").press("Enter");
  await expect(page).toHaveURL(/#\/utilities\?section=/);
  await expect(page.locator("#article h1")).toHaveText("工具与按压反馈");
  const section = await page.evaluate(() =>
    new URLSearchParams(location.hash.split("?")[1]).get("section"),
  );
  expect(await page.locator(`[id="${section}"]`).count()).toBe(1);
});

test("real Demo exposes anchors, document examples focus the matching sample", async ({
  page,
}) => {
  await page.goto("./#/button");
  await expect(page.locator("#demo-status")).toHaveAttribute(
    "data-state",
    "ready",
    { timeout: 30000 },
  );
  await expect(page.locator("#demo-examples")).toBeEnabled();
  const loading = page
    .locator("#article h3")
    .filter({ hasText: /^加载/ })
    .getByRole("button", { name: "查看演示" });
  await loading.click();
  await expect(page.locator("#demo-status")).toContainText("正在查看：加载");
  await expect(page).toHaveURL(/example=/);
  const frame = page.frameLocator("#demo");
  const title = frame
    .locator(".demo-example-title")
    .filter({ hasText: /^加载$/ });
  await expect(title).toBeInViewport();
  await frame
    .locator("body")
    .evaluate(() =>
      parent.postMessage(
        { channel: "daisu-demo", token: "stale-message", type: "error" },
        location.origin,
      ),
    );
  await expect(page.locator("#demo-status")).toHaveAttribute(
    "data-state",
    "ready",
  );
});

test("runtime failure is visible and retry loads the real Demo", async ({
  page,
}) => {
  const pattern = "**/demo/?**";
  await page.route(pattern, (route) =>
    route.fulfill({
      contentType: "text/html",
      body: `<script>parent.postMessage({channel:'daisu-demo',token:new URLSearchParams(location.search).get('docsToken'),type:'error'},location.origin)</script>`,
    }),
  );
  await page.goto("./#/slider");
  await expect(page.locator("#demo-status")).toHaveAttribute(
    "data-state",
    "error",
  );
  await page.unroute(pattern);
  await page.getByRole("button", { name: "重新加载示例" }).click();
  await expect(page.locator("#demo-status")).toHaveAttribute(
    "data-state",
    "ready",
    { timeout: 30000 },
  );
});

test("stalled preview reports timeout instead of remaining blank", async ({
  page,
}) => {
  await page.route("**/demo/?**", (route) =>
    route.fulfill({ contentType: "text/html", body: "<p>stalled</p>" }),
  );
  await page.clock.install();
  await page.goto("./#/button");
  await expect(page.locator("#demo-status")).toHaveAttribute(
    "data-state",
    "loading",
  );
  await page.clock.fastForward(21000);
  await expect(page.locator("#demo-status")).toContainText("加载超时");
});

test("matrix filtering, guides, downloads and dark layout work", async ({
  page,
  request,
}) => {
  await page.goto("./#/compatibility");
  await page.locator("#compatibility-filter").fill("VideoPreview");
  const rows = page.locator("#article table tbody tr:visible");
  await expect(rows).toHaveCount(1);
  await expect(rows).toContainText("后端未接入");
  for (const [id, name] of [
    ["web-quickstart", "浏览器完整接入"],
    ["flutter-quickstart", "Flutter 完整接入"],
    ["docs-deployment", "文档站部署"],
  ]) {
    await page.goto("./#/" + id);
    await expect(page.locator("#article h1")).toHaveText(name);
  }
  await page.getByRole("switch", { name: "深色模式" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBeTruthy();
  for (const path of ["daisu-ui-quickstart.zip", "daisu-ui-flutter-host.zip"]) {
    const response = await request.get("downloads/" + path);
    expect(response.ok()).toBeTruthy();
    expect((await response.body()).subarray(0, 2).toString()).toBe("PK");
  }
});

test("search index failure keeps title search usable and can retry", async ({
  page,
}) => {
  await page.route("**/search-index.json", (route) =>
    route.fulfill({ status: 503, body: "unavailable" }),
  );
  await page.goto("./#/getting-started");
  await page.getByRole("button", { name: "搜索文档", exact: true }).click();
  await expect(page.locator("[data-search-status]")).toContainText(
    "全文索引加载失败",
  );
  await page.locator("#document-search-input").fill("Button");
  await expect(page.getByRole("option").first()).toContainText("Button");
  await page.locator("[data-search-close]").click();
  await page.unroute("**/search-index.json");
  await page.getByRole("button", { name: "搜索文档", exact: true }).click();
  await page.locator("#document-search-input").fill("usePressState");
  await expect(page.locator("[data-search-status]")).toContainText("个结果");
  await expect(page.getByRole("option").first()).toContainText("usePressState");
});
