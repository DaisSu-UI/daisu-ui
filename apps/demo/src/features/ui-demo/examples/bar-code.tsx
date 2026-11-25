import { useRef, useState } from '@lynx-js/react';
import { BarCode, Button, Icon } from 'daisu-ui';
import type { BarCodeFormat, BarCodeProps, BarCodeRef } from 'daisu-ui';
import { DemoGroup, ExampleBlock } from './shared.js';
const formats: {label: BarCodeFormat; value: string}[] = [
 {label:'CODE128',value:'CODE128'},{label:'CODE128A',value:'CODE128A'},{label:'CODE128B',value:'CODE128B'},{label:'CODE128C',value:'123456'},
 {label:'EAN13',value:'690123456789'},{label:'EAN8',value:'1234567'},{label:'UPC',value:'12345678901'},{label:'UPCE',value:'123456'},
 {label:'CODE39',value:'CODE39'},{label:'ITF14',value:'1234567890123'},{label:'MSI',value:'123456'},{label:'MSI10',value:'123456'},
 {label:'MSI11',value:'123456'},{label:'MSI1010',value:'123456'},{label:'MSI1110',value:'123456'},{label:'pharmacode',value:'1234'},{label:'codabar',value:'A123456A'},
];
function Item({label,...props}:BarCodeProps&{label?:string}) { return <view className="demo-bar-code-item">{label?<text className="demo-bar-code-label">{label}</text>:null}<BarCode value="1234567890" {...props}/></view>; }
export function BarCodeExample(){
 const ref=useRef<BarCodeRef>(null),[exported,setExported]=useState(''),[error,setError]=useState('');
 const exportImage=async()=>{ 'background only';try{const url=await ref.current!.exportImage();setExported(decodeURIComponent(url.slice(url.indexOf(',')+1)));setError('');}catch(e){setError(e instanceof Error?e.message:String(e));} };
 return <view className="demo-bar-code-page"><DemoGroup title="组件类型">
  <ExampleBlock title="基本用法"><Item/></ExampleBlock>
  <ExampleBlock title="常见格式">{[formats[4]!,formats[8]!,formats[9]!].map(item=><Item key={item.label} label={item.label} value={item.value} format={item.label}/>)}</ExampleBlock>
  <ExampleBlock title="导出图片"><view className="demo-bar-code-item"><BarCode ref={ref} value="1234567890"/><Button className="demo-bar-code-export" size="small" icon={<Icon name="download" size={14}/>} label="导出图片" onTap={exportImage}/>{exported?<svg className="demo-bar-code-export-image" content={exported} style={{width:'200px',height:'100px'}}/>:null}{error?<text>{error}</text>:null}</view></ExampleBlock>
 </DemoGroup><DemoGroup title="组件变体">
  <ExampleBlock title="文字位置"><Item label="文字在上方" textPosition="top"/><Item label="文字在下方" textPosition="bottom"/></ExampleBlock>
  <ExampleBlock title="文字间距"><Item textMargin={10}/></ExampleBlock>
  <ExampleBlock title="隐藏文字"><Item displayValue={false}/></ExampleBlock>
 </DemoGroup><DemoGroup title="组件样式">
  <ExampleBlock title="自定义颜色"><Item lineColor="#4D80F0" background="#E0EAFF"/></ExampleBlock>
  <ExampleBlock title="自定义尺寸"><Item width={260} height={80}/><Item label="长条紧凑尺寸" width={320} height={50}/><Item label="更高的条码" height={140}/><Item label="紧凑尺寸" height={60} displayValue={false}/></ExampleBlock>
  <ExampleBlock title="数字大小"><Item label="font-size: 14" fontSize={14}/><Item label="font-size: 24" fontSize={24}/></ExampleBlock>
  <ExampleBlock title="字体样式"><Item label="bold italic" fontOptions="bold italic"/><Item label="font-size: 18 + bold" fontSize={18} fontOptions="bold"/></ExampleBlock>
 </DemoGroup><DemoGroup title="特殊样式">
  <ExampleBlock title="支持格式">{formats.map(item=><Item key={item.label} label={item.label} value={item.value} format={item.label}/>)}</ExampleBlock>
  <ExampleBlock title="特殊格式尺寸">{[{...formats[5]!,width:240,height:140},{...formats[6]!,width:280,height:150},{...formats[7]!,width:220,height:130}].map(item=><Item key={item.label} label={item.label} value={item.value} format={item.label} width={item.width} height={item.height}/>)}</ExampleBlock>
 </DemoGroup></view>;
}
