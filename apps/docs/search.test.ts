import {afterEach,expect,test} from '@rstest/core';
import {createDocumentSearch} from './public/search.js';
afterEach(()=>document.body.replaceChildren());
function mount(){
 document.body.innerHTML='<button id="open">搜索</button><dialog><input><div data-search-results></div><p data-search-status></p><button data-search-close>关闭</button></dialog>';
 const dialog=document.querySelector<HTMLDialogElement>('dialog')!,selected:string[]=[];
 Object.defineProperties(dialog,{showModal:{value(){dialog.setAttribute('open','');}},close:{value(){dialog.removeAttribute('open');}}});
 const search=createDocumentSearch(dialog,(id:string)=>selected.push(id));
 search.setDocuments([{id:'theme-customization',label:'定制主题',group:'设计系统'},{id:'dark-mode',label:'深色模式',group:'设计系统'},{id:'button',label:'Button 按钮',group:'基础组件'}]);
 const trigger=document.querySelector<HTMLButtonElement>('#open')!;trigger.focus();search.open();return{dialog,search,trigger,selected,input:dialog.querySelector('input')!};
}
test('document search filters by label or group and opens the keyboard selection with focus restored',()=>{
 const {dialog,input,selected,trigger}=mount();input.value='设计系统';input.dispatchEvent(new Event('input'));
 expect(dialog.querySelectorAll('[role=option]')).toHaveLength(2);
 input.dispatchEvent(new KeyboardEvent('keydown',{key:'ArrowDown',bubbles:true}));input.dispatchEvent(new KeyboardEvent('keydown',{key:'Enter',bubbles:true}));
 expect(selected).toEqual(['dark-mode']);expect(dialog.open).toBe(false);expect(document.activeElement).toBe(trigger);
});
test('empty search results do not navigate and the dialog cancels without changing route',()=>{
 const {dialog,input,selected,trigger}=mount();input.value='unknown document';input.dispatchEvent(new Event('input'));input.dispatchEvent(new KeyboardEvent('keydown',{key:'Enter',bubbles:true}));
 expect(selected).toEqual([]);expect(dialog.querySelector('[data-search-status]')!.textContent).toContain('未找到');expect(input.hasAttribute('aria-activedescendant')).toBe(false);
 dialog.dispatchEvent(new Event('cancel',{cancelable:true}));expect(dialog.open).toBe(false);expect(document.activeElement).toBe(trigger);
});
