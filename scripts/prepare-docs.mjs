import { nodeProcess, syncCli, uiRoot, isCi } from './sync-cli.mjs';
const check = process.argv.includes('--check') || isCi();
async function run(args) {
  const child = nodeProcess(uiRoot, args);
  await new Promise((done, fail) => {
    child.once('error', fail);
    child.once('exit', code => code === 0 ? done() : fail(new Error(`${args.join(' ')} 失败（${code}）。`)));
  });
}
await run(['apps/docs/generate.mjs', ...(check ? ['--check'] : [])]);
await syncCli({ check, uiGenerated: true });
await run(['apps/docs/check-ai-docs.mjs']);
