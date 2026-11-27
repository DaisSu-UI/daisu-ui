# 工具与按压反馈

这些函数从 @daisu-ui/ui/utils 导入。日期工具按设备本地时区处理毫秒时间戳，不负责校验业务日期范围。CalendarValue 是 number | readonly (number | null)[] | null；DatetimePickerValue 是 number | string；DatetimePickerType 为 datetime / date / year-month / time / year。usePressState 是 Hook，必须在组件顶层调用；不要将返回函数用于 main-thread 事件。

```tsx
import { usePressState, calendarValues, calendarWeekNumber, datetimeLabel, datetimePad, swiperIndex } from '@daisu-ui/ui/utils';
```

## 交互用法

### 按压反馈

传入 enabled:boolean，返回 pressed:boolean、start():void、end():void。start / end 已标记为后台函数；结束和取消都必须绑定 end，enabled=false 时取消反馈。

```tsx
const { pressed, start, end } = usePressState(true);

<view
  bindtouchstart={start}
  bindtouchend={end}
  bindtouchcancel={end}
  style={{ opacity: pressed ? 0.6 : 1 }}
>
  <text>按住查看反馈</text>
</view>
```

## 纯函数

### 日期与轮播索引

calendarValues 过滤 null、undefined 和无效日期，保留顺序，不去重；calendarWeekNumber 返回 ISO 周数。datetimePad 默认补齐两位；datetimeLabel(type="time") 原样返回时间字符串，其余模式需有效时间戳。swiperIndex 将索引取整，loop=true 时取模，否则限制到 0..count-1；空列表返回 0。

```tsx
const date = new Date(2026, 0, 5).getTime();

const values = calendarValues([date, null]);

const week = calendarWeekNumber(date);

const label = datetimeLabel(date, 'date');

const hour = datetimePad(9);

const index = swiperIndex(-1, 3, true);

<text>
  {values.length} 个日期 / 第 {week} 周 / {label} / {hour} / 索引 {index}
</text>
```

## 函数签名

### usePressState

```ts
usePressState(enabled: boolean): { pressed: boolean; start: () => void; end: () => void; events: { bindmouseleave: () => void; 'global-bindmouseup': (() => void) | undefined; bindtouchstart?: ((event: import("@lynx-js/types").TouchEvent) => void) | undefined; bindtouchmove?: ((event: import("@lynx-js/types").TouchEvent) => void) | undefined; bindtouchend?: ((event: import("@lynx-js/types").TouchEvent) => void) | undefined; bindtouchcancel?: ((event: import("@lynx-js/types").TouchEvent) => void) | undefined; catchtouchstart?: ((event: import("@lynx-js/types").TouchEvent) => void) | undefined; catchtouchmove?: ((event: import("@lynx-js/types").TouchEvent) => void) | undefined; catchtouchend?: ((event: import("@lynx-js/types").TouchEvent) => void) | undefined; catchtouchcancel?: ((event: import("@lynx-js/types").TouchEvent) => void) | undefined; "capture-bindtouchstart"?: ((event: import("@lynx-js/types").TouchEvent) => void) | undefined; "capture-bindtouchmove"?: ((event: import("@lynx-js/types").TouchEvent) => void) | undefined; "capture-bindtouchend"?: ((event: import("@lynx-js/types").TouchEvent) => void) | undefined; "capture-bindtouchcancel"?: ((event: import("@lynx-js/types").TouchEvent) => void) | undefined; "capture-catchtouchstart"?: ((event: import("@lynx-js/types").TouchEvent) => void) | undefined; "capture-catchtouchmove"?: ((event: import("@lynx-js/types").TouchEvent) => void) | undefined; "capture-catchtouchend"?: ((event: import("@lynx-js/types").TouchEvent) => void) | undefined; "capture-catchtouchcancel"?: ((event: import("@lynx-js/types").TouchEvent) => void) | undefined; bindmousedown?: ((event: import("@lynx-js/types").MouseEvent) => void) | undefined; bindmousemove?: ((event: import("@lynx-js/types").MouseEvent) => void) | undefined; bindmouseup?: ((event: import("@lynx-js/types").MouseEvent) => void) | undefined; catchmousedown?: ((event: import("@lynx-js/types").MouseEvent) => void) | undefined; catchmousemove?: ((event: import("@lynx-js/types").MouseEvent) => void) | undefined; catchmouseup?: ((event: import("@lynx-js/types").MouseEvent) => void) | undefined; "capture-bindmousedown"?: ((event: import("@lynx-js/types").MouseEvent) => void) | undefined; "capture-bindmousemove"?: ((event: import("@lynx-js/types").MouseEvent) => void) | undefined; "capture-bindmouseup"?: ((event: import("@lynx-js/types").MouseEvent) => void) | undefined; "capture-catchmousedown"?: ((event: import("@lynx-js/types").MouseEvent) => void) | undefined; "capture-catchmousemove"?: ((event: import("@lynx-js/types").MouseEvent) => void) | undefined; "capture-catchmouseup"?: ((event: import("@lynx-js/types").MouseEvent) => void) | undefined; "main-thread:bindtouchstart"?: ((event: import("@lynx-js/types/main-thread").TouchEvent) => void) | undefined; "main-thread:bindtouchmove"?: ((event: import("@lynx-js/types/main-thread").TouchEvent) => void) | undefined; "main-thread:bindtouchend"?: ((event: import("@lynx-js/types/main-thread").TouchEvent) => void) | undefined; "main-thread:bindtouchcancel"?: ((event: import("@lynx-js/types/main-thread").TouchEvent) => void) | undefined; "main-thread:catchtouchstart"?: ((event: import("@lynx-js/types/main-thread").TouchEvent) => void) | undefined; "main-thread:catchtouchmove"?: ((event: import("@lynx-js/types/main-thread").TouchEvent) => void) | undefined; "main-thread:catchtouchend"?: ((event: import("@lynx-js/types/main-thread").TouchEvent) => void) | undefined; "main-thread:catchtouchcancel"?: ((event: import("@lynx-js/types/main-thread").TouchEvent) => void) | undefined; "main-thread:capture-bindtouchstart"?: ((event: import("@lynx-js/types/main-thread").TouchEvent) => void) | undefined; "main-thread:capture-bindtouchmove"?: ((event: import("@lynx-js/types/main-thread").TouchEvent) => void) | undefined; "main-thread:capture-bindtouchend"?: ((event: import("@lynx-js/types/main-thread").TouchEvent) => void) | undefined; "main-thread:capture-bindtouchcancel"?: ((event: import("@lynx-js/types/main-thread").TouchEvent) => void) | undefined; "main-thread:capture-catchtouchstart"?: ((event: import("@lynx-js/types/main-thread").TouchEvent) => void) | undefined; "main-thread:capture-catchtouchmove"?: ((event: import("@lynx-js/types/main-thread").TouchEvent) => void) | undefined; "main-thread:capture-catchtouchend"?: ((event: import("@lynx-js/types/main-thread").TouchEvent) => void) | undefined; "main-thread:capture-catchtouchcancel"?: ((event: import("@lynx-js/types/main-thread").TouchEvent) => void) | undefined; "main-thread:bindmousedown"?: ((event: import("@lynx-js/types/main-thread").MouseEvent) => void) | undefined; "main-thread:bindmousemove"?: ((event: import("@lynx-js/types/main-thread").MouseEvent) => void) | undefined; "main-thread:bindmouseup"?: ((event: import("@lynx-js/types/main-thread").MouseEvent) => void) | undefined; "main-thread:catchmousedown"?: ((event: import("@lynx-js/types/main-thread").MouseEvent) => void) | undefined; "main-thread:catchmousemove"?: ((event: import("@lynx-js/types/main-thread").MouseEvent) => void) | undefined; "main-thread:catchmouseup"?: ((event: import("@lynx-js/types/main-thread").MouseEvent) => void) | undefined; "main-thread:capture-bindmousedown"?: ((event: import("@lynx-js/types/main-thread").MouseEvent) => void) | undefined; "main-thread:capture-bindmousemove"?: ((event: import("@lynx-js/types/main-thread").MouseEvent) => void) | undefined; "main-thread:capture-bindmouseup"?: ((event: import("@lynx-js/types/main-thread").MouseEvent) => void) | undefined; "main-thread:capture-catchmousedown"?: ((event: import("@lynx-js/types/main-thread").MouseEvent) => void) | undefined; "main-thread:capture-catchmousemove"?: ((event: import("@lynx-js/types/main-thread").MouseEvent) => void) | undefined; "main-thread:capture-catchmouseup"?: ((event: import("@lynx-js/types/main-thread").MouseEvent) => void) | undefined; }; }
```

### calendarValues

```ts
calendarValues(value: CalendarValue | undefined): number[]
```

### calendarWeekNumber

```ts
calendarWeekNumber(value: number): number
```

### datetimeLabel

```ts
datetimeLabel(value: DatetimePickerValue, type?: DatetimePickerType, useSecond?: boolean): string
```

### datetimePad

```ts
datetimePad(value: number, width?: number): string
```

### swiperIndex

```ts
swiperIndex(value: number, count: number, loop: boolean): number
```

## 数据类型

```tsx
export type CalendarValue = number | readonly (number | null)[] | null;

export type DatetimePickerValue = number | string;

export type DatetimePickerType =
  | 'datetime'
  | 'date'
  | 'year-month'
  | 'time'
  | 'year';
```

## 源代码

[usePressState 组件源码](./sources/utilities/usePressState.ts.txt) · [calendarValues 组件源码](./sources/utilities/calendarModel.ts.txt) · [calendarWeekNumber 组件源码](./sources/utilities/calendarModel.ts.txt) · [datetimeLabel 组件源码](./sources/utilities/datetimePickerModel.ts.txt) · [datetimePad 组件源码](./sources/utilities/datetimePickerModel.ts.txt) · [swiperIndex 组件源码](./sources/utilities/swiperModel.ts.txt) · [文档源码](./sources/utilities/docs.md.txt)
