import { resolveLocale, translate, zhCN } from '../locale.js';
import type { UiMessageKey } from '../locale.js';
import { cropperExportSize, cropperFrame, cropperGeometry, cropperInitialZoom, initialCropperTransform } from '../imgCropperModel.js';
import type { CropperSize, CropperTransform, ImgCropperConfig, ImgCropperSignal } from '../imgCropperModel.js';
const tag='daisu-img-cropper';
const styles=`:host{display:block;position:relative;width:100%;height:100%;overflow:hidden;background:#000;color:#fff;font:16px Arial,sans-serif}*{box-sizing:border-box}.viewport{position:absolute;left:0;width:100%;height:85%;touch-action:none;overflow:hidden;user-select:none;cursor:grab}.viewport:active{cursor:grabbing}.picture{position:absolute;left:50%;top:50%;max-width:none;max-height:none;transform-origin:center;pointer-events:none;user-select:none}.frame{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);border:1px solid #fff;box-shadow:0 0 0 9999px rgba(0,0,0,.85);pointer-events:none}.grid{position:absolute;inset:0;background:linear-gradient(to right,transparent 33.2%,rgba(255,255,255,.4) 33.2%,rgba(255,255,255,.4) 33.5%,transparent 33.5%,transparent 66.5%,rgba(255,255,255,.4) 66.5%,rgba(255,255,255,.4) 66.8%,transparent 66.8%),linear-gradient(to bottom,transparent 33.2%,rgba(255,255,255,.4) 33.2%,rgba(255,255,255,.4) 33.5%,transparent 33.5%,transparent 66.5%,rgba(255,255,255,.4) 66.5%,rgba(255,255,255,.4) 66.8%,transparent 66.8%)}.corner{position:absolute;width:20px;height:20px;border:2px solid #fff}.lt{left:-2px;top:-2px;border-right:0;border-bottom:0}.rt{right:-2px;top:-2px;border-left:0;border-bottom:0}.lb{left:-2px;bottom:-2px;border-right:0;border-top:0}.rb{right:-2px;bottom:-2px;border-left:0;border-top:0}.footer{position:absolute;bottom:0;left:0;width:100%;padding:16px;text-align:center;background:#000}.row{display:flex;align-items:center;justify-content:space-between;margin-top:32px}button{font:inherit;cursor:pointer;touch-action:manipulation;border:0;color:#fff;background:transparent;padding:0 20px;height:44px;border-radius:4px}button:disabled{opacity:.45;cursor:default}.confirm{min-width:72px;background:var(--cso-ui-img-cropper-confirm-bg,var(--cso-ui-primary,#1c64fd))}.rotate{display:block;margin:auto;padding:0;width:36px;height:36px}.rotate svg{width:36px;height:36px}.status{position:absolute;left:20px;right:20px;top:45%;text-align:center;font-size:14px;line-height:24px}.choose{background:#333;margin-top:12px}.error{color:#ffb5b5}.file{display:none}[hidden]{display:none!important}`;
const template=`<style>${styles}</style><div class="viewport"><img class="picture" alt="" draggable="false" hidden><div class="frame" hidden><div class="grid"></div><i class="corner lt"></i><i class="corner rt"></i><i class="corner lb"></i><i class="corner rb"></i></div></div><div class="status" role="status"><span class="message"></span><br><button class="choose" type="button"></button></div><input class="file" type="file" accept="image/png,image/jpeg,image/webp,image/gif"><div class="footer"><button type="button" class="rotate" aria-label=""><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 3v6h-6M20 9a9 9 0 1 0 1 7"/></svg></button><div class="row"><button type="button" class="cancel"></button><button type="button" class="confirm" disabled></button></div></div>`;

/** A browser canvas editor, registered only by the browser host. */
export function registerImgCropper(){
 if(customElements.get(tag))return;
 class BrowserImgCropper extends HTMLElement{
  static observedAttributes=['cropper-config'];
  private config?:ImgCropperConfig&{topInset?:number;autoChoose?:boolean};
  private source:CropperSize={width:0,height:0};
  private viewport:CropperSize={width:0,height:0};
  private frame:CropperSize={width:1,height:1};
  private transform:CropperTransform={...initialCropperTransform};
  private generation=0;private decoded=false;private busy=false;private animation=true;private sourceKey='';
  private observer?:ResizeObserver;private cleanup?:AbortController;private sourceUrl?:string;
  private results=new Map<string,'png'|'jpg'>();private pointers=new Map<number,{x:number;y:number}>();
  constructor(){super();this.attachShadow({mode:'open'});this.shadowRoot!.innerHTML=template;}
  private locale = zhCN as import('../locale.js').UiLocale;
  private text(key: UiMessageKey) { return translate(this.locale, key); }
  private get picture(){return this.shadowRoot!.querySelector<HTMLImageElement>('.picture')!;}
  private get stage(){return this.shadowRoot!.querySelector<HTMLDivElement>('.viewport')!;}
  private get confirmButton(){return this.shadowRoot!.querySelector<HTMLButtonElement>('.confirm')!;}
  connectedCallback(){
   if(this.cleanup)return;
   this.cleanup=new AbortController();const options={signal:this.cleanup.signal};
   this.observer=new ResizeObserver(()=>this.resize());this.observer.observe(this);
   this.stage.addEventListener('pointerdown',e=>{if(!this.decoded||this.busy)return;this.pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});this.stage.setPointerCapture(e.pointerId);e.preventDefault();},options);
   this.stage.addEventListener('pointermove',e=>this.move(e),options);
   const release=(e:PointerEvent)=>{this.pointers.delete(e.pointerId);};
   this.stage.addEventListener('pointerup',release,options);this.stage.addEventListener('pointercancel',release,options);
   this.stage.addEventListener('wheel',e=>{if(!this.decoded||this.busy)return;e.preventDefault();const rect=this.stage.getBoundingClientRect();this.zoomAt(Math.exp(-e.deltaY*.001),{x:e.clientX-rect.left-rect.width/2,y:e.clientY-rect.top-rect.height/2});}, {...options,passive:false});
   this.bindAction('.rotate',()=>this.setRotate({deg:this.transform.rotation+90}),options);
   this.bindAction('.cancel',()=>this.cancel(),options);
   this.bindAction('.confirm',()=>this.confirm(),options);
   this.bindAction('.choose',()=>this.chooseImage(),options);
   const input=this.shadowRoot!.querySelector<HTMLInputElement>('.file')!;
   input.addEventListener('change',()=>{const file=input.files?.[0];if(!file)return;if(!/^image\/(png|jpeg|webp|gif)$/.test(file.type)||file.size>20971520){this.error(this.text('cropper.fileLimit'));return;}this.releaseSource();this.sourceUrl=URL.createObjectURL(file);this.load(this.sourceUrl);input.value='';},options);
   this.ownerDocument.addEventListener('keydown',e=>{if(this.config?.show&&e.key==='Escape'){e.stopImmediatePropagation();this.cancel();}},options);
   this.configure();
  }
  private bindAction(selector:string,action:()=>unknown,options:AddEventListenerOptions){
   const button=this.shadowRoot!.querySelector<HTMLButtonElement>(selector)!;
   let press:{id:number;x:number;y:number}|undefined,ignoreClickUntil=0;
   // Touch gestures can suppress compatibility clicks. Activate on pointerup,
   // retaining native click for mouse/keyboard and deduplicating the touch click.
   button.addEventListener('pointerdown',e=>{if(e.pointerType!=='mouse'&&e.isPrimary&&!button.disabled)press={id:e.pointerId,x:e.clientX,y:e.clientY};},options);
   button.addEventListener('pointercancel',()=>{press=undefined;},options);
   button.addEventListener('pointerup',e=>{
    const start=press;press=undefined;if(!start||start.id!==e.pointerId||button.disabled)return;
    const rect=button.getBoundingClientRect();
    if(Math.hypot(e.clientX-start.x,e.clientY-start.y)>10||e.clientX<rect.left||e.clientX>rect.right||e.clientY<rect.top||e.clientY>rect.bottom)return;
    ignoreClickUntil=Date.now()+600;action();
   },options);
   button.addEventListener('click',e=>{if(!button.disabled&&!(e.detail>0&&Date.now()<ignoreClickUntil))action();},options);
  }
  disconnectedCallback(){queueMicrotask(()=>{if(!this.isConnected)this.dispose();});}
  attributeChangedCallback(){if(this.isConnected)this.configure();}
  private emit(signal:ImgCropperSignal){if(this.isConnected)this.dispatchEvent(new CustomEvent('cropperevent',{detail:signal,bubbles:true,composed:true}));}
  private configure(){
   let config:ImgCropperConfig&{topInset?:number;autoChoose?:boolean};try{config=JSON.parse(this.getAttribute('cropper-config')||'');}catch{return;}
   const previous=this.config;this.config=config;
   const oldLocale=this.locale;this.locale=resolveLocale(config.locale && typeof config.locale==='object'?config.locale:undefined);
   const message=this.shadowRoot!.querySelector('.message')!;
   const previousKey=Object.keys(oldLocale.messages).find(key=>key.startsWith('cropper.')&&oldLocale.messages[key as UiMessageKey]===message.textContent) as UiMessageKey|undefined;
   if(previousKey)message.textContent=this.text(previousKey);
   this.picture.alt=this.text('cropper.image');
   this.shadowRoot!.querySelector('.choose')!.textContent=this.text('cropper.choose');
   this.shadowRoot!.querySelector('.rotate')!.setAttribute('aria-label',this.text('cropper.rotate'));
   this.shadowRoot!.querySelector('.cancel')!.textContent=config.cancelButtonText??this.text('common.cancel');this.confirmButton.textContent=config.confirmButtonText??this.text('common.done');
   (this.shadowRoot!.querySelector('.rotate') as HTMLElement).style.visibility=config.disabledRotate?'hidden':'visible';
   this.stage.style.top=`-${Math.max(0,config.topInset||0)}px`;
   if(!config.show){this.generation++;this.busy=false;this.pointers.clear();this.picture.onload=null;this.picture.onerror=null;this.picture.removeAttribute('src');this.decoded=false;this.sourceKey='';this.releaseSource();return;}
   this.resize();
   if(!previous?.show||previous.imgSrc!==config.imgSrc){this.releaseSource();this.load(config.imgSrc||'');if(!config.imgSrc&&config.autoChoose)this.chooseImage();}
   else {this.apply(false);}
  }
  private status(message:string,error=false){const box=this.shadowRoot!.querySelector<HTMLDivElement>('.status')!;box.hidden=!message;box.classList.toggle('error',error);box.querySelector('.message')!.textContent=message;this.picture.hidden=!this.decoded;(this.shadowRoot!.querySelector('.frame') as HTMLElement).hidden=!this.decoded;}
  private error(message:string,phase:'load'|'export'|'config'='load'){this.busy=false;this.confirmButton.disabled=!this.decoded;this.status(message,true);this.emit({kind:'error',message,phase});}
  private safeSource(src:string){
   if(/^data:image\/(png|jpeg|webp|gif);base64,[a-z\d+/=]+$/i.test(src)&&src.length<8388608)return src;
   try{const url=new URL(src,this.ownerDocument.baseURI);if(url.username||url.password)return '';if(['http:','https:'].includes(url.protocol)||(url.protocol==='blob:'&&url.origin===this.ownerDocument.location.origin))return url.href;}catch{}return '';
  }
  private load(src:string){
   const generation=++this.generation;this.decoded=false;this.busy=false;this.confirmButton.disabled=true;this.sourceKey=src;
   this.transform={...initialCropperTransform};this.picture.onload=null;this.picture.onerror=null;this.picture.removeAttribute('src');
   if(!src){this.status(this.text('cropper.select'));return;}
   const url=this.safeSource(src);if(!url){this.error(this.text('cropper.invalidSource'));return;}
   this.status(this.text('cropper.loading'));const image=this.picture;image.crossOrigin='anonymous';
   image.onload=()=>{if(generation!==this.generation||!this.config?.show||!this.isConnected)return;this.source={width:image.naturalWidth,height:image.naturalHeight};if(!this.source.width||!this.source.height){this.error(this.text('cropper.invalidSize'));return;}this.decoded=true;this.resize();const geometry=cropperGeometry(this.source,this.frame,this.transform,this.config.maxScale);this.transform.zoom=cropperInitialZoom(this.source,this.viewport,geometry.coverScale,this.config.imgWidth,this.config.imgHeight);this.apply(false);this.status('');this.confirmButton.disabled=false;this.emit({kind:'loaded',...this.source});};
   image.onerror=()=>{if(generation===this.generation&&this.config?.show)this.error(this.text('cropper.loadFailed'));};image.src=url;
  }
  private resize(){
   if(!this.config?.show)return;const rect=this.getBoundingClientRect();if(rect.width<=0||rect.height<=0)return;this.viewport={width:rect.width,height:rect.height};
   try{this.frame=cropperFrame(this.viewport,this.config.aspectRatio);const frame=this.shadowRoot!.querySelector<HTMLElement>('.frame')!;frame.style.width=`${this.frame.width}px`;frame.style.height=`${this.frame.height}px`;if(this.decoded)this.apply(false);}catch(reason){this.error(String(reason));}
  }
  private apply(animate:boolean){
   if(!this.decoded||!this.config)return;const geometry=cropperGeometry(this.source,this.frame,this.transform,this.config.maxScale);this.transform={rotation:this.transform.rotation,zoom:geometry.zoom,offsetX:geometry.offsetX,offsetY:geometry.offsetY};
   const image=this.picture;image.style.width=`${this.source.width}px`;image.style.height=`${this.source.height}px`;image.style.transition=animate&&this.animation?'transform .3s':'none';image.style.transform=`translate(-50%,-50%) translate(${geometry.offsetX}px,${geometry.offsetY}px) rotate(${this.transform.rotation}deg) scale(${geometry.scale})`;
  }
  private move(e:PointerEvent){
   const previous=this.pointers.get(e.pointerId);if(!previous||!this.decoded||this.busy)return;e.preventDefault();
   const before=[...this.pointers.values()];this.pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});const after=[...this.pointers.values()];
   if(before.length>=2&&after.length>=2){const rect=this.stage.getBoundingClientRect(),a=before[0]!,b=before[1]!,c=after[0]!,d=after[1]!;
    const ratio=Math.hypot(c.x-d.x,c.y-d.y)/Math.max(1,Math.hypot(a.x-b.x,a.y-b.y));
    this.zoomAt(ratio,{x:(a.x+b.x)/2-rect.left-rect.width/2,y:(a.y+b.y)/2-rect.top-rect.height/2},{x:(c.x+d.x-a.x-b.x)/2,y:(c.y+d.y-a.y-b.y)/2});
   }else{this.transform.offsetX+=e.clientX-previous.x;this.transform.offsetY+=e.clientY-previous.y;this.apply(false);}
  }
  private zoomAt(ratio:number,point:{x:number;y:number},move={x:0,y:0}){
   const oldZoom=this.transform.zoom,nextZoom=Math.min(this.config?.maxScale||3,Math.max(1,oldZoom*ratio)),scale=nextZoom/oldZoom;
   this.transform.offsetX=point.x-scale*(point.x-this.transform.offsetX)+move.x;this.transform.offsetY=point.y-scale*(point.y-this.transform.offsetY)+move.y;this.transform.zoom=nextZoom;this.apply(false);
  }
  chooseImage(){if(!this.config?.show||this.busy)return false;(this.shadowRoot!.querySelector('.file') as HTMLInputElement).click();return true;}
  setRotate({deg}:{deg:number}){if(!Number.isFinite(deg)||!this.decoded||this.config?.disabledRotate||this.busy)return false;this.transform.rotation=deg;this.transform.offsetX=0;this.transform.offsetY=0;this.apply(true);return true;}
  resetImg(){if(!this.decoded||this.busy)return false;this.transform={...initialCropperTransform};this.apply(true);return true;}
  revertIsAnimation({animation}:{animation:boolean}){this.animation=animation===true;return true;}
  cancel(){if(!this.config?.show)return;this.generation++;this.busy=false;this.pointers.clear();this.emit({kind:'cancel'});}
  confirm(){
   if(!this.decoded||!this.config?.show||this.busy)return false;
   let size:CropperSize;try{size=cropperExportSize(this.frame,this.config.exportScale);}catch(reason){this.error(String(reason),'export');return false;}
   const generation=this.generation,config=this.config,geometry=cropperGeometry(this.source,this.frame,this.transform,config.maxScale);
   const canvas=this.ownerDocument.createElement('canvas');canvas.width=size.width;canvas.height=size.height;const context=canvas.getContext('2d');if(!context){this.error(this.text('cropper.exportUnsupported'),'export');return false;}
   this.busy=true;this.confirmButton.disabled=true;this.confirmButton.textContent=this.text('cropper.processing');
   try{
    if(config.fileType==='jpg'){context.fillStyle='#fff';context.fillRect(0,0,size.width,size.height);}
    const sx=size.width/this.frame.width,sy=size.height/this.frame.height;
    context.scale(sx,sy);context.translate(this.frame.width/2+geometry.offsetX,this.frame.height/2+geometry.offsetY);context.rotate(geometry.rotation*Math.PI/180);context.scale(geometry.scale,geometry.scale);context.drawImage(this.picture,-this.source.width/2,-this.source.height/2);
    canvas.toBlob(blob=>{canvas.width=0;canvas.height=0;if(generation!==this.generation||!this.config?.show||!this.isConnected)return;this.busy=false;this.confirmButton.disabled=false;this.confirmButton.textContent=config.confirmButtonText;
     if(!blob){this.error(this.text('cropper.exportFailed'),'export');return;}const url=URL.createObjectURL(blob);this.results.set(url,config.fileType);this.emit({kind:'confirm',result:{tempFilePath:url,...size,fileType:config.fileType}});
    },config.fileType==='jpg'?'image/jpeg':'image/png',config.quality);
   }catch(reason){canvas.width=0;canvas.height=0;this.error(translate(this.locale,'cropper.exportError',{error:String(reason)}),'export');this.confirmButton.textContent=config.confirmButtonText;return false;}
   return true;
  }
  revokeResult({url}:{url:string}){if(this.results.delete(url))URL.revokeObjectURL(url);}
  downloadResult({url}:{url:string}){if(!this.results.has(url))return false;const link=this.ownerDocument.createElement('a');link.href=url;link.download=`crop-${Date.now()}.${this.results.get(url)==='jpg'?'jpg':'png'}`;this.ownerDocument.body.append(link);link.click();link.remove();return true;}
  private releaseSource(){if(this.sourceUrl){URL.revokeObjectURL(this.sourceUrl);this.sourceUrl=undefined;}}
  private dispose(){this.generation++;this.cleanup?.abort();this.cleanup=undefined;this.observer?.disconnect();this.observer=undefined;this.picture.onload=null;this.picture.onerror=null;this.picture.removeAttribute('src');this.decoded=false;this.pointers.clear();this.releaseSource();for(const url of this.results.keys())URL.revokeObjectURL(url);this.results.clear();this.sourceKey='';}
 }
 customElements.define(tag,BrowserImgCropper);
}
