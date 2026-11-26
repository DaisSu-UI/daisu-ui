import { headingId } from "./navigation.js";

export function createDocumentationAliases(entries) {
  const aliases = Object.create(null);
  for (const { id, source } of entries) {
    for (const name of new Set([
      id,
      source.split("/").at(-1).replace(/\.md$/, ""),
    ])) {
      if (Object.hasOwn(aliases, name) && aliases[name] !== id)
        throw new Error(`Conflicting documentation alias: ${name}`);
      aliases[name] = id;
    }
  }
  return aliases;
}

export function resolveDocumentationHref(href, current, aliases = {}) {
  if (/^(?:[a-z][a-z0-9+.-]*:|\/\/)/i.test(href)) return href;
  if (href.startsWith("#/")) return href;
  const match = href.match(/(?:^|\/)([\w-]+)\.md(?:#(.*))?$/);
  const id = match
    ? Object.hasOwn(aliases, match[1]) && aliases[match[1]]
    : href.startsWith("#") && href.length > 1
      ? current
      : undefined;
  if (!id) return href;
  const fragment = match ? match[2] : href.slice(1);
  if (!fragment) return `#/${id}`;
  let label;
  try {
    label = decodeURIComponent(fragment);
  } catch {
    return href;
  }
  const section = label.startsWith(id + "-") ? label : headingId(id, label);
  return `#/${id}?section=${encodeURIComponent(section)}`;
}

export function markdownDocumentationHref(href, current, aliases) {
  const resolved = resolveDocumentationHref(href, current, aliases);
  if (!resolved.startsWith("#/")) return resolved;
  const [id, query = ""] = resolved.slice(2).split("?");
  const section = new URLSearchParams(query).get("section");
  return `./${id}.md${section ? "#" + section.replace(new RegExp("^" + id + "-"), "") : ""}`;
}

export function exportMarkdown(markdown, current, aliases) {
  let fence;
  return markdown
    .split("\n")
    .map((line) => {
      const marker = line.match(/^\s*(`{3,}|~{3,})/);
      if (marker) {
        if (!fence) fence = marker[1];
        else if (marker[1][0] === fence[0] && marker[1].length >= fence.length)
          fence = undefined;
        return line;
      }
      if (fence) return line;
      return line
        .replace(
          /(\[[^\]]+\]\()([^\s)]+)(\))/g,
          (_, before, href, after) =>
            before + markdownDocumentationHref(href, current, aliases) + after,
        )
        .replace(
          /^(\s*\[[^\]]+\]:\s*)(\S+)(.*)$/,
          (_, before, href, after) =>
            before + markdownDocumentationHref(href, current, aliases) + after,
        );
    })
    .join("\n");
}
