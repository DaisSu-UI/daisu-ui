import { localeScope } from './locale.js';
import { useLocale } from './useLocale.js';
import { forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState } from '@lynx-js/react';
import type { ReactNode } from '@lynx-js/react';
import type { CSSProperties, NodesRef, StandardProps } from '@lynx-js/types';
import type { ImgProps } from './Img.js';
import { Img } from './Img.js';
import { ImagePreview } from './ImagePreview.js';
import { useImagePreview } from './useImagePreview.js';
import { Table } from './Table.js';
import { parseRichText, richBlockTags, richTextTableGrid } from './richTextModel.js';
import type { RichTextHeading, RichTextNode, RichTextParseOptions } from './richTextModel.js';
import { validRichTextMediaId } from './richTextMedia.js';
import type { RichTextMediaEvent, RichTextMediaSignal, RichTextMediaTimeUpdate } from './richTextMedia.js';
export type { RichTextMediaEvent, RichTextMediaTimeUpdate } from './richTextMedia.js';
export type { RichTextHeading } from './richTextModel.js';

export type RichTextError = { source:'parse'|'image'|'audio'|'video'; message?:string; code?:string; src?:string; index?:number };
export type RichTextRect = {top:number;left:number;width:number;height:number};
export type RichTextRef = {playMedia:(id:string)=>boolean;pauseMedia:(id?:string)=>boolean;seekMedia:(id:string,seconds:number)=>boolean;getText:()=>string;getHeadings:()=>RichTextHeading[];getAnchorRect:(id:string)=>Promise<RichTextRect>;scrollToAnchor:(id:string,options?:{offset?:number;duration?:number})=>Promise<void>};
export type RichTextProps = Omit<RichTextParseOptions,'enableMedia'> & {
  /** Browser only: first register the custom element from daisu-ui/web. */
  mediaMode?:'none'|'browser';
  onMediaPlay?:(event:RichTextMediaEvent)=>void;onMediaPause?:(event:RichTextMediaEvent)=>void;onMediaEnded?:(event:RichTextMediaEvent)=>void;onMediaTimeUpdate?:(event:RichTextMediaTimeUpdate)=>void;
  content?:string;selectable?:boolean;previewImage?:boolean;loadingImage?:string;errorImage?:string;children?:ReactNode;
  onLoad?:(event:{imageCount:number})=>void;onError?:(error:RichTextError)=>void;
  onLinkClick?:(event:{href:string})=>void;onImageClick?:(event:{src:string;index:number})=>void;
  onImageLoad?:(event:{src:string;index:number;width:number;height:number})=>void;
  /** Scroll the actual parent container using the measured viewport rect. */
  onScrollToAnchor?:(target:{id:string;rect:RichTextRect;offset:number;duration:number})=>void|Promise<void>;
  className?:string;style?:CSSProperties;
};
type BrowserMediaProps=StandardProps&{'media-config':string;ref?:((node:NodesRef|null)=>void)|{current:NodesRef|null};bindmediaevent?:(event:{detail:RichTextMediaSignal})=>void};
declare module '@lynx-js/types' {interface IntrinsicElements {'daisu-rich-media':BrowserMediaProps}}
declare global {namespace JSX {interface IntrinsicElements {'daisu-rich-media':BrowserMediaProps}}}

const textDefaults:Record<string,CSSProperties>={
  p:{margin:'0 0 12px'},
  h1:{fontSize:'2em',fontWeight:'bold',margin:'0 0 0.6em'},
  h2:{fontSize:'1.5em',fontWeight:'bold',margin:'0 0 0.6em'},
  h3:{fontSize:'1.17em',fontWeight:'bold',margin:'0 0 0.6em'},
  h4:{fontSize:'1em',fontWeight:'bold',margin:'0 0 0.6em'},
  h5:{fontSize:'0.83em',fontWeight:'bold',margin:'0 0 0.6em'},
  h6:{fontSize:'0.67em',fontWeight:'bold',margin:'0 0 0.6em'},
  ul:{margin:'0 0 12px'},ol:{margin:'0 0 12px'},
  strong:{fontWeight:'bold'},b:{fontWeight:'bold'},em:{fontStyle:'italic'},i:{fontStyle:'italic'},
  u:{textDecoration:'underline'},s:{textDecoration:'line-through'},del:{textDecoration:'line-through'},
  a:{color:'var(--cso-ui-rich-text-link-color, var(--cso-ui-primary))',textDecoration:'underline'},
  small:{fontSize:'0.8em'},sub:{fontSize:'0.8em',verticalAlign:'sub'},sup:{fontSize:'0.8em',verticalAlign:'super'},
  code:{fontFamily:'monospace'},pre:{fontFamily:'monospace',margin:'0 0 12px'},
  blockquote:{borderLeftWidth:'3px',borderLeftStyle:'solid',borderLeftColor:'var(--cso-ui-line)',paddingLeft:'12px',margin:'0 0 12px'},
  figure:{margin:'0 0 12px'},figcaption:{fontSize:'0.9em',textAlign:'center'},
  dl:{margin:'0 0 12px'},dt:{fontWeight:'bold'},dd:{margin:'0 0 8px 24px'},
  mark:{backgroundColor:'yellow',color:'black'},hr:{margin:'12px 0'},
};
function margins(style:CSSProperties){
  let top=0,bottom=0;
  const px=(value:unknown)=>typeof value==='number'?value:/^-?[\d.]+(?:px)?$/.test(String(value))?parseFloat(String(value)):0;
  for(const[name,value]of Object.entries(style)){
    if(name==='margin'){const parts=String(value).split(/\s+/);top=px(parts[0]);bottom=px(parts[2]??parts[0]);}
    else if(name==='marginTop')top=px(value);else if(name==='marginBottom')bottom=px(value);
  }
  return{top,bottom};
}
function Placeholder({src,text}:{src?:string;text:string}){const[failed,setFailed]=useState(false);return src&&!failed?<image src={src} mode="aspectFit" style={{width:'48px',height:'48px'}} binderror={()=>{'background only';setFailed(true);}}/>:<text className="ui-rich-text-image-alt">{text}</text>;}

function RichImage(props:ImgProps){
  const loaded=useRef(false);
  useEffect(()=>{if(!props.src)props.onError?.({detail:{}} as never);},[]);
  if(!props.src)return <view className="ui-rich-text-missing-image" style={{minHeight:'48px',height:props.height===undefined?undefined:typeof props.height==='number'?`${props.height}px`:props.height}}>{props.error}</view>;
  return <Img {...props} onLoad={event=>{'background only';loaded.current=true;props.onLoad?.(event);}} onClick={()=>{'background only';if(loaded.current)props.onClick?.();}}/>;
}

/** HTML is parsed into native views, nested text, images and the public Table. */
export const RichText=forwardRef<RichTextRef,RichTextProps>(function RichText({content='',mediaMode='none',onMediaPlay,onMediaPause,onMediaEnded,onMediaTimeUpdate,baseUrl,allowDataImage=false,enableAnchor=false,selectable=false,tagStyle,classStyles,previewImage=true,loadingImage,errorImage,children,onLoad,onError,onLinkClick,onImageClick,onImageLoad,onScrollToAnchor,className='',style},ref){
  const { locale, t: localeText } = useLocale();

  const parsed=useMemo(()=>{try{return{...parseRichText(content,{enableMedia:mediaMode==='browser',baseUrl,allowDataImage,enableAnchor,tagStyle,classStyles}),error:undefined};}catch(reason){const error=reason as Error&{code?:string};return{nodes:[],images:[],media:[] as RichTextNode[],headings:[],text:'',error:{source:'parse' as const,message:error.message,code:error.code}};}},[content,mediaMode,baseUrl,allowDataImage,enableAnchor,JSON.stringify(tagStyle),JSON.stringify(classStyles)]);
  const fallback=typeof children==='string'||typeof children==='number'?<text className="ui-rich-text-line">{children}</text>:children;
  const [previewMounted,setPreviewMounted]=useState(false);
  const [width,setWidth]=useState(300),preview=useImagePreview();
  const anchors=useRef(new Map<string,NodesRef>()),alive=useRef(true),current=useRef(parsed),scrollRequest=useRef(0);
  const failedMedia=useRef(new WeakSet<RichTextNode>());
  const mediaRefs=useRef(new Map<RichTextNode,{node:NodesRef;failed:boolean}>());
  const callbacks=useRef({onLoad,onError,onLinkClick,onImageClick,onImageLoad,onScrollToAnchor,onMediaPlay,onMediaPause,onMediaEnded,onMediaTimeUpdate});callbacks.current={onLoad,onError,onLinkClick,onImageClick,onImageLoad,onScrollToAnchor,onMediaPlay,onMediaPause,onMediaEnded,onMediaTimeUpdate};current.current=parsed;
  useEffect(()=>{if(parsed.error)callbacks.current.onError?.(parsed.error);else callbacks.current.onLoad?.({imageCount:parsed.images.length});},[parsed]);
  useEffect(()=>()=>{alive.current=false;scrollRequest.current++;anchors.current.clear();mediaRefs.current.clear();},[]);
  const readAnchor=async(id:string)=>{
    'background only';const version=current.current,node=anchors.current.get(id);if(!enableAnchor||!node||!alive.current)throw new Error('RichText anchor is unavailable');
    const rect=await new Promise<RichTextRect>((resolve,reject)=>node.invoke({method:'boundingClientRect',params:{androidEnableTransformProps:true,iosEnableTransformProps:true},success:result=>resolve(result as RichTextRect),fail:()=>reject(new Error('RichText anchor measurement failed'))}).exec());
    if(!alive.current||version!==current.current||![rect.top,rect.left,rect.width,rect.height].every(Number.isFinite)||rect.width<=0||rect.height<=0)throw new Error('RichText anchor is unavailable');return rect;
  };
  const mediaTarget=(id:string)=>{const matches=current.current.media.filter(node=>node.media?.id===id);return validRichTextMediaId(id)&&matches.length===1?mediaRefs.current.get(matches[0]!):undefined;};
  const sendMedia=(target:ReturnType<typeof mediaTarget>,method:string,params:Record<string,unknown>={})=>{'background only';if(!alive.current||!target||target.failed)return false;target.node.invoke({method,params}).exec();return true;};
  useImperativeHandle(ref,()=>({
    playMedia(id){'background only';return sendMedia(mediaTarget(id),'playMedia');},
    pauseMedia(id){'background only';if(id!==undefined)return sendMedia(mediaTarget(id),'pauseMedia');let sent=false;for(const node of current.current.media)sent=sendMedia(mediaRefs.current.get(node),'pauseMedia')||sent;return sent;},
    seekMedia(id,seconds){'background only';return Number.isFinite(seconds)&&seconds>=0&&sendMedia(mediaTarget(id),'seekMedia',{seconds});},
    getText(){'background only';return parsed.text;},getHeadings(){'background only';return parsed.headings.map(h=>({...h}));},getAnchorRect:readAnchor,async scrollToAnchor(id,{offset=0,duration=300}={}){
    'background only';if(!Number.isFinite(offset)||!Number.isFinite(duration)||duration<0)throw new Error('Invalid anchor scroll options');
    if(!callbacks.current.onScrollToAnchor)throw new Error('Provide onScrollToAnchor for the parent scroll container');
    const request=++scrollRequest.current,version=current.current,rect=await readAnchor(id);
    if(!alive.current||version!==current.current||request!==scrollRequest.current)throw new Error('RichText anchor scroll interrupted');
    await callbacks.current.onScrollToAnchor({id,rect,offset,duration});
    if(!alive.current||version!==current.current||request!==scrollRequest.current)throw new Error('RichText anchor scroll interrupted');
  }}),[parsed,enableAnchor]);
  const anchor=(node:RichTextNode)=>node.anchor?{ref:(ref:NodesRef|null)=>{'background only';if(ref)anchors.current.set(node.anchor!,ref);else anchors.current.delete(node.anchor!);}}:{};
  const image=(node:RichTextNode,parent:CSSProperties,href?:string)=>{
    const src=node.src||'',index=node.imageIndex!,fixedHeight=node.style.height??node.attrs.height;
    const dimension=(v:string|number|undefined)=>v===undefined?undefined:/^\d+(\.\d+)?$/.test(String(v))?Number(v):v;
    return <view key={node.key} {...anchor(node)}><RichImage key={src} src={src} width={dimension(node.style.width??node.attrs.width)??'100%'} height={dimension(fixedHeight)} mode={fixedHeight?'aspectFill':'widthFix'} alt={node.attrs.alt} loading={<Placeholder key={loadingImage} src={loadingImage} text={localeText('common.loading')}/>} error={<Placeholder key={errorImage} src={errorImage} text={node.attrs.alt||'×'}/>} style={{minHeight:fixedHeight?undefined:'48px',...parent,...node.style}} onError={()=>{'background only';if(current.current===parsed&&alive.current)callbacks.current.onError?.({source:'image',src,index});}} onLoad={event=>{'background only';if(current.current===parsed&&alive.current)callbacks.current.onImageLoad?.({src,index,width:event.detail.width,height:event.detail.height});}} onClick={()=>{
      'background only';if(!alive.current||current.current!==parsed)return;
      if(href){callbacks.current.onLinkClick?.({href});return;}
      callbacks.current.onImageClick?.({src,index});
      if(previewImage&&node.previewSrc&&!node.previewSrc.startsWith('data:')){
        const eligible=parsed.images.filter(n=>n.previewSrc&&!n.previewSrc.startsWith('data:'));const position=eligible.indexOf(node);if(position>=0){setPreviewMounted(true);preview.previewImage({images:eligible.map(n=>n.previewSrc!),startPosition:position});}
      }
    }}/></view>;
  };
  const inline=(node:RichTextNode):ReactNode=>node.tag==='#text'?node.text:node.tag==='br'?'\n':<text key={node.key} {...anchor(node)} style={{...textDefaults[node.tag],...node.style}} bindtap={node.tag==='a'&&node.attrs.href?()=>{'background only';callbacks.current.onLinkClick?.({href:node.attrs.href!});}:undefined}>{node.children.map(inline)}</text>;
  const table=(node:RichTextNode,parent:CSSProperties)=>{
    const {grid,columns:count}=richTextTableGrid(node);
    const tableWidth=Math.max(0,(typeof node.style.width==='string'&&/^[\d.]+px$/.test(node.style.width)?parseFloat(node.style.width):width)-2);
    const definitions:RichTextNode[]=[];for(const child of node.children){if(child.tag==='col')definitions.push(child);else if(child.tag==='colgroup')for(const col of child.children)if(col.tag==='col')definitions.push(col);}
    const widths=Array.from({length:count},(_,i)=>{const value=definitions[i]?.style.width??definitions[i]?.attrs.width;return value&&String(value).endsWith('%')?tableWidth*parseFloat(String(value))/100:value?parseFloat(String(value)):tableWidth/count;});
    const data=grid.map((row,r)=>({r,...Object.fromEntries(row.map((cell,i)=>[String(i),cell]))}));
    return <view key={node.key} {...anchor(node)} className="ui-rich-text-table" style={{...node.style,width:'100%'}}><Table<Record<string,unknown>&{r:number}> data={data} columns={widths.map((w,i)=>({prop:String(i),width:w,render:({row}:{row:{r:number}})=>{const cell=grid[row.r]?.[i];return cell?<view {...anchor(cell.node)} className={`ui-rich-text-cell ${cell.node.tag==='th'?'ui-rich-text-th':''}`} style={{...parent,...cell.node.style}}>{flow(cell.node.children,{})}</view>:null;}}))} showHeader={false} stripe={false} cellPadding={0} rowHeight={38} spanMethod={({rowIndex,columnIndex})=>grid[rowIndex]?.[columnIndex]}/></view>;
  };
  const media=(node:RichTextNode)=>{
    const config=node.media!;
    const receive=({detail:event}:{detail:RichTextMediaSignal})=>{
      'background only';if(!alive.current||current.current!==parsed)return;
      const target=mediaRefs.current.get(node);if(!target)return;
      if(event.kind==='error'){if(event.fatal){target.failed=true;failedMedia.current.add(node);}callbacks.current.onError?.({source:config.type,src:event.src,message:event.message,code:event.code});return;}
      const value={id:config.id,type:config.type,src:event.src};
      if(event.kind==='play'){
        for(const [other,entry]of mediaRefs.current)if(other!==node&&parsed.media.includes(other))sendMedia(entry,'pauseMedia');
        callbacks.current.onMediaPlay?.(value);
      }else if(event.kind==='pause')callbacks.current.onMediaPause?.(value);
      else if(event.kind==='ended')callbacks.current.onMediaEnded?.(value);
      else if(event.kind==='timeupdate')callbacks.current.onMediaTimeUpdate?.({...value,currentTime:event.currentTime,duration:event.duration});
    };
    return <view key={node.key} {...anchor(node)} className="ui-rich-text-media"><daisu-rich-media className={`ui-rich-text-${config.type}`} style={{...node.style,width:node.style.width??node.attrs.width??'100%',height:node.style.height??(node.attrs.height?`${parseFloat(node.attrs.height)}px`:undefined)}} media-config={JSON.stringify({ ...config, locale: localeScope(locale, 'media.') })} ref={ref=>{'background only';if(ref)mediaRefs.current.set(node,{node:ref,failed:failedMedia.current.has(node)});else mediaRefs.current.delete(node);}} bindmediaevent={receive}/></view>;
  };
  const block=(node:RichTextNode,parent:CSSProperties,href?:string,adjustment:CSSProperties={}):ReactNode=>{
    if(node.media)return media(node);
    if(node.tag==='img')return image(node,parent,href);
    if(node.tag==='table')return table(node,parent);
    const authored={...textDefaults[node.tag],...node.style};
    const styles={...Object.fromEntries(Object.entries(authored).filter(([name])=>!(name in adjustment))),...adjustment} as CSSProperties,childStyle={};
    if(node.tag==='hr')return <view key={node.key} {...anchor(node)} className="ui-rich-text-hr" style={styles}/>;
    if(node.tag==='ul'||node.tag==='ol'){
      let index=parseInt(node.attrs.start||'1')||1;
      return <view key={node.key} {...anchor(node)} className="ui-rich-text-list" style={styles}>{node.children.map(child=>child.tag==='li'?<view key={child.key} {...anchor(child)} className={`ui-rich-text-li ${child.attrs['data-list']?'ui-rich-text-li-task':''}`} style={child.style}><text className="ui-rich-text-marker" style={childStyle}>{child.attrs['data-list']==='checked'?'☑\u00a0':child.attrs['data-list']==='unchecked'?'☐\u00a0':node.tag==='ol'?`${index++}.`:'•'}</text><view className="ui-rich-text-li-content">{flow(child.children,{})}</view></view>:block(child,childStyle))}</view>;
    }
    return <view key={node.key} {...anchor(node)} className={`ui-rich-text-block ui-rich-text-${node.tag}`} style={styles}>{flow(node.children,childStyle,node.tag==='a'?node.attrs.href||href:href)}</view>;
  };
  function flow(nodes:RichTextNode[],parent:CSSProperties={},href?:string):ReactNode[]{
    const output:ReactNode[]=[];let run:RichTextNode[]=[];let previousBottom=0;
    const flush=()=>{if(run.length){output.push(<text key={`text-${run[0]!.key}`} className="ui-rich-text-line" text-selection={selectable} bindtap={href?()=>{'background only';callbacks.current.onLinkClick?.({href});}:undefined}>{run.map(inline)}</text>);run=[];}};
    for(const node of nodes){const hasBlock=(n:RichTextNode):boolean=>!!n.media||n.tag==='img'||richBlockTags.has(n.tag)||n.children.some(hasBlock);
      if(hasBlock(node)){
        flush();const margin=margins({...textDefaults[node.tag],...node.style});
        // Native Lynx does not collapse adjacent block margins. Reproduce the
        // positive HTML paragraph spacing explicitly within rich content.
        const adjustment=margin.top>0&&previousBottom>0?{marginTop:`${Math.max(0,margin.top-previousBottom)}px`}:{};
        output.push(block(node,parent,href,adjustment));previousBottom=margin.bottom;
      }else run.push(node);
    }flush();return output;
  }
  return <view className={`ui-rich-text ${className}`} style={style} bindlayoutchange={e=>{'background only';if(e.detail.width>0)setWidth(old=>old===e.detail.width?old:e.detail.width);}}>{parsed.nodes.length?flow(parsed.nodes):fallback}{previewMounted?<ImagePreview {...preview.props} rootPortal/>:null}</view>;
});
