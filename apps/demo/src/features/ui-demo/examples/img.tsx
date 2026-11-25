import type { HostClient } from '../../../lib/host.js';
import { Img, Loading, Toast, useToast } from 'daisu-ui';
import type { ImgMode, ImgPreview } from 'daisu-ui';
import cat from '../../../assets/wot-black-cat.png';
import previewCat from '../../../assets/wot-black-cat-preview.png';
import { DemoGroup, ExampleBlock } from './shared.js';
const modes: ImgMode[] = ['top left','top right','bottom left','bottom right','right','left','center','bottom','top','heightFix','widthFix','scaleToFill','aspectFit','aspectFill'];
// No source keeps the native placeholder visible; malformed bitmap data exercises real load failure.
const failed = 'data:image/png;base64,aW52YWxpZA==';
export function ImgExample({ host }: { host?: HostClient | null }) {
  const toast = useToast();
  const preview: ImgPreview = async url => {
    'background only';
    if (!host || !await host.call('media.image.preview', { urls: [url], current: 0 })) throw new Error('宿主暂不支持图片预览');
  };
  return <view className="demo-img-page">
    <DemoGroup title="组件类型"><ExampleBlock title="基本使用"><Img width={100} height={100} src={cat}/></ExampleBlock></DemoGroup>
    <DemoGroup title="组件状态">
      <ExampleBlock title="加载中"><view className="demo-img-grid demo-img-grid-two">{[false,true].map(custom => <view key={String(custom)} className="demo-img-col"><Img width="100%" height="27vw" loading={custom ? <Loading style={{ alignSelf: 'center' }}/> : undefined}/><text className="demo-img-label">{custom ? '自定义提示' : '默认提示'}</text></view>)}</view></ExampleBlock>
      <ExampleBlock title="加载失败"><view className="demo-img-grid demo-img-grid-two">{[false,true].map(custom => <view key={String(custom)} className="demo-img-col"><Img width="100%" height="27vw" src={failed} error={custom ? <view className="demo-img-custom-error"><text>加载失败</text></view> : undefined}/><text className="demo-img-label">{custom ? '自定义提示' : '默认提示'}</text></view>)}</view></ExampleBlock>
    </DemoGroup>
    <DemoGroup title="组件样式">{['填充','圆形','圆角'].map((title,index) => <ExampleBlock key={title} title={title}><view className="demo-img-grid">{modes.map(mode => <view className="demo-img-col" key={mode}><Img src={cat} width="100%" height="27vw" mode={mode} round={index === 1} radius={index === 2 ? 5 : undefined}/><text className="demo-img-label">{mode}</text></view>)}</view></ExampleBlock>)}</DemoGroup>
    <DemoGroup title="特殊用法"><ExampleBlock title="可预览"><view className="demo-img-grid demo-img-grid-two">{[false,true].map(custom => <view className="demo-img-col" key={String(custom)}><Img width="100%" mode="widthFix" src={cat} previewSrc={custom ? previewCat : undefined} enablePreview onPreview={preview} onPreviewError={error => { 'background only'; toast.error(error.message); }}/><text className="demo-img-label">{custom ? '指定预览图' : '默认预览图'}</text></view>)}</view></ExampleBlock></DemoGroup>
    <Toast {...toast.props}/>
  </view>;
}
