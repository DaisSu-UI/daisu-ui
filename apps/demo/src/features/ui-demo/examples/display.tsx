import { Button, Empty, Icon, Toast, useToast } from '@daisu-ui/ui';
import cat from '../../../assets/demo-cat.png';
import { DemoGroup, ExampleBlock } from './shared.js';
const cases = [
  {title:'搜索无结果',icon:'no-result',tip:'当前搜索无结果'},
  {title:'404页面',icon:'no-wifi',tip:'当前网络不可用，请检查你的网络设置'},
  {title:'页面暂无内容',icon:'no-content',tip:'暂无内容'},
  {title:'我的收藏为空',icon:'no-collection',tip:'暂无收藏'},
  {title:'我的评论为空',icon:'no-comment',tip:'暂无评论'},
  {title:'支付失败',icon:'failpayment',tip:'支付失败，请重新订购'},
  {title:'已订阅全部消息',icon:'no-message',tip:'已订阅全部消息'},
];
export function EmptyExample() {
  const toast=useToast();
  return <view className="demo-empty-page">
    <DemoGroup title="内容形态">{cases.map(item=><ExampleBlock key={item.icon} title={item.title}><Empty icon={item.icon} tip={item.tip}/></ExampleBlock>)}</DemoGroup>
    <DemoGroup title="组件样式"><ExampleBlock title="自定义大小"><Empty icon="no-result" iconSize={140} tip="当前搜索无结果"/></ExampleBlock></DemoGroup>
    <DemoGroup title="特殊样式">
      <ExampleBlock title="自定义图片"><Empty icon={cat} tip="查看我的头像"/></ExampleBlock>
      <ExampleBlock title="插槽自定义图片内容"><Empty image={<Icon name="sun-fill" size={100}/>} tip="插槽自定义图片内容"/></ExampleBlock>
      <ExampleBlock title="底部插槽"><Empty icon="no-content" tip="当前搜索无结果" bottom={<view className="demo-empty-bottom"><Button tone="info" label="重新加载" onTap={()=>{ 'background only'; toast.info('已发起重新加载'); }}/></view>}/></ExampleBlock>
    </DemoGroup>
    <Toast {...toast.props}/>
  </view>;
}
