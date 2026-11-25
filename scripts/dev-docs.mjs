import { findCli, nodeProcess, uiRoot, isCi } from './sync-cli.mjs';
const children = new Set();
let stopping = false;
const stop = (exitCode = 0) => {
  if (stopping) return;
  stopping = true;
  process.exitCode = exitCode;
  for (const child of children) child.kill('SIGTERM');
};
function start(root, args) {
  const child = nodeProcess(root, args);
  children.add(child);
  child.once('error', error => { console.error(error.message); stop(1); });
  child.once('exit', (code, signal) => {
    children.delete(child);
    if (!stopping) stop(code || (signal ? 1 : 0));
  });
}
const cli = await findCli();
start(uiRoot, ['apps/docs/serve.mjs']);
if (cli && !isCi()) start(cli, ['scripts/auto-sync.mjs', '--ui-dir', uiRoot, '--watch', '--build-docs', '--skip-initial']);
for (const signal of ['SIGINT', 'SIGTERM']) process.once(signal, () => stop());
