import {expect,test} from '@rstest/core';
import {iconNames,iconPaths} from './paths.js';
import {glyphSvg} from './render.js';
import {iconCategories} from '../../../../apps/demo/src/features/ui-demo/examples/iconCatalog.js';

test('all public icon names have valid SVG geometry and appear once in the example catalog',()=>{
 expect(iconNames).toHaveLength(305);
 expect(new Set(iconCategories.flatMap(group=>group.names))).toEqual(new Set(iconNames));
 expect(iconCategories.flatMap(group=>group.names)).toHaveLength(iconNames.length);
 for(const name of iconNames){
  const document=new DOMParser().parseFromString(glyphSvg(iconPaths[name],'#123456'),'image/svg+xml');
  expect(document.querySelector('parsererror')).toBeNull();
  expect(document.documentElement.getAttribute('viewBox')).toBe('0 0 24 24');
  expect(document.querySelector('path,circle,rect,line,polyline,polygon,ellipse')).not.toBeNull();
 }
});
test('filled and outlined glyphs preserve literal paints and escape XML attribute values',()=>{
 expect(glyphSvg(iconPaths['star-fill'],'#12b886')).toContain('fill="#12b886"');
 expect(glyphSvg(iconPaths.star,'#12b886')).toContain('stroke="#12b886"');
 const document=new DOMParser().parseFromString(glyphSvg(iconPaths.star,'"><script/>'),'image/svg+xml');
 expect(document.querySelector('parsererror')).toBeNull();expect(document.querySelector('script')).toBeNull();
});
