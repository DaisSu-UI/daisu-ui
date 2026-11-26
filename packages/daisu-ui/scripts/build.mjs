import { cpSync, existsSync, mkdirSync, readFileSync, readdirSync, rmSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';

const packageRoot = fileURLToPath(new URL('..', import.meta.url));
const sourceRoot = join(packageRoot, 'src');
const outputRoot = join(packageRoot, 'dist');
const configFile = ts.readConfigFile(join(packageRoot, 'tsconfig.json'), ts.sys.readFile);
if (configFile.error) throw new Error(ts.flattenDiagnosticMessageText(configFile.error.messageText, '\n'));
const config = ts.parseJsonConfigFileContent(configFile.config, ts.sys, packageRoot);
const program = ts.createProgram(config.fileNames, config.options);
const diagnostics = [...config.errors, ...ts.getPreEmitDiagnostics(program)];
if (diagnostics.length) {
  console.error(ts.formatDiagnosticsWithColorAndContext(diagnostics, {
    getCanonicalFileName: name => name,
    getCurrentDirectory: () => packageRoot,
    getNewLine: () => '\n',
  }));
  process.exit(1);
}

// tsc preserves JSX as .jsx. Rewrite only module specifiers resolving to TSX;
// declarations and runtime imports must agree on the actual output filenames.
const rewriteModules = context => source => {
  const visit = (node, parent) => {
    if (ts.isStringLiteral(node) && node.text.startsWith('.') && node.text.endsWith('.js')) {
      const isModule = parent && (ts.isImportDeclaration(parent) || ts.isExportDeclaration(parent)) && parent.moduleSpecifier === node;
      const isDynamicImport = parent && ts.isCallExpression(parent) && parent.expression.kind === ts.SyntaxKind.ImportKeyword;
      const isDeclarationImport = parent && ts.isLiteralTypeNode(parent);
      if (isModule || isDynamicImport || isDeclarationImport) {
        if (existsSync(resolve(dirname(source.fileName), node.text.replace(/\.js$/, '.tsx')))) {
          return context.factory.createStringLiteral(node.text.replace(/\.js$/, '.jsx'));
        }
      }
    }
    return ts.visitEachChild(node, child => visit(child, node), context);
  };
  return ts.visitNode(source, node => visit(node, undefined));
};

// CSS is a runtime side effect, not part of the declaration API. Consumers do
// not need an ambient CSS module declaration just to use the component types.
const stripStyleImports = context => source => context.factory.updateSourceFile(
  source,
  source.statements.filter(statement => !(ts.isImportDeclaration(statement)
    && !statement.importClause
    && ts.isStringLiteral(statement.moduleSpecifier)
    && statement.moduleSpecifier.text.endsWith('.css'))),
);

rmSync(outputRoot, { recursive: true, force: true });
const result = program.emit(undefined, undefined, undefined, undefined, {
  before: [rewriteModules],
  afterDeclarations: [stripStyleImports, rewriteModules],
});
if (result.emitSkipped) throw new Error('Daisu UI emit failed');

function copyAssets(directory) {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const source = join(directory, entry.name);
    if (entry.isDirectory()) { copyAssets(source); continue; }
    if (!entry.name.endsWith('.css') && !entry.name.endsWith('.svg') && entry.name !== 'styles.d.ts' && !entry.name.startsWith('LICENSE')) continue;
    const destination = join(outputRoot, relative(sourceRoot, source));
    mkdirSync(dirname(destination), { recursive: true });
    cpSync(source, destination);
  }
}
copyAssets(sourceRoot);

// Keep npm metadata documents in sync with their canonical workspace sources.
for (const name of ['README.md', 'LICENSE']) {
  cpSync(resolve(packageRoot, '../..', name), join(packageRoot, name));
}

const entry = readFileSync(join(outputRoot, 'index.js'), 'utf8');
if (!entry.includes('./Button.jsx')) throw new Error('Expected preserved-JSX Button export');
console.log('Daisu UI built: ESM, preserved JSX, declarations and CSS');
