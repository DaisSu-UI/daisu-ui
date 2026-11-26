# PagedList 分页列表

PagedList 在官方 @lynx-js/lynx-ui FeedList 上提供原生下拉刷新和触底通知。它不负责请求、分页、错误、去重或结束状态。listId 必须在当前页面及保活场景中唯一，父容器须有明确高度；children 和 footer 应按 FeedList 约定提供带稳定 item-key 的 list-item，不要嵌套另一个纵向滚动容器。

```tsx
import { PagedList } from '@daisu-ui/ui';
```

## 基础用法

### 刷新、加载更多与底部状态

示例用可清理的定时器模拟异步刷新，仅操作本地数据。业务请求由调用方在回调中执行，并以 loading / hasMore 防重和判断结束；刷新回调须设置 refreshing=true，在 finally 中恢复 false，否则原生刷新头不能正确结束。初次加载不等同于下拉刷新。footer 为必填，可传 null。listRef 类型从 @lynx-js/lynx-ui 导入。

```tsx
import { useRef, useState, useEffect } from '@lynx-js/react';

import type { FeedListRef } from '@lynx-js/lynx-ui';

import { Loadmore } from '@daisu-ui/ui';

const listRef = useRef<FeedListRef | null>(null);

const [refreshing, setRefreshing] = useState(false);

const [items, setItems] = useState([1, 2, 3]);

const loading = useRef(false);

const refresh = () => {
  'background only';
  if (loading.current) return;
  loading.current = true;
  setRefreshing(true);
};

useEffect(() => {
  if (!refreshing) return;
  const timer = setTimeout(() => {
    setItems([1, 2, 3]);
    loading.current = false;
    setRefreshing(false);
  }, 200);
  return () => clearTimeout(timer);
}, [refreshing]);

const loadMore = () => {
  'background only';
  if (loading.current || items.length >= 9) return;
  setItems((previous) => [...previous, previous.length + 1]);
};

<view style={{ height: '480px', display: 'flex', flexDirection: 'column' }}>
  <PagedList
    listId="guide-paged-list"
    listRef={listRef}
    refreshing={refreshing}
    onRefresh={refresh}
    onLoadMore={loadMore}
    footer={
      <list-item item-key="footer">
        <Loadmore state={items.length >= 9 ? 'finished' : undefined} />
      </list-item>
    }
  >
    {items.map((item) => (
      <list-item key={item} item-key={String(item)}>
        <text>{item}</text>
      </list-item>
    ))}
  </PagedList>
</view>
```

## Attributes 属性

| 参数 | 说明 | 类型 / 可选值 | 默认值 |
| --- | --- | --- | --- |
| listId | 页面及保活场景内唯一的 FeedList 标识 | `string` | 必填 |
| listRef | 官方 FeedListRef 引用，可访问列表控制器 | `RefObject<FeedListRef \| null>` | 必填 |
| refreshing | 下拉刷新状态，回调开始设 true，结束设 false | `boolean` | 必填 |
| footer | FeedList 底部节点，必填，可传 null | `ReactElement \| null` | 必填 |
| children | 列表项，按 FeedList 约定提供稳定 item-key | `ReactNode` | 必填 |

## Events 事件

| 事件 | 说明 | 类型 |
| --- | --- | --- |
| onRefresh | 原生下拉刷新开始通知，调用方发起刷新 | () => void |
| onLoadMore | 触底通知，调用方负责防重和结束判断 | () => void |
| onLayoutComplete | FeedList 布局完成通知 | () => void |

## 内容插槽

| 名称 | 说明 | 类型 |
| --- | --- | --- |
| children | 列表项，按 FeedList 约定提供稳定 item-key | ReactNode |

## 主题定制

页面主题可通过 [ConfigProvider 全局配置](config-provider.md) 统一设置。局部外观使用本组件属性表中的颜色、尺寸及自定义类名调整。

```tsx
import { ConfigProvider } from '@daisu-ui/ui';

<ConfigProvider theme="dark">
  {/* 页面内容 */}
</ConfigProvider>
```

## 源代码

[PagedList 组件源码](./sources/paged-list/PagedList.tsx.txt) · [文档源码](./sources/paged-list/docs.md.txt)
