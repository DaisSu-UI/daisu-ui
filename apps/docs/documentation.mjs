import { headingId } from "./public/navigation.js";
import { resolveDocumentationHref } from "./public/documentation-links.js";

export function renderLlmIndex(version, entries) {
  const link = (entry) =>
    `- [${entry.label}](./${entry.id}.md)${entry.names?.length ? ": " + entry.names.join("、") : ""}`;
  return `# Daisu UI

> 面向 ReactLynx 的组件库。当前文档对应 @daisu-ui/ui@${version}；API、示例与平台范围以同版本公开类型和文档为准。

## 阅读顺序

先确认项目安装版本。本文链接指向可直接读取的 Markdown，无需执行文档站 JavaScript；链接相对于本站 llms.txt 地址解析。

## 指南与 AI 接入

${entries
  .filter((entry) => !entry.names)
  .map(link)
  .join("\n")}

## 组件文档

${entries
  .filter((entry) => entry.names)
  .map(link)
  .join("\n")}

## 扩展约束

- [详细组件与平台约束](./llms-full.txt)
- [逐组件生成约束](./component-ai-notes.txt)

## 使用规则

从 @daisu-ui/ui、@daisu-ui/ui/router、@daisu-ui/ui/utils、@daisu-ui/ui/web 等公开入口导入；组件入口自动加载样式。文字放在 text 元素内，使用 ConfigProvider 的语义变量和主题作用域。业务账号、网络与宿主协议由消费项目提供。浏览器预览不能代替原生媒体、键盘、手势与列表性能验收。

CLI 为 @daisu-ui/cli，可用 npm install -g @daisu-ui/cli@latest 安装；查询和 MCP 使用随包快照，不自动读取网站或当前 UI 源码。先运行 daisu data list / doctor，或调用 daisu_status，核对已收录版本。数据缺失时更新到包含该版本的 CLI 或使用其 Git 源码，不用其他版本 API 冒充。

## 源码与维护

- [UI 源码](https://github.com/DaisSu-UI/daisu-ui)
- [CLI 源码](https://github.com/DaisSu-UI/cli)
- 组件源码：packages/daisu-ui/src；示例：apps/demo/src/features/ui-demo；API 文档：docs/ui/components。
- 维护者先读取 AGENTS.md；UI 文档生成、CLI 快照与接入说明在开发构建时同步，CI 与 --check 只读验证。
`;
}

export async function checkDocumentationLinks(
  markdown,
  sources,
  aliases,
  exists,
) {
  const headings = new Map();
  for (const [id, source] of Object.entries(sources)) {
    const ids = new Set();
    const tokens = markdown.parse(source, {});
    for (let i = 0; i < tokens.length; i++) {
      if (
        tokens[i].type !== "heading_open" ||
        !["h2", "h3"].includes(tokens[i].tag)
      )
        continue;
      const label = (tokens[i + 1].children || [])
        .map((child) =>
          child.type === "text" || child.type === "code_inline"
            ? child.content
            : "",
        )
        .join("");
      const base = headingId(id, label);
      let value = base;
      for (let suffix = 2; ids.has(value); suffix++)
        value = base + "-" + suffix;
      ids.add(value);
    }
    headings.set(id, ids);
  }
  const errors = [];
  for (const [id, source] of Object.entries(sources)) {
    for (const token of markdown.parse(source, {})) {
      for (const child of token.children || []) {
        if (child.type !== "link_open" && child.type !== "image") continue;
        const href = child.attrGet(child.type === "image" ? "src" : "href");
        if (!href || /^(?:[a-z][a-z0-9+.-]*:|\/\/)/i.test(href)) continue;
        const target = resolveDocumentationHref(href, id, aliases);
        if (target.startsWith("#/")) {
          const [page, query = ""] = target.slice(2).split("?");
          const section = new URLSearchParams(query).get("section");
          if (
            !headings.has(page) ||
            (section && !headings.get(page).has(section))
          )
            errors.push(
              `${id}: ${href} → missing ${section ? "section" : "page"}`,
            );
        } else if (!(await exists(target.split(/[?#]/)[0])))
          errors.push(`${id}: ${href} → missing resource`);
      }
    }
  }
  if (errors.length)
    throw new Error("Documentation links are invalid:\n" + errors.join("\n"));
}

/** Index actual Markdown sections, including API tables and code. */
export function buildSearchIndex(markdown, sources, entries) {
  const metadata = new Map(entries.map((entry) => [entry.id, entry]));
  const result = [];
  for (const [id, source] of Object.entries(sources)) {
    const entry = metadata.get(id) || { label: id, group: "文档" };
    const ids = new Set();
    let record;
    const add = (heading = "", section = "") => {
      record = {
        id,
        label: entry.label,
        group: entry.group || "文档",
        heading,
        href: `#/${id}${section ? "?section=" + encodeURIComponent(section) : ""}`,
        text: "",
      };
      result.push(record);
    };
    add();
    const tokens = markdown.parse(source, {});
    for (let index = 0; index < tokens.length; index++) {
      const token = tokens[index];
      if (token.type === "heading_open" && ["h2", "h3"].includes(token.tag)) {
        const label = (tokens[index + 1].children || [])
          .map((child) =>
            ["text", "code_inline"].includes(child.type) ? child.content : "",
          )
          .join("");
        const base = headingId(id, label);
        let section = base;
        for (let suffix = 2; ids.has(section); suffix++)
          section = base + "-" + suffix;
        ids.add(section);
        add(label, section);
      }
      if (["inline", "fence", "code_block"].includes(token.type))
        record.text += token.content + " ";
    }
  }
  return result.map((record) => ({
    ...record,
    text: record.text.replace(/\s+/g, " ").trim(),
  }));
}
