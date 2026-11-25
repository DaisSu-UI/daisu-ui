import { Parser } from 'htmlparser2';
import type { CSSProperties } from '@lynx-js/types';
import type { RichTextMediaConfig } from './richTextMedia.js';

export type RichTextHeading = { id: string; level: number; text: string };
export type RichTextNode = { key: number; tag: string; text?: string; attrs: Record<string,string>; style: CSSProperties; children: RichTextNode[]; anchor?: string; imageIndex?: number; src?: string; previewSrc?: string; media?: RichTextMediaConfig };
export type RichTextParseOptions = { enableMedia?: boolean; baseUrl?: string; allowDataImage?: boolean; enableAnchor?: boolean; tagStyle?: Record<string,string>; classStyles?: Record<string,string> };
export class RichTextParseError extends Error { constructor(public code:string,message:string){super(message);} }
const blockTags = new Set('div p h1 h2 h3 h4 h5 h6 blockquote pre ul ol li table tr td th figure figcaption section article header footer dl dt dd hr'.split(' '));
const allowed = new Set([...blockTags,...'span a img br strong b em i u s del mark small sub sup code thead tbody tfoot colgroup col caption audio video source'.split(' ')]);
const ignored = new Set('script style iframe object embed svg math template noscript'.split(' '));
const styleNames = new Set('color background-color font-size font-family font-weight font-style line-height letter-spacing text-align text-decoration text-indent white-space word-break vertical-align width height min-width max-width min-height max-height margin margin-top margin-bottom margin-left margin-right padding padding-top padding-bottom padding-left padding-right border border-width border-style border-color border-radius border-top border-bottom border-left border-right border-top-width border-bottom-width border-left-width border-right-width border-top-color border-bottom-color border-left-color border-right-color border-top-style border-bottom-style border-left-style border-right-style display'.split(' '));
export function richTextStyle(value:string):CSSProperties {
  const result:Record<string,string>={};
  for(const declaration of value.split(';')) {
    const colon=declaration.indexOf(':');if(colon<0)continue;
    const name=declaration.slice(0,colon).trim().toLowerCase(),value=declaration.slice(colon+1).trim();
    if(!styleNames.has(name)||!value||/url\s*\(|expression|[<>\\@]|!important/i.test(value))continue;
    if(name==='display'&&value!=='none')continue;
    result[name.replace(/-([a-z])/g,(_,c:string)=>c.toUpperCase())]=value;
  }
  return result as CSSProperties;
}
export function richTextUrl(input:string,options:RichTextParseOptions={},link=false):string {
  const src=input.trim();if(!src||/[\u0000-\u0020\u007f\\]/.test(src))return '';
  if(/^data:/i.test(src))return !link&&options.allowDataImage&&src.length<=65536&&/^data:image\/(png|jpeg|gif|webp);base64,[a-z0-9+/=]+$/i.test(src)?src:'';
  if(/^https?:\/\/[^/?#]*@/i.test(src))return '';
  if(/^[a-z][a-z0-9+.-]*:/i.test(src))return /^(https?:\/\/[^/@]+|mailto:|tel:)/i.test(src)&&(!/^(mailto|tel):/i.test(src)||link)?src:'';
  if(src.startsWith('//'))return richTextUrl('https:'+src,options,link);
  if(link||!options.baseUrl)return src;
  const match=/^(https?:\/\/[^/?#@]+)(\/[^?#]*)?(?:[?#].*)?$/i.exec(options.baseUrl);if(!match)return '';
  const path=src.startsWith('/')?src:(match[2]||'/').replace(/[^/]*$/,'')+src;
  const segments:string[]=[];for(const part of path.split('/')){if(part==='..')segments.pop();else if(part!=='.')segments.push(part);}
  return match[1]+segments.join('/');
}
export function richTextPlain(nodes:readonly RichTextNode[]):string {
  return nodes.map(n=>n.tag==='#text'?n.text:n.tag==='br'?'\n':n.tag==='img'?n.attrs.alt||'':n.media?n.media.title+'\n':richTextPlain(n.children)+(blockTags.has(n.tag)?'\n':'')).join('');
}
export function parseRichText(content:string,options:RichTextParseOptions={}) {
  if(content.length>200000)throw new RichTextParseError('CONTENT_LIMIT','RichText content exceeds 200000 characters');
  const nodes:RichTextNode[]=[],stack:RichTextNode[]=[],headings:RichTextHeading[]=[],images:RichTextNode[]=[];
  const ids=new Set<string>();let count=0,depth=0,skip=0;
  const add=(node:RichTextNode)=>{if(++count>10000)throw new RichTextParseError('NODE_LIMIT','RichText exceeds 10000 nodes');(stack[stack.length-1]?.children??nodes).push(node);};
  const parser=new Parser({
    onopentag(tag,attrs){
      if(++depth>128)throw new RichTextParseError('DEPTH_LIMIT','RichText exceeds 128 levels');
      if(skip||ignored.has(tag)||(!options.enableMedia&&['audio','video','source'].includes(tag))||(tag==='source'&&!['audio','video'].includes(stack[stack.length-1]?.tag||''))){skip++;return;}
      const node:RichTextNode={key:count,tag:allowed.has(tag)?tag:'div',attrs:{},style:{},children:[]};
      for(const name of ['id','class','alt','title','width','height','colspan','rowspan','span','start','data-list','data-preview'])if(attrs[name]!==undefined)node.attrs[name]=attrs[name]!;
      const classes=(attrs.class||'').split(/\s+/);
      const quill:Record<string,string>={'ql-align-center':'text-align:center','ql-align-right':'text-align:right','ql-align-justify':'text-align:justify','ql-size-small':'font-size:10px','ql-size-large':'font-size:21px','ql-size-huge':'font-size:35px','ql-font-serif':'font-family:serif','ql-font-monospace':'font-family:monospace'};
      const mapped=classes.map(c=>options.classStyles?.[c]??quill[c]??(/^ql-indent-[1-8]$/.test(c)?`padding-left:${Number(c.slice(-1))*3}em`:'')).join(';');
      node.style=richTextStyle([options.tagStyle?.[tag]||'',mapped,attrs.style||''].join(';'));
      if(tag==='a')node.attrs.href=richTextUrl(attrs.href||'',options,true);
      if(tag==='img'){
        node.src=richTextUrl(attrs.src||'',options);node.previewSrc=attrs['data-preview']==='false'?'':richTextUrl(attrs['original-src']||'',options)||node.src;
        node.imageIndex=images.length;images.push(node);
      }
      if(tag==='audio'||tag==='video')node.media={id:attrs.id||'',type:tag,sources:[],title:attrs.title||'',poster:richTextUrl(attrs.poster||'',{...options,allowDataImage:false}),loop:attrs.loop!==undefined&&attrs.loop!=='false',muted:attrs.muted!==undefined&&attrs.muted!=='false'};
      if(tag==='audio'||tag==='video'||tag==='source')node.src=richTextUrl(attrs.src||'',{...options,allowDataImage:false});
      if(options.enableAnchor){
        const wanted=attrs.id?.trim();
        if(wanted&&!ids.has(wanted)){node.anchor=wanted;ids.add(wanted);}
        if(/^h[1-6]$/.test(tag)&&!node.anchor){let generated=`heading-${count}`;while(ids.has(generated))generated+='-';node.anchor=generated;ids.add(generated);}
      }
      add(node);stack.push(node);
    },
    ontext(text){if(skip)return;const pre=stack.some(n=>n.tag==='pre');const value=pre?text:text.replace(/[ \t\r\n\f]+/g,' ');if(value)add({key:count,tag:'#text',text:value,attrs:{},style:{},children:[]});},
    onclosetag(){depth--;if(skip){skip--;return;}const node=stack.pop();
      if(node?.media){const candidates=[node.src,...node.children.filter(c=>c.tag==='source').map(c=>c.src)].filter((src):src is string=>!!src);node.media.sources=[...new Set(candidates)];if(node.media.sources.length>16)throw new RichTextParseError('MEDIA_SOURCE_LIMIT','RichText media exceeds 16 sources');node.children=[];}
      if(node?.anchor&&/^h[1-6]$/.test(node.tag))headings.push({id:node.anchor,level:Number(node.tag[1]),text:richTextPlain(node.children).trim()});},
  },{decodeEntities:true});
  parser.end(content);
  const prune=(items:RichTextNode[])=>items.filter(n=>{n.children=prune(n.children);return n.style.display!=='none'&&(n.tag==='#text'?!!n.text:n.media||n.tag==='source'||n.tag==='img'||n.tag==='br'||n.tag==='hr'||n.tag==='col'||n.tag==='p'||n.children.length>0);});
  let filtered=prune(nodes);
  const hasVisual=(n:RichTextNode):boolean=>!!n.media||n.tag==='img'||n.tag==='hr'||n.children.some(hasVisual);
  if(!richTextPlain(filtered).trim()&&!filtered.some(hasVisual))filtered=[];
  const visibleAnchors=new Set<string>();const walk=(items:RichTextNode[])=>{for(const n of items){if(n.anchor)visibleAnchors.add(n.anchor);if(n.tag==='table')richTextTableGrid(n);walk(n.children);}};walk(filtered);
  if(JSON.stringify(filtered).length>2000000)throw new RichTextParseError('OUTPUT_LIMIT','RichText rendered data exceeds limit');
  const media:RichTextNode[]=[];
  const visibleImages:RichTextNode[]=[];const collectImages=(items:RichTextNode[])=>{for(const node of items){if(node.media)media.push(node);if(node.tag==='img'){node.imageIndex=visibleImages.length;visibleImages.push(node);}collectImages(node.children);}};collectImages(filtered);
  return {nodes:filtered,images:visibleImages,media,headings:headings.filter(h=>visibleAnchors.has(h.id)),text:richTextPlain(filtered).trim()};
}
export const richBlockTags=blockTags;

export type RichTextTableCell={node:RichTextNode;rowspan:number;colspan:number};
export function richTextTableGrid(table:RichTextNode){
  const rows:RichTextNode[][]=[];
  const collect=(node:RichTextNode)=>{if(node.tag==='tr')rows.push(node.children.filter(c=>c.tag==='td'||c.tag==='th'));else for(const child of node.children)if(child.tag!=='table')collect(child);};collect(table);
  const grid:RichTextTableCell[][]=[];let columns=0,slots=0;
  rows.forEach((cells,r)=>{grid[r]??=[];let column=0;
    for(const node of cells){
      const rowspan=Math.max(1,Math.min(99,rows.length-r,parseInt(node.attrs.rowspan||'1')||1)),colspan=Math.max(1,Math.min(99,parseInt(node.attrs.colspan||'1')||1));
      while(Array.from({length:colspan},(_,i)=>grid[r]![column+i]).some(Boolean))column++;
      if(column+colspan>100||slots+rowspan*colspan>10000)throw new RichTextParseError('TABLE_LIMIT','RichText table exceeds 100 columns or 10000 layout cells');
      for(let y=r;y<r+rowspan;y++){grid[y]??=[];for(let x=column;x<column+colspan;x++)grid[y]![x]={node,rowspan:y===r&&x===column?rowspan:0,colspan:y===r&&x===column?colspan:0};}
      slots+=rowspan*colspan;column+=colspan;columns=Math.max(columns,column);
    }
  });
  return{grid,columns};
}
