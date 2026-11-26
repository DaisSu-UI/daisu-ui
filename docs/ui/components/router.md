# Router 路由

路由用于组织页面导航、返回栈和页面转场，支持页面保活、导航守卫与侧滑返回。RouterView 已包含 RouterProvider；仅需要上下文而不使用内置页面栈时才单独使用 RouterProvider。useRouter / useRoute 必须在提供者内调用；useRouteMatch / RouteScreen 还必须位于 RouterView 的场景内。RouteScreen 无属性，用于渲染路由树叶节点注册的 component。useRoute 返回保活场景自己的路由，不会把被覆盖页面替换为顶部页面参数。useRouterSnapshot(router) 订阅并返回 entries、action、direction、revision，卸载时自动取消订阅；避免额外重复 Provider。路由实例需保持稳定，不要每次渲染重建。

```tsx
import { RouterView, RouterProvider, RouteScreen, useRouter, useRoute, useRouterSnapshot, useRouteMatch, createRouter, connectRouterHistory, parseRoutePath, routePath, parseRouterHistoryState, shouldFinishBack } from '@daisu-ui/ui/router';
```

## 基础用法

### 创建页面路由

通过 `createRouter` 创建路由实例，使用 `RouterView.router` 绑定路由，`renderRoute` 定义页面内容。

```tsx
import { createRootRoute, createRoute } from '@tanstack/react-router';

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

## 上下文与保活

### 页面组件读取路由

用 useState 惰性创建稳定实例。路由注册 component 后，可在 renderRoute 中返回 RouteScreen。加载和导航在后台事件或 Effect 中发起；navigate / back 等操作返回 Promise<boolean>，应处理业务取消或失败。

```tsx
import { Button } from '@daisu-ui/ui';

import { useState } from '@lynx-js/react';

function Page() {
  const router = useRouter<{
    path: string;
  }>();
  const route = useRoute<{
    path: string;
  }>();
  const match = useRouteMatch();
  const snapshot = useRouterSnapshot(router);
  return (
    <view>
      <text>
        {route.path} / {match.pathname} / {snapshot.entries.length}
      </text>
      <Button
        label="返回"
        onTap={() => {
          'background only';
          void router.back();
        }}
      />
    </view>
  );
}

const [router] = useState(() => {
  const root = createRootRoute();
  const page = createRoute({
    getParentRoute: () => root,
    path: '/example',
    component: Page,
  });
  return createRouter({
    routeTree: root.addChildren([page]),
    initial: '/example',
    toPath: (path) => path,
    fromMatch: (match) => ({ path: match.pathname }),
    stringify: (route) => route.path,
  });
});

<RouterView router={router} renderRoute={() => <RouteScreen />} />
```

## 路径与宿主历史

### 构造路径和校验历史

routePath 忽略 null / undefined 并编码查询值；parseRoutePath 返回字符串查询值，重复键取最后一项，不做路由匹配。parseRouterHistoryState 接收对象或 JSON 字符串，无效时返回 null。connectRouterHistory(router, adapter) 需在 useEffect 中建立并返回其清理函数；adapter.write 接收序列化栈及动作，adapter.subscribe 注册宿主历史回调并返回退订函数。它不会自动接管 window.history。shouldFinishBack(distance, width, velocity) 只计算侧滑是否完成，不执行返回；一般交给 RouterView。

```tsx
const location = routePath('/example', { id: '001', empty: null });

const parsed = parseRoutePath(location);

const history = parseRouterHistoryState({
  entries: [{ key: 'entry-1', path: location }],
});

<text>
  {parsed.path} / {parsed.query.id} / {history?.entries.length}
</text>
```

## Attributes 属性

### RouterView

| 参数 | 说明 | 类型 / 可选值 | 默认值 |
| --- | --- | --- | --- |
| router | 由 createRouter 创建的稳定路由实例 | `Router<R, TTree>` | 必填 |
| controllerRef | 页面栈控制器引用 | `MutableRefObject<RouterViewController \| null>` | — |
| canSwipeBack | 判断当前页面是否允许侧滑返回 | `boolean` | — |
| sceneClassName | 页面场景类名生成函数 | `string` | — |
| viewportWidth | 页面可用宽度 | `number` | `375` |
| platform | 当前运行平台 | `string` | — |
| systemGestureInsetLeft | 系统左侧手势区域宽度 | `number` | `0` |

泛型约束：`R`、`TTree extends AnyRoute = AnyRoute`。

### RouterProvider

| 参数 | 说明 | 类型 / 可选值 | 默认值 |
| --- | --- | --- | --- |
| router | 由 createRouter 创建的稳定路由实例 | `Router<R, TTree>` | 必填 |
| children | 自定义内容 | `ReactNode` | — |

### RouteScreen

无属性；使用前须满足上文的上下文要求。

### useRouter

```ts
useRouter<R = unknown, TTree extends AnyRoute = AnyRoute>(): Router<R, TTree>
```

### useRoute

```ts
useRoute<R = unknown>(): R
```

### useRouterSnapshot

```ts
useRouterSnapshot<R, TTree extends AnyRoute = AnyRoute>(router: Router<R, TTree>): RouterSnapshot<R>
```

### useRouteMatch

```ts
useRouteMatch(): AnyRouteMatch
```

### createRouter

```ts
createRouter<R, TTree extends AnyRoute = AnyRoute>(options: RouterOptions<R, TTree>): { engine: TanStackRouter<AnyRoute, "never", false, import("@tanstack/history").RouterHistory, Record<string, any>>; navigate: <const TTo extends string | undefined, const TFrom extends string = string>(navigation: SceneNavigateOptions<TTree, TTo, TFrom>) => Promise<boolean>; readonly route: R; readonly routes: R[]; readonly snapshot: RouterSnapshot<R>; href: (route: R) => string; serialize(): RouterHistoryState; whenIdle(): Promise<boolean>; load(): Promise<boolean>; push: (location: string, replace?: boolean) => NavigationResult; replace(location: string): NavigationResult; back(): NavigationResult; reset(location: string): NavigationResult; restore(state: RouterHistoryState): NavigationResult; subscribe(listener: (snapshot: RouterSnapshot<R>, navigation: Navigation<R>) => void): () => void; beforeEach(guard: NavigationGuard<R>): () => void; afterEach(listener: (navigation: Navigation<R>) => void): () => void; }
```

### connectRouterHistory

```ts
connectRouterHistory<R>(router: Router<R>, adapter: RouterHistoryAdapter): () => void
```

### parseRoutePath

```ts
parseRoutePath(value: string): { path: string; query: Record<string, string>; }
```

### routePath

```ts
routePath(path: string, query?: RouteQuery): string
```

### parseRouterHistoryState

```ts
parseRouterHistoryState(value: unknown): RouterHistoryState | null
```

### shouldFinishBack

```ts
shouldFinishBack(distance: number, width: number, velocity: number): boolean
```

## Events 事件

| 事件 | 说明 | 类型 |
| --- | --- | --- |
| RouterView.onExit | 对应操作发生时触发 | void |

## 内容插槽

| 名称 | 说明 | 类型 |
| --- | --- | --- |
| RouterView.renderRoute | 自定义区域内容 | ReactNode |
| RouterProvider.children | 自定义内容 | ReactNode |

## 数据类型

```tsx
export type RouterViewController = { back(): void; isBusy(): boolean };

export type RouterSnapshot<R> = {
  entries: readonly RouterEntry<R>[];
  action: NavigationAction;
  direction: 'forward' | 'back' | 'none';
  revision: number;
};

export type RouterOptions<R, TTree extends AnyRoute = AnyRoute> = {
  routeTree: TTree;
  initial: string;
  /** Normalize host path aliases. Matching belongs to TanStack. */
  toPath(location: string): string | null;
  fromMatch(match: AnyRouteMatch): R | null;
  stringify(route: R): string;
  initialRoutes?(route: R): R[];
  historyState?: RouterHistoryState;
};

export type SceneNavigateOptions<
  TTree extends AnyRoute,
  TTo extends string | undefined,
  TFrom extends string = string,
> = NavigateOptions<TanStackRouter<TTree>, TFrom, TTo> & {
  hash?: never;
  state?: never;
  href?: never;
  reloadDocument?: never;
  mask?: never;
  hashScrollIntoView?: never;
  resetScroll?: never;
  startTransition?: never;
  viewTransition?: never;
  ignoreBlocker?: never;
  publicHref?: never;
};

export type RouterHistoryState = { entries: { key: string; path: string }[] };

export type NavigationResult = Promise<boolean>;

export type Navigation<R> = {
  to: R;
  from: R;
  action: NavigationAction;
  source: 'app' | 'history';
};

export type NavigationGuard<R> = (
  navigation: Navigation<R>,
) => boolean | void | Promise<boolean | void>;

export type RouterHistoryAdapter = {
  write(state: RouterHistoryState, action: NavigationAction | 'sync'): void;
  subscribe(listener: (state: RouterHistoryState) => void): () => void;
};

export type RouteQuery = Record<
  string,
  string | number | boolean | null | undefined
>;
```

## 主题定制

页面主题可通过 [ConfigProvider 全局配置](config-provider.md) 统一设置。局部外观使用本组件属性表中的颜色、尺寸及自定义类名调整。

```tsx
import { ConfigProvider } from '@daisu-ui/ui';

<ConfigProvider theme="dark">
  {/* 页面内容 */}
</ConfigProvider>
```

## 源代码

[RouterView 组件源码](./sources/router/RouterView.tsx.txt) · [RouterProvider 组件源码](./sources/router/hooks.tsx.txt) · [RouteScreen 组件源码](./sources/router/hooks.tsx.txt) · [useRouter 组件源码](./sources/router/hooks.tsx.txt) · [useRoute 组件源码](./sources/router/hooks.tsx.txt) · [useRouterSnapshot 组件源码](./sources/router/hooks.tsx.txt) · [useRouteMatch 组件源码](./sources/router/hooks.tsx.txt) · [createRouter 组件源码](./sources/router/core.ts.txt) · [connectRouterHistory 组件源码](./sources/router/core.ts.txt) · [parseRoutePath 组件源码](./sources/router/location.ts.txt) · [routePath 组件源码](./sources/router/location.ts.txt) · [parseRouterHistoryState 组件源码](./sources/router/location.ts.txt) · [shouldFinishBack 组件源码](./sources/router/RouterView.tsx.txt) · [示例源码](./sources/router/demo.tsx.txt) · [文档源码](./sources/router/docs.md.txt)
