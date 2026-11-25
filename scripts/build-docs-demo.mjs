import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
// Compile bundles directly so the watcher never re-enters its synchronization hook.
execFileSync(process.platform === 'win32' ? 'npm.cmd' : 'npm', ['run', 'build', '--workspace', '@daisu-ui/demo'], {
  cwd: fileURLToPath(new URL('../', import.meta.url)), stdio: 'inherit',
});
