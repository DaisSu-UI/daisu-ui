import { useEffect, useState } from '@lynx-js/react';
import { Button } from '@daisu-ui/ui';
import { useRoute, useRouterSnapshot } from '@daisu-ui/ui/router';
import type { AppRoute } from '../../../app/router.js';
import { useAppRouter } from '../../../app/router.js';
import { DemoGroup, ExampleBlock } from './shared.js';

export function RouterExample() {
  const router = useAppRouter();
  const route = useRoute<AppRoute>();
  const snapshot = useRouterSnapshot(router);
  const [blockBack, setBlockBack] = useState(false);
  const [notice, setNotice] = useState('');
  useEffect(() => router.beforeEach(navigation => {
    'background only';
    if (navigation.from === route && blockBack && (navigation.action === 'back' || navigation.source === 'history')) {
      setNotice('已阻止返回，请先关闭导航守卫');
      return false;
    }
  }), [router, route, blockBack]);
  return <view>
    <DemoGroup title="当前路由">
      <ExampleBlock title="页面与页面栈">
        <text className="catalog-card-copy">{router.href(route)}</text>
        <text className="catalog-card-copy">{`页面栈：${snapshot.entries.length} 页`}</text>
        {snapshot.entries.slice(-5).map((entry, index) => <text key={entry.key} className="catalog-card-copy">
          {`${Math.max(0, snapshot.entries.length - 5) + index + 1}. ${router.href(entry.route)}${entry.route === route ? '（本页面）' : ''}`}
        </text>)}
        <text className="catalog-card-copy">TanStack Router 管理路由匹配与导航；H5 地址同步，刷新恢复当前页面。</text>
      </ExampleBlock>
    </DemoGroup>
    <DemoGroup title="导航方法">
      <ExampleBlock title="push：打开组件页">
        <Button label="打开 Button 示例" onTap={() => { 'background only'; void router.navigate({ to: '/ui-demo/$page', params: { page: 'button' } }); }} />
      </ExampleBlock>
      <ExampleBlock title="push：保留当前页状态">
        <Button label="再打开一个 Router 示例" onTap={() => { 'background only'; void router.navigate({ to: '/ui-demo/$page', params: { page: 'router' } }); }} />
      </ExampleBlock>
      <ExampleBlock title="replace：替换当前页" description="只替换栈顶，下层已有的 Router 页面仍然可以返回。">
        <Button label="替换为 Cell 示例" onTap={() => { 'background only'; void router.navigate({ to: '/ui-demo/$page', params: { page: 'cell' }, replace: true }); }} />
      </ExampleBlock>
      <ExampleBlock title="back：返回上一页">
        <Button label="返回上一页" onTap={() => { 'background only'; void router.back(); }} />
      </ExampleBlock>
    </DemoGroup>
    <DemoGroup title="导航守卫">
      <ExampleBlock title="同时拦截按钮返回与浏览器后退">
        <Button label={blockBack ? '关闭返回拦截' : '开启返回拦截'} onTap={() => { 'background only'; setBlockBack(value => !value); setNotice(''); }} />
        {notice ? <text className="catalog-card-copy">{notice}</text> : null}
      </ExampleBlock>
    </DemoGroup>
  </view>;
}
