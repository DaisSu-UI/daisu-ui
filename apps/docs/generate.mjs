import { readFile, writeFile, mkdir, access } from "node:fs/promises";
import { dirname, resolve, basename } from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";
import { format } from "prettier";
import basic from "./guides/basic.mjs";
import navigation from "./guides/navigation.mjs";
import form from "./guides/form.mjs";
import feedback from "./guides/feedback.mjs";
import display from "./guides/display.mjs";
import propertyLabels from "./guides/property-labels.mjs";
import explanations from "./guides/explanations.mjs";

import platformNotes from "./guides/platform-notes.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, "../..");
const uiRoot = resolve(root, "packages/daisu-ui");
const guides = { ...basic, ...navigation, ...form, ...feedback, ...display };
const descriptionsByPage = JSON.parse(
  await readFile(resolve(here, "guides/api-descriptions.json"), "utf8"),
);
const config = ts.readConfigFile(
  resolve(uiRoot, "tsconfig.json"),
  ts.sys.readFile,
);
const parsed = ts.parseJsonConfigFileContent(config.config, ts.sys, uiRoot);
const roots = [...parsed.fileNames, resolve(uiRoot, "src/router/index.ts")];
const program = ts.createProgram(roots, parsed.options);
const checker = program.getTypeChecker();
const exports = new Map();
for (const [entry, from] of [
  ["src/index.ts", "@daisu-ui/ui"],
  ["src/router/index.ts", "@daisu-ui/ui/router"],
]) {
  const module = program.getSourceFile(resolve(uiRoot, entry));
  for (let symbol of checker.getExportsOfModule(
    checker.getSymbolAtLocation(module),
  )) {
    const name = symbol.name;
    if (symbol.flags & ts.SymbolFlags.Alias)
      symbol = checker.getAliasedSymbol(symbol);
    exports.set(name, { symbol, from });
  }
}
const catalogText = await readFile(
  resolve(root, "apps/demo/src/features/ui-demo/catalog.ts"),
  "utf8",
);
const { componentGroups } = await import(
  `data:text/javascript;base64,${Buffer.from(ts.transpile(catalogText, { module: ts.ModuleKind.ESNext })).toString("base64")}`
);
const catalog = componentGroups.flatMap((group) => group.items);
const descriptions = {
  value: "当前值；传入后由调用方更新",
  defaultValue: "非受控模式的初始值",
  onChange: "值发生变化时触发",
  children: "自定义内容",
  className: "根节点自定义类名",
  style: "根节点样式",
  disabled: "是否禁用",
  readonly: "是否只读",
  title: "标题内容",
  text: "显示文字",
  label: "显示文案",
  description: "补充描述",
  placeholder: "空值时的提示文字",
  size: "尺寸",
  color: "内容颜色",
  bgColor: "背景颜色",
  type: "类型",
  variant: "外观变体",
  theme: "外观主题",
  round: "圆角样式",
  border: "是否显示边框",
  bordered: "是否显示边框",
  icon: "图标内容",
  iconSize: "图标尺寸",
  iconColor: "图标颜色",
  width: "宽度",
  height: "高度",
  min: "最小值",
  max: "最大值或数量上限",
  minHeight: "最小高度",
  maxHeight: "最大高度",
  visible: "是否显示选择面板",
  show: "是否显示",
  onVisibleChange: "面板显示状态变化时触发",
  onShowChange: "显示状态变化时触发",
  onTap: "点击时触发",
  onClick: "点击时触发",
  onClose: "关闭时触发",
  onOpen: "打开时触发",
  onConfirm: "确认选择时触发",
  onCancel: "取消操作时触发",
  onError: "发生错误时触发",
  duration: "动画或显示时长，单位 ms",
  zIndex: "浮层层级",
  rootPortal: "挂载到 RootPortalHost；使用前需配置宿主",
  loading: "加载状态或自定义加载内容",
  items: "数据项配置",
  options: "选项配置",
  columns: "列或选项配置",
  list: "轮播数据列表",
  data: "数据列表",
  fileList: "当前文件列表",
  onInput: "原生输入事件",
  onFocus: "获得焦点时触发",
  onBlur: "失去焦点时触发",
  onClear: "清空内容时触发",
  onClickModal: "点击遮罩时触发",
  onBeforeEnter: "进入动画开始前触发",
  onEnter: "进入动画开始时触发",
  onAfterEnter: "进入动画完成时触发",
  onBeforeLeave: "离开动画开始前触发",
  onLeave: "离开动画开始时触发",
  onAfterLeave: "离开动画完成时触发",
  prefix: "前置内容",
  suffix: "后置内容",
  footer: "底部内容",
  header: "顶部内容",
  left: "左侧内容",
  right: "右侧内容",
  content: "内容",
  iconNode: "自定义图标内容",
  iconSlot: "自定义图标内容",
  renderItem: "自定义数据项内容",
  renderLabel: "自定义选项文案",
  renderIcon: "自定义图标",
  renderContent: "自定义内容",
  renderActions: "自定义操作区域",
  maxlength: "最大输入长度，-1 表示不限制",
  clearable: "是否显示清空入口",
  showWordLimit: "是否显示字数统计",
  safeAreaInsetBottom: "是否预留底部安全区",
  safeAreaBottom: "底部安全区高度",
  bottomSafeAreaHeight: "底部安全区高度",
  fixed: "是否固定定位",
  placeholder: "占位内容或输入提示",
  name: "名称或标识",
  key: "稳定的数据标识",
  src: "图片或媒体地址",
  alt: "图片说明与失败替代文字",
  mode: "展示或格式化模式",
};
Object.assign(descriptions, propertyLabels);
const cellText = (cell) => cell.replace(/\n/g, " ").replace(/\|/g, "\\|");
const table = (header, rows) =>
  `| ${header.join(" | ")} |\n| ${header.map(() => "---").join(" | ")} |\n${rows.map((row) => `| ${row.map(cellText).join(" | ")} |`).join("\n")}\n`;
function declaredType(name) {
  const entry = exports.get(name);
  if (!entry) return;
  const declaration = entry.symbol.declarations?.find(
    (node) =>
      ts.isTypeAliasDeclaration(node) || ts.isInterfaceDeclaration(node),
  );
  const type =
    declaration && ts.isTypeAliasDeclaration(declaration)
      ? checker.getTypeFromTypeNode(declaration.type)
      : checker.getDeclaredTypeOfSymbol(entry.symbol);
  return { ...entry, declaration, type };
}
function fields(name) {
  let info = declaredType(name);
  if (!info && name.endsWith("Props")) {
    const entry = exports.get(name.slice(0, -5));
    const declaration =
      entry?.symbol.valueDeclaration || entry?.symbol.declarations?.[0];
    if (declaration) {
      const callable = checker.getTypeOfSymbolAtLocation(
        entry.symbol,
        declaration,
      );
      const parameter = checker.getSignaturesOfType(
        callable,
        ts.SignatureKind.Call,
      )[0]?.parameters[0];
      if (parameter)
        info = {
          type: checker.getTypeOfSymbolAtLocation(
            parameter,
            parameter.valueDeclaration || declaration,
          ),
        };
    }
  }
  if (!info) return [];
  return checker.getPropertiesOfType(info.type).map((symbol) => {
    const declaration = symbol.valueDeclaration || symbol.declarations?.[0];
    const type = checker.getTypeOfSymbolAtLocation(symbol, declaration);
    const text =
      declaration?.type?.getText() ||
      checker.typeToString(type, declaration, ts.TypeFormatFlags.NoTruncation);
    return {
      name: symbol.name,
      optional: !!(symbol.flags & ts.SymbolFlags.Optional),
      type: text.replace(/\s+/g, " "),
      description: ts.displayPartsToString(
        symbol.getDocumentationComment(checker),
      ),
    };
  });
}
function defaults(component) {
  const entry = exports.get(component);
  const source = entry?.symbol.declarations?.[0]?.getSourceFile();
  const values = new Map();
  if (!source) return values;
  function visit(node) {
    if (
      (ts.isFunctionDeclaration(node) ||
        ts.isFunctionExpression(node) ||
        ts.isArrowFunction(node)) &&
      (node.name?.text === component ||
        node.name?.text === `Standard${component}`)
    ) {
      for (const parameter of node.parameters)
        if (ts.isObjectBindingPattern(parameter.name))
          for (const field of parameter.name.elements) {
            if (!field.initializer) continue;
            const name = field.propertyName?.getText() || field.name.getText();
            const value = field.initializer;
            if (
              ts.isStringLiteral(value) ||
              ts.isNumericLiteral(value) ||
              [
                ts.SyntaxKind.TrueKeyword,
                ts.SyntaxKind.FalseKeyword,
                ts.SyntaxKind.NullKeyword,
              ].includes(value.kind) ||
              ts.isPrefixUnaryExpression(value) ||
              ts.isArrayLiteralExpression(value)
            )
              values.set(name, value.getText().replace(/\s+/g, " "));
          }
    }
    ts.forEachChild(node, visit);
  }
  visit(source);
  return values;
}
function exampleCode(body) {
  const imports = new Map();
  const add = (from, name, type = false) => {
    const key = `${from}:${type}`;
    if (!imports.has(key)) imports.set(key, { from, type, names: [] });
    imports.get(key).names.push(name);
  };
  const source = ts.createSourceFile(
    "example.tsx",
    body,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TSX,
  );
  const names = new Set();
  const visit = (node) => {
    if (ts.isIdentifier(node)) names.add(node.text);
    ts.forEachChild(node, visit);
  };
  visit(source);
  for (const name of names) {
    if (
      ["useState", "useRef", "useEffect", "useMemo", "createRef"].includes(name)
    )
      add("@lynx-js/react", name);
    else if (["createRootRoute", "createRoute"].includes(name))
      add("@tanstack/react-router", name);
    else if (exports.has(name)) {
      const { symbol, from } = exports.get(name);
      add(from, name, !(symbol.flags & ts.SymbolFlags.Value));
    }
  }
  const code =
    [...imports.values()]
      .map(
        ({ from, type, names }) =>
          `import ${type ? "type " : ""}{ ${names.join(", ")} } from '${from}';`,
      )
      .join("\n") + `\n\nexport function Example() {\n${body}\n}\n`;
  return ts
    .createPrinter({ newLine: ts.NewLineKind.LineFeed })
    .printFile(
      ts.createSourceFile(
        "example.tsx",
        code,
        ts.ScriptTarget.Latest,
        true,
        ts.ScriptKind.TSX,
      ),
    );
}
function displayExample(code, imported) {
  const source = ts.createSourceFile(
    "example.tsx",
    code,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TSX,
  );
  const imports = [];
  for (const statement of source.statements) {
    if (!ts.isImportDeclaration(statement)) continue;
    const names =
      statement.importClause?.namedBindings?.elements?.filter(
        (element) => !imported.has(element.name.text),
      ) || [];
    if (!names.length) continue;
    for (const element of names) imported.add(element.name.text);
    imports.push(
      `import ${statement.importClause.isTypeOnly ? "type " : ""}{ ${names.map((element) => element.getText(source)).join(", ")} } from '${statement.moduleSpecifier.text}';`,
    );
  }
  const body = source.statements.find(
    (statement) =>
      ts.isFunctionDeclaration(statement) && statement.name?.text === "Example",
  ).body;
  const text = (node) => {
    const column = source.getLineAndCharacterOfPosition(
      node.getStart(source),
    ).character;
    return node
      .getText(source)
      .split("\n")
      .map((line, index) =>
        index ? line.replace(new RegExp(`^ {0,${column}}`), "") : line,
      )
      .join("\n");
  };
  const parts = [...imports];
  for (const statement of body.statements) {
    if (!ts.isReturnStatement(statement)) {
      parts.push(text(statement));
      continue;
    }
    let expression = statement.expression;
    while (ts.isParenthesizedExpression(expression))
      expression = expression.expression;
    if (ts.isJsxFragment(expression)) {
      parts.push(
        ...expression.children
          .filter((child) => !ts.isJsxText(child) || child.text.trim())
          .map((child) =>
            ts.isJsxExpression(child) ? text(child.expression) : text(child),
          ),
      );
    } else parts.push(text(expression));
  }
  return (
    parts
      .map((part, index) =>
        index === 0
          ? part
          : (part.trimStart().startsWith("<") &&
            parts[index - 1].trimStart().startsWith("<")
              ? "\n"
              : "\n\n") + part,
      )
      .join("") + "\n"
  );
}
const generatedExamples = [];
for (const [id, guide] of Object.entries(guides))
  for (const [index, example] of guide.examples.entries())
    generatedExamples.push({
      id,
      index,
      code: await format(exampleCode(example.body), {
        parser: "typescript",
        singleQuote: true,
        printWidth: 80,
        tabWidth: 2,
      }),
    });
// Validate actual consumer snippets, including generic and callback signatures.
const virtualRoot = resolve(here, ".examples");
const virtual = new Map(
  generatedExamples.map((example) => [
    resolve(virtualRoot, `${example.id}-${example.index}.tsx`),
    example.code,
  ]),
);
const host = ts.createCompilerHost({});
const originalGet = host.getSourceFile.bind(host);
const originalExists = host.fileExists.bind(host);
const originalDirectory = host.directoryExists?.bind(host);
host.fileExists = (path) => virtual.has(path) || originalExists(path);
host.directoryExists = (path) =>
  path === virtualRoot || !!originalDirectory?.(path);
host.getSourceFile = (path, version, ...rest) =>
  virtual.has(path)
    ? ts.createSourceFile(
        path,
        virtual.get(path),
        version,
        true,
        ts.ScriptKind.TSX,
      )
    : originalGet(path, version, ...rest);
const checkOptions = {
  target: ts.ScriptTarget.ES2022,
  module: ts.ModuleKind.ESNext,
  moduleResolution: ts.ModuleResolutionKind.Bundler,
  jsx: ts.JsxEmit.ReactJSX,
  jsxImportSource: "@lynx-js/react",
  strict: true,
  skipLibCheck: true,
  esModuleInterop: true,
  noEmit: true,
  types: ["@lynx-js/types", "@types/react"],
};
const examplesProgram = ts.createProgram(
  [...virtual.keys()],
  checkOptions,
  host,
);
const errors = ts.getPreEmitDiagnostics(examplesProgram);
if (errors.length) {
  console.error(
    ts.formatDiagnosticsWithColorAndContext(errors, {
      getCanonicalFileName: (x) => x,
      getCurrentDirectory: () => root,
      getNewLine: () => "\n",
    }),
  );
  process.exit(1);
}
const checkOnly = process.argv.includes("--check");
const drift = [];
async function writeGenerated(path, content) {
  let previous;
  try { previous = await readFile(path, "utf8"); }
  catch (error) { if (error.code !== "ENOENT") throw error; }
  if (previous === content) return;
  if (checkOnly) drift.push(path.slice(root.length + 1));
  else await writeFile(path, content);
}
const sources = {};
for (const item of catalog) {
  const { id, label } = item;
  if (id === "ai-guide") continue;
  const guide = guides[id];
  if (id !== "button" && !guide) throw Error(`Missing authored guide: ${id}`);
  const names = guide?.components || ["Button"];
  const componentSources = names.map((name) => {
    const declaration = exports.get(name)?.symbol.declarations?.[0];
    if (!declaration) throw Error(`Unknown public component: ${name}`);
    return {
      name,
      path: declaration.getSourceFile().fileName.slice(root.length + 1),
    };
  });
  const exampleId =
    { "form-detail": "form", navbar: "navigation", empty: "display" }[id] || id;
  let demo = `apps/demo/src/features/ui-demo/examples/${exampleId}.tsx`;
  try {
    await access(resolve(root, demo));
  } catch {
    demo = null;
  }
  const doc = `docs/ui/components/${id === "form-detail" ? "form" : id}.md`;
  sources[id] = { components: componentSources, demo, doc };
  if (id === "button") continue;
  const prior = new Map(
    Object.entries(descriptionsByPage[basename(doc, ".md")] || {}),
  );
  let content = `# ${label}\n\n${guide.intro}\n\n\`\`\`tsx\nimport { ${names.join(", ")} } from '${exports.get(names[0]).from}';\n\`\`\`\n`;
  const imported = new Set(names);
  let lastSection;
  for (const [index, example] of guide.examples.entries()) {
    if (example.section !== lastSection) {
      content += `\n## ${example.section}\n`;
      lastSection = example.section;
    }
    const description =
      explanations[id]?.[example.title] || example.description;
    if (!description)
      throw new Error(`Missing parameter explanation: ${id}/${example.title}`);
    const snippet = displayExample(
      generatedExamples.find(
        (value) => value.id === id && value.index === index,
      ).code,
      imported,
    );
    content += `\n### ${example.title}\n\n${description}\n\n\`\`\`tsx\n${snippet}\`\`\`\n`;
  }
  if (platformNotes[id]) content += `\n## 平台与资源说明\n\n${platformNotes[id]}\n`;
  content += "\n## Attributes 属性\n";
  const all = [];
  for (const name of names) {
    const typeName = name === "Tabs" ? "StandardTabsProps" : `${name}Props`;
    const props = fields(typeName);
    if (!props.length) throw Error(`No public props found for ${name}`);
    const initial = defaults(name);
    all.push(...props.map((field) => ({ ...field, component: name })));
    const rows = props
      .filter(
        (field) =>
          !/^on[A-Z]/.test(field.name) && !/^render[A-Z]/.test(field.name),
      )
      .map((field) => [
        field.name,
        prior.get(field.name) ||
          descriptions[field.name] ||
          field.description ||
          `${field.name} 配置`,
        "`" + field.type + "`",
        initial.has(field.name)
          ? "`" + initial.get(field.name) + "`"
          : !field.optional
            ? "必填"
            : "—",
      ]);
    content += `\n${names.length > 1 ? `### ${name}\n\n` : ""}${table(["参数", "说明", "类型 / 可选值", "默认值"], rows)}`;
    const parameters = declaredType(typeName)?.declaration?.typeParameters;
    if (parameters?.length)
      content += `\n泛型约束：${parameters.map((parameter) => "`" + parameter.getText() + "`").join("、")}。\n`;
  }
  const events = all.filter((field) => /^on[A-Z]/.test(field.name));
  if (events.length)
    content += `\n## Events 事件\n\n${table(
      ["事件", "说明", "类型"],
      events.map((field) => [
        names.length > 1 ? `${field.component}.${field.name}` : field.name,
        prior.get(field.name) ||
          descriptions[field.name] ||
          field.description ||
          "对应操作发生时触发",
        field.type,
      ]),
    )}`;
  const slots = all.filter(
    (field) =>
      /^render[A-Z]/.test(field.name) ||
      (!/^on[A-Z]/.test(field.name) && field.type.includes("ReactNode")),
  );
  if (slots.length)
    content += `\n## 内容插槽\n\n${table(
      ["名称", "说明", "类型"],
      slots.map((field) => [
        names.length > 1 ? `${field.component}.${field.name}` : field.name,
        prior.get(field.name) ||
          descriptions[field.name] ||
          field.description ||
          "自定义区域内容",
        field.type,
      ]),
    )}`;
  const methods = names.flatMap((name) =>
    fields(`${name}Ref`).map((field) => ({ ...field, component: name })),
  );
  if (methods.length)
    content += `\n## Methods 方法\n\n通过 ref 获取组件实例。\n\n${table(
      ["方法", "说明", "类型"],
      methods.map((field) => [
        field.name,
        field.description ||
          {
            open: "打开面板",
            close: "关闭面板",
            focus: "获得焦点",
            blur: "失去焦点",
            validate: "执行校验",
            reset: "重置状态",
            updatePosition: "重新计算位置",
          }[field.name] ||
          "调用实例方法",
        field.type,
      ]),
    )}`;
  const typeNames = new Set();
  for (const field of all)
    for (const match of field.type.matchAll(/\b[A-Z][A-Za-z0-9]+\b/g)) {
      const name = match[0];
      const entry = exports.get(name);
      const declaration = entry?.symbol.declarations?.find(
        (node) =>
          ts.isTypeAliasDeclaration(node) || ts.isInterfaceDeclaration(node),
      );
      if (
        declaration &&
        !/(Props|Ref)$/.test(name) &&
        name !== "Router" &&
        declaration.getText().length < 1800
      )
        typeNames.add(name);
    }
  if (typeNames.size) {
    const definitions = [...typeNames]
      .slice(0, 10)
      .map((name) =>
        exports
          .get(name)
          .symbol.declarations.find(
            (node) =>
              ts.isTypeAliasDeclaration(node) ||
              ts.isInterfaceDeclaration(node),
          )
          .getText(),
      )
      .join("\n\n");
    content +=
      "\n## 数据类型\n\n\x60\x60\x60tsx\n" +
      (await format(definitions, {
        parser: "typescript",
        singleQuote: true,
        printWidth: 80,
        tabWidth: 2,
      })) +
      "\x60\x60\x60\n";
  }
  content +=
    "\n## 主题定制\n\n页面主题可通过 [ConfigProvider 全局配置](config-provider.md) 统一设置。局部外观使用本组件属性表中的颜色、尺寸及自定义类名调整。\n\n```tsx\nimport { ConfigProvider } from '@daisu-ui/ui';\n\n<ConfigProvider theme=\"dark\">\n  {/* 页面内容 */}\n</ConfigProvider>\n```\n";
  const variables = new Set();
  for (const source of componentSources) {
    const cssName = basename(source.path, ".tsx").replace(
      /[A-Z]/g,
      (letter, index) => (index ? "-" : "") + letter.toLowerCase(),
    );
    try {
      const css = await readFile(
        resolve(uiRoot, "src", cssName + ".css"),
        "utf8",
      );
      for (const match of css.matchAll(/--cso-ui-[\w-]+/g))
        variables.add(match[0]);
    } catch (error) {
      if (error.code !== "ENOENT") throw error;
    }
  }
  if (variables.size)
    content += `\n### CSS 变量\n\n以下变量可通过 ConfigProvider 的 themeVars 覆盖，未设置时使用当前主题与组件的默认样式。\n\n${table(
      ["变量", "作用范围"],
      [...variables]
        .sort()
        .map((name) => [
          "`" + name + "`",
          name.startsWith("--cso-ui-" + id + "-") ? "当前组件" : "共享主题",
        ]),
    )}`;
  content += `\n## 源代码\n\n${componentSources.map((source) => `[${source.name} 组件源码](./sources/${id}/${basename(source.path)}.txt)`).join(" · ")}${demo ? ` · [示例源码](./sources/${id}/demo.tsx.txt)` : ""} · [文档源码](./sources/${id}/docs.md.txt)\n`;
  await writeGenerated(resolve(root, doc), content);
}
await writeGenerated(
  resolve(root, "docs/ui/component-sources.json"),
  JSON.stringify(sources, null, 2) + "\n",
);
if (drift.length) throw new Error(`组件文档未同步：${drift.join("、")}。本地构建会自动更新。`);
console.log(
  `${checkOnly ? "Checked" : "Generated"} ${Object.keys(sources).length - 1} component guides; checked ${generatedExamples.length} consumer examples. Button guide preserved.`,
);
