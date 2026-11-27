import { afterEach, expect, rstest, test } from '@rstest/core';
import { cleanup, fireEvent, render } from '@lynx-js/react/testing-library';
import * as actualContent from './rich-text-content.js' with { rstest: 'importActual' };

const { embeddedImage } = rstest.hoisted(() => ({
  embeddedImage: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jqWQAAAAASUVORK5CYII=',
}));
// Exercise the native build's image URLs through the real Demo and parser.
rstest.mock('./rich-text-content.js', () => ({
  ...actualContent,
  lake: embeddedImage,
  journal: `<p>图文详情</p><img src="${embeddedImage}">`,
  editorExamples: [{ name: 'TinyMCE', note: '', content: `<img src="${embeddedImage}">` }],
}));
import { RichTextExample } from './rich-text.js';

afterEach(cleanup);

test('RichText Demo preserves embedded native images in its article and editor examples', () => {
  const screen = render(<RichTextExample />);
  const articleImage = screen.container.querySelector('.demo-rich-article image');
  expect(articleImage?.getAttribute('src')).toBe(embeddedImage);
  fireEvent.tap(screen.getByText('TinyMCE'));
  const editorImage = screen.container.querySelector('.demo-rich-editor image');
  expect(editorImage?.getAttribute('src')).toBe(embeddedImage);
});
