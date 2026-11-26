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
