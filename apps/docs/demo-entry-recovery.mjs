import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';

// Published before recovery was embedded in the Demo HTML. Keep this URL alive
// for browsers holding its old index.html in the GitHub Pages HTTP cache.
const legacyEntries = ['static/js/index.553eaa9829.js', 'static/js/index.87fdd81e89.js'];

function reloadDemoEntry(revision) {
  const target = new URL(window.location.href);
  if (target.searchParams.get('demoBuild') === revision) return;
  target.searchParams.set('demoBuild', revision);
  window.location.replace(target.href);
}

/** Recover an expired cached HTML/module graph without discarding its route. */
export async function prepareDemoEntryRecovery(directory) {
  const index = resolve(directory, 'index.html');
  const html = await readFile(index, 'utf8');
  const entry = html.match(/\bsrc=["'](static\/js\/index(?:\.[a-f0-9]+)?\.js)["']/)?.[1];
  if (!entry) throw Error('Demo entry script was not found while preparing cache recovery');
  const revision = JSON.stringify(entry);
  const recover = reloadDemoEntry.toString();
  const guard = `<script data-demo-recovery>(function(){${recover};window.addEventListener('error',function(event){if(event.target instanceof HTMLScriptElement||event.target instanceof HTMLLinkElement)reloadDemoEntry(${revision});},true);})();</script>`;
  await writeFile(index, html.replace('<head>', `<head>${guard}`));
  for (const name of legacyEntries) {
    const target = resolve(directory, name);
    await mkdir(dirname(target), { recursive: true });
    try {
      await writeFile(target, `(${recover})(${revision});\n`, { flag: 'wx' });
    } catch (error) {
      if (error.code !== 'EEXIST') throw error;
    }
  }
}
