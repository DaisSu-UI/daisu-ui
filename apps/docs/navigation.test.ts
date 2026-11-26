import {afterEach,expect,test} from '@rstest/core';
import {aiPages,articlePages,documentationGroups,changelogVersions,createNavigationMenus,headingId,pageSection} from './public/navigation.js';
let navigation:ReturnType<typeof createNavigationMenus>|undefined;
afterEach(()=>{navigation?.destroy();document.body.replaceChildren();});
function mount(){
 document.body.innerHTML='<div data-nav-menu><button data-menu-trigger>AI</button><nav data-menu-panel><a href="#/ai-guide">指南</a><a href="#/ai-llm">LLM</a></nav></div><div data-nav-menu><button data-menu-trigger>版本</button><nav data-menu-panel><a href="#/changelog">更新</a></nav></div><button id="outside">外部</button>';
 const roots=[...document.querySelectorAll<HTMLElement>('[data-nav-menu]')];
 navigation=createNavigationMenus(roots);
 return roots.map(root=>({root,button:root.querySelector<HTMLButtonElement>('button')!,panel:root.querySelector<HTMLElement>('nav')!,links:[...root.querySelectorAll('a')]}));
}
const key=(target:Element,key:string)=>target.dispatchEvent(new KeyboardEvent('keydown',{key,bubbles:true,cancelable:true}));
const pointer=(target:Element,type:string,pointerType:string)=>{const event=new Event(type);Object.assign(event,{pointerType});target.dispatchEvent(event);};
test('AI pages are article pages and version targets are backed by actual changelog headings',()=>{
 expect(aiPages.every(page=>pageSection(page.id)==='ai')).toBe(true);
 expect(new Set(articlePages.map(page=>page.id)).size).toBe(articlePages.length);
 expect(documentationGroups.map(group=>group.label)).toEqual(['快速开始','设计系统','AI','工程实践','组合与工具','社区']);
 expect(aiPages.map(page=>page.label)).toEqual(['AI 总览','LLMs.txt','@daisu-ui/cli','AI Skills']);
 expect(pageSection('ai-mcp')).toBe('ai');
 expect(articlePages.some(page=>page.id==='ai-mcp')).toBe(true);
 expect(pageSection('dark-mode')).toBe('design');
 expect(pageSection('faq')).toBe('guide');
 expect(pageSection('button')).toBe('components');expect(pageSection('changelog')).toBe('versions');
 const versions=changelogVersions('# Log\n## 1.2.0-beta.1\n## Unreleased\n## v1.1.0\n## 1.1.0\n','1.2.0-beta.1');
 expect(versions).toEqual([{version:'1.2.0-beta.1',section:'changelog-1-2-0-beta-1',current:true},{version:'1.1.0',section:'changelog-v1-1-0',current:false}]);
 expect(versions[1]!.section).toBe(headingId('changelog','v1.1.0'));
 expect(()=>changelogVersions('## 1.0.0','2.0.0')).toThrow('Missing changelog');
});
test('keyboard navigation wraps links, closes siblings, restores trigger focus and leaves with Tab',()=>{
 const [ai,version]=mount();ai!.button.focus();key(ai!.button,'ArrowDown');
 expect(ai!.panel.hidden).toBe(false);expect(document.activeElement).toBe(ai!.links[0]);
 key(ai!.links[0]!,'ArrowUp');expect(document.activeElement).toBe(ai!.links[1]);
 key(ai!.links[1]!,'Home');expect(document.activeElement).toBe(ai!.links[0]);
 key(ai!.links[0]!,'Escape');expect(ai!.panel.hidden).toBe(true);expect(document.activeElement).toBe(ai!.button);
 ai!.button.click();version!.button.focus();key(version!.button,'ArrowUp');expect(ai!.panel.hidden).toBe(true);expect(document.activeElement).toBe(version!.links[0]);
 document.querySelector<HTMLButtonElement>('#outside')!.focus();expect(version!.panel.hidden).toBe(true);expect(version!.button.getAttribute('aria-expanded')).toBe('false');
});
test('mouse hover and touch activation share one disclosure, with outside and link dismissal',()=>{
 const [ai,version]=mount();pointer(ai!.root,'pointerenter','mouse');expect(ai!.panel.hidden).toBe(false);
 ai!.button.click();expect(ai!.panel.hidden).toBe(false);ai!.button.click();expect(ai!.panel.hidden).toBe(true);
 pointer(version!.root,'pointerenter','touch');expect(version!.panel.hidden).toBe(true);version!.button.click();expect(version!.panel.hidden).toBe(false);
 document.body.click();expect(version!.panel.hidden).toBe(true);
 ai!.button.click();ai!.links[0]!.click();expect(ai!.panel.hidden).toBe(true);
 navigation!.destroy();ai!.button.click();expect(ai!.panel.hidden).toBe(true);
});
