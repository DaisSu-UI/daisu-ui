import { useMemo, useState } from '@lynx-js/react';
import type { HostClient } from '../../../lib/host.js';
import { createHostUploadAdapter } from '../../../lib/uiUpload.js';
import { Button, Dialog, Toast, Upload, useDialog, useToast } from '@daisu-ui/ui';
import type { UploadAdapter, UploadFile, UploadProps } from '@daisu-ui/ui';
import panda from '../../../assets/demo-panda.jpg';
import { DemoGroup, ExampleBlock } from './shared.js';

function UploadCase({ adapter, initial = [], ...props }: UploadProps & { initial?: UploadFile[] }) {
  const [files, setFiles] = useState<UploadFile[]>(initial);
  return <Upload imageMode="aspectFit" {...props} fileList={files} adapter={adapter} onChange={({ fileList }) => { 'background only'; setFiles(fileList); }} />;
}
export function UploadExample({ host }: { host?: HostClient | null }) {
  const dialog = useDialog(), toast = useToast(), [status, setStatus] = useState('');
  const adapter = useMemo(() => host ? createHostUploadAdapter(host) : undefined, [host]);
  const customAdapter = useMemo<UploadAdapter | undefined>(() => adapter ? {
    async chooseAndUpload(progress) { 'background only'; const file = await adapter.chooseAndUpload(value => progress(value)); return file; },
    preview: adapter.preview,
  } : undefined, [adapter]);
  const confirm = async (message: string, cancelMessage: string) => {
    'background only';
    try { await dialog.confirm({ title: '提示', msg: message }); return true; }
    catch { toast.info(cancelMessage); return false; }
  };
  const common = { adapter, onFail: (error: Error) => { 'background only'; toast.error(error.message); } };
  return <view className="demo-upload-page">
    <DemoGroup title="组件类型"><ExampleBlock title="基本用法"><UploadCase {...common} initial={[{ url: panda }]} imageMode="aspectFill" /></ExampleBlock></DemoGroup>
    <DemoGroup title="组件状态">
      <ExampleBlock title="上传状态钩子"><UploadCase {...common} onProgress={value => { 'background only'; setStatus(`上传中：${Math.round(value)}%`); }} onSuccess={file => { 'background only'; setStatus(`上传成功：${file.name || file.url}`); }} onFail={error => { 'background only'; setStatus(`上传失败：${error.message}`); }} />{status ? <text className="demo-upload-status">{status}</text> : null}</ExampleBlock>
      <ExampleBlock title="禁用"><UploadCase {...common} disabled /></ExampleBlock>
    </DemoGroup>
    <DemoGroup title="组件变体">
      <ExampleBlock title="最大上传数限制"><UploadCase {...common} limit={3} /></ExampleBlock>
      <ExampleBlock title="覆盖上传"><UploadCase {...common} initial={[{ url: panda }]} reupload imageMode="aspectFill" /></ExampleBlock>
    </DemoGroup>
    <DemoGroup title="组件样式">
      <ExampleBlock title="自定义唤起上传样式并限制上传5张"><UploadCase {...common} limit={5}><Button label="自定义唤起样式" /></UploadCase></ExampleBlock>
      <ExampleBlock title="自定义预览样式"><UploadCase {...common} initial={[{ url: panda, name: 'panda' }]} imageMode="aspectFill" renderPreviewCover={({ file, index }) => <text className="demo-upload-preview-cover">{file.name || `文件${index}`}</text>} /></ExampleBlock>
    </DemoGroup>
    <DemoGroup title="特殊样式">
      <ExampleBlock title="拦截预览图片操作"><UploadCase {...common} beforePreview={() => { 'background only'; return confirm('是否预览图片', '取消预览操作'); }} /></ExampleBlock>
      <ExampleBlock title="移除图片前置处理"><UploadCase {...common} beforeRemove={() => { 'background only'; return confirm('是否删除', '取消删除操作'); }} onRemove={() => { 'background only'; toast.success('删除成功'); }} /></ExampleBlock>
      <ExampleBlock title="选择文件前置处理"><UploadCase {...common} beforeChoose={() => { 'background only'; return confirm('是否选择', '取消选择操作'); }} /></ExampleBlock>
      <ExampleBlock title="自定义上传方法"><UploadCase {...common} adapter={customAdapter} /></ExampleBlock>
    </DemoGroup>
    <text className="demo-upload-host-note">图片上传需要有效登录会话。当前宿主支持图片单选。</text>
    <Dialog {...dialog.props} /><Toast {...toast.props} />
  </view>;
}
