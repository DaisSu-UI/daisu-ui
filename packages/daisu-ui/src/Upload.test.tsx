import { afterEach, expect, test } from '@rstest/core';
import { cleanup, fireEvent, render } from '@lynx-js/react/testing-library';
import { Upload } from './Upload.js';
import type { UploadFile } from './Upload.js';
afterEach(cleanup);
test('Upload ignores an outstanding upload after disabling and a removal after unmount', async () => {
  let resolveUpload!: (file: UploadFile) => void, resolveRemove!: (allowed: boolean) => void, changes=0;
  const adapter={chooseAndUpload:()=>new Promise<UploadFile>(resolve=>{resolveUpload=resolve;})};
  const draw=(disabled=false)=><Upload adapter={adapter} disabled={disabled} onChange={()=>{changes++;}} />;
  const screen=render(draw());
  fireEvent.tap(screen.container.querySelector('.ui-upload-add')!);
  screen.rerender(draw(true));resolveUpload({url:'test.png'});
  await Promise.resolve();await Promise.resolve();expect(changes).toBe(0);
  screen.rerender(<Upload fileList={[{url:'test.png'}]} beforeRemove={()=>new Promise(resolve=>{resolveRemove=resolve;})} onChange={()=>{changes++;}} />);
  fireEvent.tap(screen.container.querySelector('.ui-upload-remove')!,{eventType:'catchEvent'});
  screen.unmount();resolveRemove(true);
  await Promise.resolve();await Promise.resolve();expect(changes).toBe(0);
});

test('Upload limits, progress and completion ignore duplicate taps and late progress', async () => {
  let finish!: (file: UploadFile | null) => void, report!: (value: number) => void;
  const changes: UploadFile[][] = [], progress: number[] = [];
  const adapter = { chooseAndUpload: (update: (value: number) => void) => { report = update; return new Promise<UploadFile | null>(resolve => { finish = resolve; }); } };
  const screen = render(<Upload adapter={adapter} limit={1} onProgress={value => progress.push(value)} onChange={event => changes.push(event.fileList)} />);
  const add = screen.container.querySelector('.ui-upload-add')!;
  fireEvent.tap(add); fireEvent.tap(add); report(150); report(NaN); expect(progress).toEqual([100]);
  finish({ url: 'new.jpg' }); await Promise.resolve(); await Promise.resolve(); expect(changes).toHaveLength(1); expect(changes[0]?.[0]?.status).toBe('success');
  report(50); expect(progress).toEqual([100]);
  screen.rerender(<Upload adapter={adapter} fileList={changes[0]} limit={1} />); expect(screen.container.querySelector('.ui-upload-add')).toBeNull();
});

test('Upload can replace a file at the limit without previewing or removing adjacent files', async () => {
  const files: UploadFile[] = [{ url: 'one.jpg' }, { url: 'two.jpg' }], changes: UploadFile[][] = [];
  let previews = 0;
  const adapter = { chooseAndUpload: async () => ({ url: 'replacement.jpg' }), preview: () => { previews++; } };
  const screen = render(<Upload adapter={adapter} fileList={files} limit={2} reupload onChange={event => changes.push(event.fileList)} />);
  fireEvent.tap(screen.container.querySelectorAll('.ui-upload-picture')[1]!); await Promise.resolve(); await Promise.resolve();
  expect(changes).toEqual([[files[0], { url: 'replacement.jpg', status: 'success' }]]); expect(previews).toBe(0);
  screen.rerender(<Upload adapter={adapter} fileList={files} reupload readonly />); fireEvent.tap(screen.container.querySelector('.ui-upload-picture')!); await Promise.resolve(); await Promise.resolve(); expect(previews).toBe(1);
});

test('Upload selection guards block duplicate requests, cancellation and results after a source reset', async () => {
  let resolve!: (value: boolean) => void, choices = 0, changes = 0;
  const adapter = { chooseAndUpload: async () => { choices++; return { url: 'new.jpg' }; } };
  const beforeChoose = () => new Promise<boolean>(done => { resolve = done; });
  const screen = render(<Upload adapter={adapter} beforeChoose={beforeChoose} onChange={() => { changes++; }} />);
  const tap = () => fireEvent.tap(screen.container.querySelector('.ui-upload-add')!);
  tap(); tap(); resolve(false); await Promise.resolve(); await Promise.resolve(); expect(choices).toBe(0);
  tap(); screen.rerender(<Upload adapter={adapter} fileList={[{ url: 'external.jpg' }]} beforeChoose={beforeChoose} />); resolve(true); await Promise.resolve(); await Promise.resolve(); expect(choices).toBe(0); expect(changes).toBe(0);
  tap(); screen.unmount(); resolve(true); await Promise.resolve(); await Promise.resolve(); expect(choices).toBe(0);
});

test('Upload preview guards cancel, invalidate stale results, and surface adapter failures', async () => {
  const files = [{ url: 'one.jpg' }]; let resolve!: (value: boolean) => void, previews = 0, failures = 0;
  const adapter = { chooseAndUpload: async () => null, preview: () => { previews++; throw new Error('preview failed'); } };
  const guard = () => new Promise<boolean>(done => { resolve = done; });
  const screen = render(<Upload fileList={files} adapter={adapter} beforePreview={guard} onFail={() => { failures++; }} />);
  const tap = () => fireEvent.tap(screen.container.querySelector('.ui-upload-picture')!);
  tap(); resolve(false); await Promise.resolve(); await Promise.resolve(); expect(previews).toBe(0);
  tap(); screen.rerender(<Upload fileList={[]} adapter={adapter} />); resolve(true); await Promise.resolve(); await Promise.resolve(); expect(previews).toBe(0);
  screen.rerender(<Upload fileList={files} adapter={adapter} onFail={() => { failures++; }} />); tap(); await Promise.resolve(); await Promise.resolve(); expect(previews).toBe(1); expect(failures).toBe(1);
});

test('Upload removal guards retain cancelled files, emit remove after confirmation and respect readonly/loading', async () => {
  const file: UploadFile = { url: 'one.jpg' }, files = [file], changes: UploadFile[][] = []; let allowed = false, removed = 0;
  const screen = render(<Upload fileList={files} beforeRemove={async () => allowed} onChange={event => changes.push(event.fileList)} onRemove={() => { removed++; }} />);
  const tap = () => fireEvent.tap(screen.container.querySelector('.ui-upload-remove')!, { eventType: 'catchEvent' });
  tap(); await Promise.resolve(); await Promise.resolve(); expect(changes).toEqual([]);
  allowed = true; tap(); await Promise.resolve(); await Promise.resolve(); expect(changes).toEqual([[]]); expect(removed).toBe(1);
  screen.rerender(<Upload fileList={files} readonly />); expect(screen.container.querySelector('.ui-upload-remove')).toBeNull(); expect(screen.container.querySelector('.ui-upload-add')).toBeNull();
  screen.rerender(<Upload fileList={[{ ...file, status: 'loading', percent: 37 }]} />); expect(screen.container.querySelector('.ui-upload-status')?.textContent).toBe('37%'); expect(screen.container.querySelector('.ui-upload-remove')).toBeNull();
});
