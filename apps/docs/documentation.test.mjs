import test from "node:test";
import assert from "node:assert/strict";
import MarkdownIt from "markdown-it";
import {
  createDocumentationAliases,
  resolveDocumentationHref,
  exportMarkdown,
} from "./public/documentation-links.js";
import { renderLlmIndex, checkDocumentationLinks } from "./documentation.mjs";

const entries = [
  {
    id: "form-detail",
    source: "docs/ui/components/form.md",
    label: "Form 表单",
    names: ["Form", "FormItem"],
  },
  { id: "publishing", source: "docs/ci/git-release.md", label: "版本发布" },
  { id: "local-runner", source: "docs/ci/local-runner.md", label: "Runner" },
];
const aliases = createDocumentationAliases(entries);
test("local aliases retain section targets while external Markdown links remain external", () => {
  assert.equal(
    resolveDocumentationHref("git-release.md", "local-runner", aliases),
    "#/publishing",
  );
  assert.equal(
    resolveDocumentationHref("form.md#属性", "publishing", aliases),
    "#/form-detail?section=" + encodeURIComponent("form-detail-属性"),
  );
  assert.equal(
    resolveDocumentationHref(
      "https://example.com/form.md",
      "publishing",
      aliases,
    ),
    "https://example.com/form.md",
  );
  assert.throws(
    () =>
      createDocumentationAliases([
        ...entries,
        { id: "other", source: "form.md" },
      ]),
    /Conflicting/,
  );
});
test("LLM index covers all entries and exported Markdown follows readable files without altering code", () => {
  const index = renderLlmIndex("1.2.3", entries);
  for (const entry of entries) assert(index.includes(`](./${entry.id}.md)`));
  const source =
    "[API](form.md#属性)\n[发布](#/publishing)\n```text\n[示例](#/fake)\n```";
  const output = exportMarkdown(source, "publishing", aliases);
  assert(output.includes("](./form-detail.md#属性)"));
  assert(output.includes("[发布](./publishing.md)"));
  assert(output.includes("[示例](#/fake)"));
});
test("build validation rejects missing pages, resources and section anchors", async () => {
  const markdown = new MarkdownIt();
  const sources = {
    "form-detail": "# Form\n## 属性\n[发布](git-release.md)",
    publishing: "# 发布\n[Runner](local-runner.md)",
    "local-runner": "# Runner\n[资源](./llms.txt)",
  };
  await checkDocumentationLinks(
    markdown,
    sources,
    aliases,
    (href) => href === "./llms.txt",
  );
  for (const link of ["#/missing", "form.md#不存在", "./absent.txt"])
    await assert.rejects(
      checkDocumentationLinks(
        markdown,
        { ...sources, publishing: `# 发布\n[错误](${link})` },
        aliases,
        () => false,
      ),
      /invalid/,
    );
});

test("full-text index includes API tables and targets unique actual heading IDs", async () => {
  const { buildSearchIndex } = await import("./documentation.mjs");
  const { searchDocuments } = await import("./public/search.js");
  const docs = buildSearchIndex(
    new MarkdownIt(),
    {
      utilities:
        "# 工具\n## Hooks\n### usePressState\n布尔值 pressed。\n### 参数\n|参数|说明|\n|---|---|\n|enabled|是否启用|\n### 参数\n取消按压时清理状态",
    },
    [{ id: "utilities", label: "工具与按压反馈", group: "组合与工具" }],
  );
  assert.equal(
    searchDocuments(docs, "usePressState").matches[0].href,
    "#/utilities?section=utilities-usepressstate",
  );
  assert.equal(
    searchDocuments(docs, "取消按压").matches[0].href,
    "#/utilities?section=" + encodeURIComponent("utilities-参数-2"),
  );
  assert.equal(searchDocuments(docs, "enabled").total, 1);
  assert.equal(searchDocuments(docs, "nothing-matches").total, 0);
});
test("compatibility matrix covers each documentation entry without inventing native validation", async () => {
  const { compatibilityRows, renderCompatibility } = await import(
    "./platforms.mjs"
  );
  const sources = {
    button: { components: [{ name: "Button" }], demo: "button.tsx" },
    "video-preview": {
      components: [{ name: "VideoPreview" }],
      demo: "video.tsx",
    },
  };
  const rows = compatibilityRows(sources, [
    { id: "button", label: "Button 按钮" },
  ]);
  assert.equal(rows.length, 2);
  assert.match(rows[0].android, /待目标设备验收/);
  assert.match(rows[1].ios, /未接入/);
  assert.match(renderCompatibility("1.0", rows), /没有填写虚构/);
});
