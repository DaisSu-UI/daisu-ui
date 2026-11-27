import { useLocale } from './useLocale.js';
import { forwardRef, useEffect, useImperativeHandle, useMemo, useRef } from '@lynx-js/react';
import type { CSSProperties, NodesRef, StandardProps } from '@lynx-js/types';
import { qrCodeLayout, qrCodeMatrix } from './qrCodeModel.js';
import type { QrCodeOptions } from './qrCodeModel.js';
export type QrCodeProps = QrCodeOptions & {exportMode?:'svg'|'browser';className?:string;style?:CSSProperties;onClick?:()=>void;onError?:(error:Error)=>void};
export type QrCodeRef = {exportImage:()=>Promise<string>;getSvg:()=>string};
type ExportSignal={id:number;url?:string;error?:string};
type ExportElementProps=StandardProps&{ref?:{current:NodesRef|null};bindqrexport?:(event:{detail:ExportSignal})=>void};
declare module '@lynx-js/types' {interface IntrinsicElements {'daisu-qr-export':ExportElementProps}}
declare global {namespace JSX {interface IntrinsicElements {'daisu-qr-export':ExportElementProps}}}
export const QrCode=forwardRef<QrCodeRef,QrCodeProps>(function QrCode({exportMode='svg',className='',style,onClick,onError,...options},ref){
  const { t: localeText } = useLocale();

  const exporter=useRef<NodesRef|null>(null),sequence=useRef(0),pending=useRef(new Map<number,{resolve:(url:string)=>void;reject:(error:Error)=>void;timer:ReturnType<typeof setTimeout>}>());
  const {text='',correctLevel='H'}=options;
  const encoded=useMemo(()=>{try{return{matrix:qrCodeMatrix(text,correctLevel)};}catch(error){return{matrix:[],error:error instanceof Error?error:new Error(String(error))};}},[text,correctLevel]);
  const key=JSON.stringify(options);
  const result=useMemo(()=>{try{return{layout:qrCodeLayout(encoded.matrix,options),error:encoded.error};}catch(error){return{error:error instanceof Error?error:new Error(String(error))};}},[encoded,key]);
  useEffect(()=>{if(result.error)onError?.(result.error);},[result]);
  useEffect(()=>()=>{for(const request of pending.current.values()){clearTimeout(request.timer);request.reject(new Error('二维码导出已取消'));}pending.current.clear();},[result,exportMode]);
  useImperativeHandle(ref,()=>({getSvg(){'background only';if(result.error||!text)throw result.error??new Error('QR content is empty');return result.layout!.svg;},async exportImage(){
    'background only';if(result.error||!text)throw result.error??new Error('QR content is empty');
    if(exportMode==='browser'){
      if(!exporter.current)throw new Error('浏览器二维码导出后端未就绪');
      return new Promise<string>((resolve,reject)=>{const id=++sequence.current;const timer=setTimeout(()=>{pending.current.delete(id);reject(new Error('二维码导出超时，请检查浏览器组件注册'));},15000);pending.current.set(id,{resolve,reject,timer});exporter.current!.invoke({method:'exportImage',params:{id,svg:result.layout!.svg,size:result.layout!.options.size}}).exec();});
    }
    if([options.logo,options.backgroundImage].some(src=>src&&!src.startsWith('data:image/')))throw new Error('包含外部图片的二维码请使用浏览器导出模式，或先将图片转为内嵌位图');
    return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(result.layout!.svg)}`;
  }}),[result,text,exportMode]);
  const layout=result.error?undefined:result.layout,o=layout?.options,logo=layout?.logo;
  return <view className={`ui-qr-code ${className}`} style={{width:`${o?.size??200}px`,height:`${o?.size??200}px`,backgroundColor:o?.colorLight??'#fff',...style}} bindtap={onClick} accessibility-element accessibility-label={text||localeText('qrcode.label')}>
    {exportMode==='browser'?<daisu-qr-export ref={exporter} className="ui-qr-code-export" bindqrexport={({detail:event}:{detail:ExportSignal})=>{'background only';const request=pending.current.get(event.id);if(!request)return;clearTimeout(request.timer);pending.current.delete(event.id);if(event.url)request.resolve(event.url);else request.reject(new Error(event.error||'二维码导出失败'));}}/>:null}
    {o?.backgroundImage&&text?<image className="ui-qr-code-surface" src={o.backgroundImage} mode="scaleToFill" binderror={()=>{'background only';onError?.(new Error('QR background image failed'));}}/>:null}
    {layout?<svg className="ui-qr-code-surface" content={layout.codeSvg}/>:null}
    {o?.logo&&text&&logo?<view className="ui-qr-code-logo" style={{left:`${logo.x-4}px`,top:`${logo.y-4}px`,width:`${logo.width+8}px`,height:`${logo.height+8}px`,borderRadius:`${o.logoRadius}px`,backgroundColor:o.logoBackgroundColor,borderWidth:`${o.logoBorderWidth}px`,borderColor:o.logoBorderColor||'transparent'}}><image src={o.logo} mode="scaleToFill" style={{position:'absolute',left:`${4-o.logoBorderWidth}px`,top:`${4-o.logoBorderWidth}px`,width:`${logo.width}px`,height:`${logo.height}px`,borderRadius:`${logo.radius}px`}} binderror={()=>{'background only';onError?.(new Error('QR logo failed'));}}/></view>:null}
  </view>;
});
