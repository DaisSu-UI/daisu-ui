import { execFileSync } from 'node:child_process';
import { mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const artifacts = fileURLToPath(new URL('../artifacts', import.meta.url));
mkdirSync(artifacts, { recursive: true });
execFileSync('npm', ['pack', '--workspace', '@daisu-ui/ui', '--pack-destination', artifacts], {
  cwd: root,
  stdio: 'inherit',
});
