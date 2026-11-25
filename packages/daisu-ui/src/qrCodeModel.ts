import qrcode from 'qrcode-generator';

export type QrCodeOptions = {
  text?: string; size?: number; correctLevel?: 'L' | 'M' | 'Q' | 'H'; colorDark?: string; colorLight?: string; margin?: number;
  logo?: string; logoWidth?: number; logoHeight?: number; logoBackgroundColor?: string; logoRadius?: number; logoBorderColor?: string; logoBorderWidth?: number;
  dotType?: 'square' | 'dots' | 'rounded' | 'liquid'; dotScale?: number; enableGradient?: boolean; gradientColor?: string; gradientColors?: string[];
  gradientDirection?: 'diagonal' | 'horizontal' | 'vertical' | number; backgroundImage?: string;
};
export const qrEscape = (s: string) => s.replace(/[<>&"']/g, c => ({'<':'&lt;','>':'&gt;','&':'&amp;','"':'&quot;',"'":'&apos;'})[c]!);
export function qrCodeMatrix(text: string, level: QrCodeOptions['correctLevel'] = 'H') {
  if (!text) return [];
  if (!['L','M','Q','H'].includes(level)) throw new Error('Invalid QR correction level');
  if (text.length > 2953) throw new Error('QR content exceeds capacity');
  // The encoder's Byte mode consumes bytes, not UTF-16 code units. Keep its
  // shared factory untouched so other consumers cannot change our encoding.
  const bytes = encodeURIComponent(text).replace(/%([0-9A-F]{2})/g, (_, hex: string) => String.fromCharCode(parseInt(hex, 16)));
  const qr = qrcode(0, level); qr.addData(bytes, 'Byte'); qr.make();
  return Array.from({length:qr.getModuleCount()}, (_,row) => Array.from({length:qr.getModuleCount()}, (_,col) => qr.isDark(row,col)));
}
export function qrCodeLayout(matrix: boolean[][], options: QrCodeOptions) {
  const o = {size:200,margin:0,colorDark:'#000000',colorLight:'#FFFFFF',dotType:'square',dotScale:1,gradientColor:'#000000',gradientDirection:'diagonal',logoWidth:70,logoHeight:70,logoRadius:0,logoBorderWidth:0,logoBackgroundColor:'#FFFFFF',...Object.fromEntries(Object.entries(options).filter(([,v])=>v!==undefined))} as Required<QrCodeOptions>;
  for (const name of ['size','margin','dotScale','logoWidth','logoHeight','logoRadius','logoBorderWidth'] as const) if (!Number.isFinite(o[name]) || o[name] < 0) throw new Error(`Invalid QR ${name}`);
  if (o.size <= 0 || o.size > 4096 || o.margin * 2 >= o.size || o.dotScale <= 0 || o.dotScale > 1) throw new Error('Invalid QR bounds');
  if (!['square','dots','rounded','liquid'].includes(o.dotType)) throw new Error('Invalid QR dot type');
  for (const src of [o.logo,o.backgroundImage]) if(src && /[\u0000-\u0020]|^(?!https?:|data:image\/(?:png|jpeg|gif|webp);base64,)[a-z][a-z0-9+.-]*:/i.test(src)) throw new Error('Invalid QR image URL');
  const size=matrix.length, step=(o.size-2*o.margin)/size, shapes:string[]=[];
  const dark=(r:number,c:number)=>!!matrix[r]?.[c];
  for(let r=0;r<size;r++) for(let c=0;c<size;c++) if(dark(r,c)) {
    const left=Math.ceil(c*step)+o.margin,top=Math.ceil(r*step)+o.margin,w=Math.ceil((c+1)*step)-Math.ceil(c*step),h=Math.ceil((r+1)*step)-Math.ceil(r*step);
    const sw=w*o.dotScale,sh=h*o.dotScale,x=left+(w-sw)/2,y=top+(h-sh)/2;
    if(o.dotType==='dots') shapes.push(`<circle cx="${x+sw/2}" cy="${y+sh/2}" r="${sw/2}"/>`);
    else if(o.dotType==='liquid') {
      const radius=sw/2,tl=dark(r-1,c)||dark(r,c-1)?0:radius,tr=dark(r-1,c)||dark(r,c+1)?0:radius,br=dark(r+1,c)||dark(r,c+1)?0:radius,bl=dark(r+1,c)||dark(r,c-1)?0:radius;
      shapes.push(`<path d="M${x+tl} ${y}H${x+sw-tr}Q${x+sw} ${y} ${x+sw} ${y+tr}V${y+sh-br}Q${x+sw} ${y+sh} ${x+sw-br} ${y+sh}H${x+bl}Q${x} ${y+sh} ${x} ${y+sh-bl}V${y+tl}Q${x} ${y} ${x+tl} ${y}Z"/>`);
    } else shapes.push(`<rect x="${x}" y="${y}" width="${sw}" height="${sh}" rx="${o.dotType==='rounded'?sw*.25:0}"/>`);
  }
  let defs='',fill=qrEscape(o.colorDark);
  if(o.enableGradient) {
    const angle=typeof o.gradientDirection==='number'?o.gradientDirection:o.gradientDirection==='horizontal'?0:o.gradientDirection==='vertical'?90:45;
    if(!Number.isFinite(angle)) throw new Error('Invalid QR gradient angle');
    const radians=angle*Math.PI/180,extent=(Math.abs(Math.cos(radians))+Math.abs(Math.sin(radians)))*o.size/2,cx=o.size/2;
    const colors=o.gradientColors?.length?o.gradientColors:[o.colorDark,o.gradientColor];
    defs=`<defs><linearGradient id="qr-gradient" gradientUnits="userSpaceOnUse" x1="${cx-Math.cos(radians)*extent}" y1="${cx-Math.sin(radians)*extent}" x2="${cx+Math.cos(radians)*extent}" y2="${cx+Math.sin(radians)*extent}">${colors.map((color,i)=>`<stop offset="${i/Math.max(1,colors.length-1)}" stop-color="${qrEscape(color)}"/>`).join('')}</linearGradient></defs>`; fill='url(#qr-gradient)';
  }
  const open=`<svg xmlns="http://www.w3.org/2000/svg" width="${o.size}" height="${o.size}" viewBox="0 0 ${o.size} ${o.size}">`,bg=`<rect width="100%" height="100%" fill="${qrEscape(o.colorLight)}"/>`;
  const body=`${defs}<g fill="${fill}">${shapes.join('')}</g>`,logo={x:(o.size-o.logoWidth)/2,y:(o.size-o.logoHeight)/2,width:o.logoWidth,height:o.logoHeight,radius:Math.max(0,o.logoRadius-4)};
  const logoSvg=o.logo&&matrix.length?`<defs><clipPath id="qr-logo-clip"><rect x="${logo.x}" y="${logo.y}" width="${logo.width}" height="${logo.height}" rx="${logo.radius}"/></clipPath></defs><rect x="${logo.x-4}" y="${logo.y-4}" width="${logo.width+8}" height="${logo.height+8}" rx="${o.logoRadius}" fill="${qrEscape(o.logoBackgroundColor)}" stroke="${qrEscape(o.logoBorderColor||'transparent')}" stroke-width="${o.logoBorderWidth}"/><image href="${qrEscape(o.logo)}" x="${logo.x}" y="${logo.y}" width="${logo.width}" height="${logo.height}" preserveAspectRatio="none" clip-path="url(#qr-logo-clip)"/>`:'';
  const backdrop=o.backgroundImage&&matrix.length?`<image href="${qrEscape(o.backgroundImage)}" width="${o.size}" height="${o.size}" preserveAspectRatio="none"/>`:'';
  return {svg:open+bg+backdrop+body+logoSvg+'</svg>',codeSvg:open+body+'</svg>',logo,options:o};
}
