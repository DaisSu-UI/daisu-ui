import {afterEach,expect,rstest,test} from '@rstest/core';
import {qrCodePng,registerQrCodeExport} from './qrCodeExportElement.js';

afterEach(()=>rstest.restoreAllMocks());
test('PNG export embeds logo and background before SVG decoding and rejects failed image loads',async()=>{
 const original=document.createElement.bind(document),sources:string[]=[];
 rstest.spyOn(document,'createElement').mockImplementation(((tag:string)=>{
  const element=original(tag);
  if(tag==='img'){
   Object.defineProperties(element,{naturalWidth:{value:32},naturalHeight:{value:32},src:{set(src:string){sources.push(src);queueMicrotask(()=>{element.dispatchEvent(new Event(src.includes('missing')?'error':'load'));});}}});
  }
  return element;
 }) as typeof document.createElement);
 rstest.spyOn(HTMLCanvasElement.prototype,'getContext').mockReturnValue({drawImage:()=>{}} as unknown as CanvasRenderingContext2D);
 rstest.spyOn(HTMLCanvasElement.prototype,'toDataURL').mockReturnValue('data:image/png;base64,cG5n');
 const svg='<svg xmlns="http://www.w3.org/2000/svg"><image href="https://example.com/logo.png"/><image href="/background.png"/></svg>';
 expect(await qrCodePng(svg,200,document)).toBe('data:image/png;base64,cG5n');
 const embedded=decodeURIComponent(sources.at(-1)!.split(',').slice(1).join(','));
 expect(embedded.match(/href="data:image\/png/g)).toHaveLength(2);expect(embedded).not.toContain('example.com');expect(embedded).not.toContain('/background.png');
 await expect(qrCodePng(svg.replace('logo.png','missing.png'),200,document)).rejects.toThrow('图片加载失败');
 await expect(qrCodePng(svg,5000,document)).rejects.toThrow('size');
});
test('WebCore invoke returns a cloneable value and reports async failures through the result event',async()=>{
 registerQrCodeExport();
 const element=document.createElement('daisu-qr-export') as HTMLElement&{exportImage:(request:{id:number;svg:string;size:number})=>void};
 document.body.append(element);
 try{
  const result=new Promise<CustomEvent<{id:number;error:string}>>(resolve=>element.addEventListener('qrexport',e=>resolve(e as CustomEvent),{once:true}));
  const returned=element.exportImage({id:7,svg:'<svg/>',size:5000});
  expect(returned).toBeUndefined();expect(()=>structuredClone({returned})).not.toThrow();
  const event=await result;expect(event.detail.id).toBe(7);expect(event.detail.error).toContain('Invalid QR export size');expect(()=>structuredClone(event.detail)).not.toThrow();
 }finally{element.remove();}
});
