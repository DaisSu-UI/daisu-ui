# Router 路由

路由用于组织页面导航、返回栈和页面转场，支持页面保活、导航守卫与侧滑返回。

```tsx
import { RouterView } from 'daisu-ui/router';
```

## 基础用法

### 创建页面路由

通过 `createRouter` 创建路由实例，使用 `RouterView.router` 绑定路由，`renderRoute` 定义页面内容。

```tsx
import { createRootRoute, createRoute } from '@tanstack/react-router';

import { createRouter } from 'daisu-ui/router';

const rootRoute = createRootRoute();

const page = createRoute({
  getParentRoute: () => rootRoute,
  path: '/example',
});

const router = createRouter({
  routeTree: rootRoute.addChildren([page]),
  initial: '/example',
  toPath: (path) => path,
  fromMatch: (match) => ({ path: match.pathname }),
  stringify: (route) => route.path,
});

<RouterView
  router={router}
  renderRoute={(route) => <text>{route.path}</text>}
/>
```

## Attributes 属性

| 参数 | 说明 | 类型 / 可选值 | 默认值 |
| --- | --- | --- | --- |
| router | 页面路由实例 | `Router<R, TTree>` | 必填 |
| controllerRef | 页面栈控制器引用 | `MutableRefObject<RouterViewController \| null>` | — |
| canSwipeBack | 判断当前页面是否允许侧滑返回 | `boolean` | — |
| sceneClassName | 页面场景类名生成函数 | `string` | — |
| viewportWidth | 页面可用宽度 | `number` | `375` |
| platform | 当前运行平台 | `string` | — |
| systemGestureInsetLeft | 系统左侧手势区域宽度 | `number` | `0` |

泛型约束：`R`、`TTree extends AnyRoute = AnyRoute`。

## Events 事件

| 事件 | 说明 | 类型 |
| --- | --- | --- |
| onExit | 对应操作发生时触发 | void |

## 内容插槽

| 名称 | 说明 | 类型 |
| --- | --- | --- |
| renderRoute | 自定义区域内容 | ReactNode |

## 数据类型

```tsx
export type RouterViewController = { back(): void; isBusy(): boolean };
```

## 主题定制

页面主题可通过 [ConfigProvider 全局配置](config-provider.md) 统一设置。局部外观使用本组件属性表中的颜色、尺寸及自定义类名调整。

```tsx
import { ConfigProvider } from 'daisu-ui';

<ConfigProvider theme="dark">
  {/* 页面内容 */}
</ConfigProvider>
```

## 源代码

[RouterView 组件源码](./sources/router/RouterView.tsx.txt) · [示例源码](./sources/router/demo.tsx.txt) · [文档源码](./sources/router/docs.md.txt)
