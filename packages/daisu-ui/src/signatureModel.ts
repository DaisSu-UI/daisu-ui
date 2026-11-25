import { zlibSync } from 'fflate';
export type SignaturePoint = { x: number; y: number; time: number; width: number };
export type SignatureStroke = { color: string; points: SignaturePoint[] };
export type SignatureResult = { success: boolean; dataUrl: string; width: number; height: number; error?: string };
export const signatureNumber = (value: number, fallback: number, min = 0) => Number.isFinite(value) ? Math.max(min,value) : fallback;
export function signatureWidth(speed: number, previous: number, min: number, max: number, threshold: number) {
  const low=signatureNumber(min,2,.1),high=Math.max(low,signatureNumber(max,6,.1)),limit=signatureNumber(threshold,1.5,.01);
  const target=Math.max(low,high-(high-low)*Math.max(0,speed-limit)/limit);
  return Math.max(low,Math.min(high,Math.max(previous*.8,Math.min(previous*1.2,target))));
}
export function signatureColor(value: string): [number,number,number,number] {
  const names: Record<string,string>={black:'#000000',white:'#ffffff',red:'#ff0000',blue:'#0000ff',green:'#008000',transparent:'#00000000'};
  const input=names[value.toLowerCase()]??value;
  const hex=/^#([0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})$/i.exec(input);
  if(hex){let h=hex[1]!;if(h.length<5)h=[...h].map(c=>c+c).join('');return [parseInt(h.slice(0,2),16),parseInt(h.slice(2,4),16),parseInt(h.slice(4,6),16),h.length===8?parseInt(h.slice(6),16):255];}
  const rgb=/^rgba?\(\s*(\d+(?:\.\d+)?)\s*,\s*(\d+(?:\.\d+)?)\s*,\s*(\d+(?:\.\d+)?)(?:\s*,\s*(\d*\.?\d+))?\s*\)$/i.exec(input);
  if(rgb)return [1,2,3].map(i=>Math.round(Math.min(255,Number(rgb[i])))).concat(Math.round(Math.min(1,Number(rgb[4]??1))*255)) as [number,number,number,number];
  throw new Error('PNG 导出颜色请使用十六进制、rgb/rgba、black/white/red/blue/green/transparent');
}
export function signatureSvg(strokes: readonly SignatureStroke[], width: number, height: number, background = 'transparent') {
  const fmt=(n:number)=>Number(n.toFixed(2));
  const color=(value:string)=>value.replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}"><rect width="100%" height="100%" fill="${color(background)}"/>${strokes.map(stroke=>`<g fill="${color(stroke.color)}">${stroke.points.map((p,i)=>{const prev=stroke.points[i-1];if(!prev)return `<circle cx="${fmt(p.x)}" cy="${fmt(p.y)}" r="${fmt(p.width/2)}"/>`;const dx=p.x-prev.x,dy=p.y-prev.y,len=Math.hypot(dx,dy);if(!len)return '';const nx=-dy/len,ny=dx/len;return `<polygon points="${fmt(prev.x+nx*prev.width/2)},${fmt(prev.y+ny*prev.width/2)} ${fmt(p.x+nx*p.width/2)},${fmt(p.y+ny*p.width/2)} ${fmt(p.x-nx*p.width/2)},${fmt(p.y-ny*p.width/2)} ${fmt(prev.x-nx*prev.width/2)},${fmt(prev.y-ny*prev.width/2)}"/><circle cx="${fmt(p.x)}" cy="${fmt(p.y)}" r="${fmt(p.width/2)}"/>`;}).join('')}</g>`).join('')}</svg>`;
}
function crc32(bytes: Uint8Array){let crc=0xffffffff;for(const byte of bytes){crc^=byte;for(let bit=0;bit<8;bit++)crc=crc&1?0xedb88320^(crc>>>1):crc>>>1;}return (crc^0xffffffff)>>>0;}
function u32(value:number){return [value>>>24,(value>>>16)&255,(value>>>8)&255,value&255];}
function chunk(name:string,data:Uint8Array){const body=new Uint8Array(4+data.length);body.set([...name].map(c=>c.charCodeAt(0)));body.set(data,4);return new Uint8Array([...u32(data.length),...body,...u32(crc32(body))]);}
function base64(data:Uint8Array){const alphabet='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';let result='';for(let i=0;i<data.length;i+=3){const n=(data[i]!<<16)|((data[i+1]??0)<<8)|(data[i+2]??0);result+=alphabet[(n>>>18)&63]!+alphabet[(n>>>12)&63]!+(i+1<data.length?alphabet[(n>>>6)&63]:'=')+(i+2<data.length?alphabet[n&63]:'=');}return result;}
/** Portable PNG export from the same vector samples; no Canvas, DOM, Buffer or native file path. */
export function signaturePng(strokes:readonly SignatureStroke[],width:number,height:number,scale=1,background='transparent'):SignatureResult{
  const w=Math.round(width*scale),h=Math.round(height*scale);
  if(!Number.isFinite(scale)||scale<=0||w<1||h<1||w>4096||h>4096||w*h>4_000_000)throw new Error('导出尺寸须在 4096px/边、400万像素以内');
  const bg=signatureColor(background),pixels=new Uint8Array(w*h*4);
  for(let i=0;i<pixels.length;i+=4)pixels.set(bg,i);
  for(const stroke of strokes){const ink=signatureColor(stroke.color),coverage=new Uint8Array(w*h);
    stroke.points.forEach((p,index)=>{const prev=stroke.points[index-1]??p,x1=prev.x*scale,y1=prev.y*scale,x2=p.x*scale,y2=p.y*scale,r1=prev.width*scale/2,r2=p.width*scale/2,r=Math.max(r1,r2)+1,dx=x2-x1,dy=y2-y1,length2=dx*dx+dy*dy;
      for(let y=Math.max(0,Math.floor(Math.min(y1,y2)-r));y<Math.min(h,Math.ceil(Math.max(y1,y2)+r));y++)for(let x=Math.max(0,Math.floor(Math.min(x1,x2)-r));x<Math.min(w,Math.ceil(Math.max(x1,x2)+r));x++){
        const t=length2?Math.max(0,Math.min(1,((x+.5-x1)*dx+(y+.5-y1)*dy)/length2)):0;
        const distance=Math.hypot(x+.5-(x1+t*dx),y+.5-(y1+t*dy)),alpha=Math.round(Math.max(0,Math.min(1,r1+(r2-r1)*t+.5-distance))*255),at=y*w+x;
        coverage[at]=Math.max(coverage[at]!,alpha);
      }
    });
    for(let at=0;at<coverage.length;at++){if(!coverage[at])continue;const i=at*4,sa=ink[3]/255*coverage[at]!/255,da=pixels[i+3]!/255,alpha=sa+da*(1-sa);for(let c=0;c<3;c++)pixels[i+c]=Math.round((ink[c]!*sa+pixels[i+c]!*da*(1-sa))/alpha);pixels[i+3]=Math.round(alpha*255);}
  }
  const raw=new Uint8Array(h*(w*4+1));for(let y=0;y<h;y++)raw.set(pixels.subarray(y*w*4,(y+1)*w*4),y*(w*4+1)+1);
  const parts=[new Uint8Array([137,80,78,71,13,10,26,10]),chunk('IHDR',new Uint8Array([...u32(w),...u32(h),8,6,0,0,0])),chunk('IDAT',zlibSync(raw)),chunk('IEND',new Uint8Array())];
  const png=new Uint8Array(parts.reduce((n,p)=>n+p.length,0));let offset=0;for(const part of parts){png.set(part,offset);offset+=part.length;}
  return {success:true,dataUrl:`data:image/png;base64,${base64(png)}`,width:w,height:h};
}
