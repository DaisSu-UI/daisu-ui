# Upload 上传

上传组件管理文件列表、上传进度、预览与删除。选取和上传过程由应用提供的适配器完成。

```tsx
import { Upload } from '@daisu-ui/ui';
```

## 组件类型

### 展示文件

通过 `fileList` 展示文件，每项的 `url` 为文件地址，`status` 表示上传状态。

```tsx
<Upload
  fileList={[{ url: 'https://example.com/photo.jpg', status: 'success' }]}
/>
```

## 组件状态

### 禁用与数量限制

设置 `disabled` 禁止操作，通过 `limit` 限制文件数量；实际文件选择和上传通过 `adapter` 接入。

```tsx
<Upload disabled />
<Upload limit={3} />
```

## Attributes 属性

| 参数 | 说明 | 类型 / 可选值 | 默认值 |
| --- | --- | --- | --- |
| fileList | 受控列表，回调 `{ fileList }` 后由调用方回填 | `readonly UploadFile[]` | — |
| adapter | `chooseAndUpload(onProgress): Promise<UploadFile \| null>`，null 表示用户取消；可选 `preview(files, index)` | `UploadAdapter` | — |
| disabled | 禁止增删；readonly 隐藏上传入口。普通图片仍可预览，disabled 时覆盖上传不可操作 | `boolean` | — |
| readonly | 禁止增删；readonly 隐藏上传入口。普通图片仍可预览，disabled 时覆盖上传不可操作 | `boolean` | `false` |
| limit | 0 不限；到达上限隐藏入口，入口显示全角 `（当前数/上限）` | `number` | `0` |
| size | 图片和默认入口边长；imageMode 支持 aspectFit / aspectFill / scaleToFill / center | `number` | `88` |
| deletable | 非 loading、非禁用、非只读时显示删除按钮 | `boolean` | `true` |
| showLimitNum | 0 不限；到达上限隐藏入口，入口显示全角 `（当前数/上限）` | `boolean` | `true` |
| reupload | 点击已有图片时重新选择并替换这一项，其余项保留；仍允许在上限内追加 | `boolean` | `false` |
| previewFullImage | false 时只触发预览事件，不调用适配器 | `boolean` | `true` |
| imageMode | 图片和默认入口边长；imageMode 支持 aspectFit / aspectFill / scaleToFill / center | `'aspectFit' \| 'aspectFill' \| 'scaleToFill' \| 'center'` | `'aspectFill'` |
| uploadIcon | 默认入口图标和可选文字 | `string` | `'camera-fill'` |
| uploadText | 默认入口图标和可选文字 | `string` | — |
| loadingType | 图片 loading 遮罩参数；选择上传期间入口显示进度 | `LoadingProps['type']` | `'circular'` |
| loadingSize | 图片 loading 遮罩参数；选择上传期间入口显示进度 | `number` | `24` |
| loadingColor | 图片 loading 遮罩参数；选择上传期间入口显示进度 | `string` | `'#fff'` |
| beforeChoose | `({ fileList, reuploadIndex? }) => boolean \| Promise<boolean>`；选择前拦截 | `(event: { fileList: readonly UploadFile[]; reuploadIndex?: number }) => boolean \| Promise<boolean>` | — |
| beforePreview | `(file, index) => boolean \| Promise<boolean>`；false 阻止操作，异常通过 onFail 报告 | `(file: UploadFile, index: number) => boolean \| Promise<boolean>` | — |
| beforeRemove | `(file, index) => boolean \| Promise<boolean>`；false 阻止操作，异常通过 onFail 报告 | `(file: UploadFile, index: number) => boolean \| Promise<boolean>` | — |
| className | 根节点、入口、预览项及根样式 | `string` | `''` |
| evokeClassName | 根节点、入口、预览项及根样式 | `string` | `''` |
| previewClassName | 根节点、入口、预览项及根样式 | `string` | `''` |
| style | 根节点、入口、预览项及根样式 | `CSSProperties` | — |
| children | 自定义上传触发器，保持自身尺寸，不套 88px 的默认入口 | `ReactNode` | — |

## Events 事件

| 事件 | 说明 | 类型 |
| --- | --- | --- |
| onChange | 受控列表，回调 `{ fileList }` 后由调用方回填 | (event: { fileList: UploadFile[] }) => void |
| onSuccess | 参数分别为 UploadFile / Error / 0–100 的有限数字；保持原有事件签名 | (file: UploadFile) => void |
| onFail | 参数分别为 UploadFile / Error / 0–100 的有限数字；保持原有事件签名 | (error: Error) => void |
| onProgress | 参数分别为 UploadFile / Error / 0–100 的有限数字；保持原有事件签名 | (progress: number) => void |
| onPreview | `{ file, index }`；移除成功后触发 onRemove | (event: { file: UploadFile; index: number }) => void |
| onRemove | `{ file, index }`；移除成功后触发 onRemove | (event: { file: UploadFile; index: number }) => void |

## 内容插槽

| 名称 | 说明 | 类型 |
| --- | --- | --- |
| renderPreviewCover | `({ file, index }) => ReactNode`，用于图片上的自定义覆盖内容 | (event: { file: UploadFile; index: number }) => ReactNode |
| children | 自定义上传触发器，保持自身尺寸，不套 88px 的默认入口 | ReactNode |

## 数据类型

```tsx
export type UploadFile = {
  url: string;
  name?: string;
  path?: string;
  status?: 'success' | 'loading' | 'fail';
  message?: string;
  percent?: number;
};

export type UploadAdapter = {
  chooseAndUpload: (
    onProgress: (progress: number) => void,
  ) => Promise<UploadFile | null>;
  preview?: (
    files: readonly UploadFile[],
    index: number,
  ) => void | Promise<void>;
};
```

## 主题定制

页面主题可通过 [ConfigProvider 全局配置](config-provider.md) 统一设置。局部外观使用本组件属性表中的颜色、尺寸及自定义类名调整。

```tsx
import { ConfigProvider } from '@daisu-ui/ui';

<ConfigProvider theme="dark">
  {/* 页面内容 */}
</ConfigProvider>
```

### CSS 变量

以下变量可通过 ConfigProvider 的 themeVars 覆盖，未设置时使用当前主题与组件的默认样式。

| 变量 | 作用范围 |
| --- | --- |
| `--cso-ui-canvas` | 共享主题 |
| `--cso-ui-line` | 共享主题 |
| `--cso-ui-text-muted` | 共享主题 |

## 源代码

[Upload 组件源码](./sources/upload/Upload.tsx.txt) · [示例源码](./sources/upload/demo.tsx.txt) · [文档源码](./sources/upload/docs.md.txt)
