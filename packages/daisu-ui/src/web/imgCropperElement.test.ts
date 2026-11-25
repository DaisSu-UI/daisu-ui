import {afterEach,beforeEach,expect,rstest,test} from '@rstest/core';
import {registerImgCropper} from './imgCropperElement.js';
import type {ImgCropperSignal} from '../imgCropperModel.js';
let encode:BlobCallback,created:ReturnType<typeof rstest.fn>,revoked:ReturnType<typeof rstest.fn>;
const context={scale:()=>{},translate:()=>{},rotate:()=>{},drawImage:()=>{},fillRect:()=>{},fillStyle:''};
beforeEach(()=>{
 rstest.stubGlobal('ResizeObserver',class{observe(){}disconnect(){}});
 created=rstest.fn(()=>`blob:test-${Math.random()}`);revoked=rstest.fn();
 Object.defineProperty(URL,'createObjectURL',{configurable:true,value:created});Object.defineProperty(URL,'revokeObjectURL',{configurable:true,value:revoked});
 rstest.spyOn(HTMLCanvasElement.prototype,'getContext').mockReturnValue(context as unknown as CanvasRenderingContext2D);
 rstest.spyOn(HTMLCanvasElement.prototype,'toBlob').mockImplementation(callback=>{encode=callback;});rstest.spyOn(HTMLAnchorElement.prototype,'click').mockImplementation(()=>{});registerImgCropper();
});
afterEach(async()=>{document.querySelectorAll('daisu-img-cropper').forEach(e=>e.remove());await Promise.resolve();rstest.restoreAllMocks();rstest.unstubAllGlobals();});
function mount(){const node=document.createElement('daisu-img-cropper') as HTMLElement&{confirm:()=>boolean;cancel:()=>void;downloadResult:(args:{url:string})=>boolean;setRotate:(args:{deg:number})=>boolean};const events:ImgCropperSignal[]=[];node.addEventListener('cropperevent',e=>events.push((e as CustomEvent<ImgCropperSignal>).detail));rstest.spyOn(node,'getBoundingClientRect').mockReturnValue({width:390,height:800} as DOMRect);const config={show:true,imgSrc:'https://example.com/image.png',aspectRatio:'1:1',disabledRotate:false,exportScale:2,maxScale:3,quality:1,fileType:'png',cancelButtonText:'取消',confirmButtonText:'完成'};node.setAttribute('cropper-config',JSON.stringify(config));document.body.append(node);const image=node.shadowRoot!.querySelector('img')!;Object.defineProperties(image,{naturalWidth:{value:1200},naturalHeight:{value:750}});image.dispatchEvent(new Event('load'));return{node,image,events,config};}
test('cropper produces a real blob lease, preserves it on close and releases it on unmount',async()=>{
 const {node,events,config}=mount();expect(node.confirm()).toBe(true);encode(new Blob(['png'],{type:'image/png'}));const result=events.find(e=>e.kind==='confirm')!.result!;expect(result.width).toBe(700);expect(result.height).toBe(700);expect(created).toHaveBeenCalledTimes(1);
 node.setAttribute('cropper-config',JSON.stringify({...config,show:false,fileType:'jpg'}));expect(revoked).not.toHaveBeenCalled();expect(node.downloadResult({url:result.tempFilePath})).toBe(true);expect(node.downloadResult({url:'https://external.invalid/'})).toBe(false);node.remove();await Promise.resolve();expect(revoked).toHaveBeenCalledWith(result.tempFilePath);
});
test('cropper cancels late canvas encodes and ignores source callbacks from a replaced request',()=>{
 const {node,image,events,config}=mount();expect(node.confirm()).toBe(true);node.cancel();encode(new Blob(['png']));expect(events.filter(e=>e.kind==='confirm')).toHaveLength(0);expect(created).not.toHaveBeenCalled();
 const oldLoad=image.onload;node.setAttribute('cropper-config',JSON.stringify({...config,imgSrc:''}));oldLoad?.call(image,new Event('load'));expect(events.filter(e=>e.kind==='loaded')).toHaveLength(1);
});
test('touch toolbar activates without a compatibility click and deduplicates it while preserving keyboard clicks',()=>{
 const {node,image}=mount(),button=node.shadowRoot!.querySelector<HTMLButtonElement>('.rotate')!;
 const pointer=(type:string,x=20)=>{const event=new Event(type,{bubbles:true});Object.assign(event,{pointerType:'touch',isPrimary:true,pointerId:1,clientX:x,clientY:0});button.dispatchEvent(event);};
 rstest.spyOn(button,'getBoundingClientRect').mockReturnValue({left:0,right:40,top:0,bottom:40} as DOMRect);
 pointer('pointerdown');pointer('pointerup');expect(image.style.transform).toContain('rotate(90deg)');
 button.dispatchEvent(new MouseEvent('click',{detail:1}));expect(image.style.transform).toContain('rotate(90deg)');
 button.click();expect(image.style.transform).toContain('rotate(180deg)');
 pointer('pointerdown');pointer('pointercancel');pointer('pointerup');expect(image.style.transform).toContain('rotate(180deg)');
 pointer('pointerdown',0);pointer('pointerup',30);expect(image.style.transform).toContain('rotate(180deg)');
});
