import journey from '../../../assets/demo-journey.mp4';
import melody from '../../../assets/demo-melody.mp3';
import { useEffect, useRef, useState } from '@lynx-js/react';
import { Button, RichText } from 'daisu-ui';
import type { RichTextMediaEvent, RichTextRect, RichTextRef } from 'daisu-ui';
import { lake } from './rich-text-content.js';

type MediaId = 'trip-video' | 'reading-audio';
const clips: { id: MediaId; title: string }[] = [{ id: 'trip-video', title: '旅途片段' }, { id: 'reading-audio', title: '阅读时光' }];
const mediaContent = `<h3>01 / 留住路上的片刻</h3><video id="trip-video" title="旅途片段" controls poster="${lake}" src="${journey}"></video><h3>02 / 给文字配一段旋律</h3><audio id="reading-audio" title="阅读时，听一段轻音乐" src="${melody}"></audio>`;

export function RichTextMediaExample({ browser, scrollToAnchor }: { browser: boolean; scrollToAnchor: (rect: RichTextRect, offset: number) => Promise<void> }) {
  const ref = useRef<RichTextRef>(null), pendingSeek = useRef<string>();
  const [selected, setSelected] = useState<MediaId>('trip-video');
  const [states, setStates] = useState<Record<string, string>>({});
  const [times, setTimes] = useState<Record<string, string>>({});
  const [hint, setHint] = useState(''), [failed, setFailed] = useState(false), [generation, setGeneration] = useState(0);
  useEffect(() => () => { ref.current?.pauseMedia(); }, []);
  const update = ({ id }: RichTextMediaEvent, value: string) => { 'background only'; setStates(old => ({ ...old, [id]: value })); };
  const select = async (id: MediaId) => {
    'background only'; pendingSeek.current=undefined; setSelected(id); setHint('');
    try { await ref.current?.scrollToAnchor(id, { offset: 16, duration: 0 }); }
    catch { setHint('片段暂时无法定位，请稍后再试。'); }
  };
  const control = (kind: 'play' | 'pause' | 'seek') => {
    'background only';
    pendingSeek.current = kind === 'seek' ? selected : undefined;
    const accepted = kind === 'play' ? ref.current?.playMedia(selected) : kind === 'pause' ? ref.current?.pauseMedia(selected) : ref.current?.seekMedia(selected, 5);
    setHint(accepted ? kind === 'seek' ? '正在跳转至 5 秒…' : '' : '片段暂不可用，请检查资源后重试。');
  };
  if (!browser) return <text className="demo-rich-hint">当前环境暂不支持音视频播放，请在浏览器中体验。</text>;
  return <view className="demo-rich-media">
    <text className="demo-rich-hint">选择片段定位，轻触播放器开始。也可以用下方按钮控制当前片段。</text>
    <view className="demo-rich-actions">{clips.map(clip => <Button key={clip.id} size="small" variant={clip.id === selected ? 'solid' : 'plain'} label={clip.title} onTap={() => select(clip.id)} />)}</view>
    <RichText key={generation} ref={ref} content={mediaContent} mediaMode="browser" enableAnchor
      onScrollToAnchor={({ rect, offset }) => { 'background only'; return scrollToAnchor(rect, offset); }}
      onMediaPlay={event => update(event, '播放中')} onMediaPause={event => update(event, '已暂停')} onMediaEnded={event => update(event, '已结束')}
      onMediaTimeUpdate={event => { 'background only'; setTimes(old => ({ ...old, [event.id]: `${Math.floor(event.currentTime)} / ${Math.floor(event.duration)} 秒` }));if(pendingSeek.current===event.id&&Math.abs(event.currentTime-5)<0.15){pendingSeek.current=undefined;setHint('已跳转至 5 秒。');} }}
      onError={error => { 'background only'; if (error.source !== 'video' && error.source !== 'audio') return;
        if(error.code==='SEEK_FAILED'){pendingSeek.current=undefined;setHint(error.message||'跳转失败，请稍后重试。');return;}
        if(error.code==='PLAY_REJECTED'){setHint('请点击视频播放按钮或音频播放条后重试。');return;}
        setFailed(true); setStates(old => ({ ...old, [error.source === 'video' ? 'trip-video' : 'reading-audio']: '加载失败' }));
        setHint('部分片段暂时无法加载，请检查网络后重新加载音视频。'); }} />
    <view className="demo-rich-media-controls">
      <text className="demo-rich-hint">{clips.find(clip => clip.id === selected)!.title} · {states[selected] || '待播放'} · {times[selected] || '0 / 0 秒'}</text>
      <view className="demo-rich-actions"><Button size="small" label="播放片段" onTap={() => control('play')} /><Button size="small" variant="plain" label="暂停片段" onTap={() => control('pause')} /><Button size="small" variant="plain" label="跳至 5 秒" onTap={() => control('seek')} /></view>
      {hint ? <text className="demo-rich-hint">{hint}</text> : null}
      {failed ? <view className="demo-rich-actions"><Button size="small" variant="plain" label="重新加载音视频" onTap={() => {
        'background only'; pendingSeek.current=undefined;ref.current?.pauseMedia(); setGeneration(old => old + 1); setStates({}); setTimes({}); setFailed(false); setHint('重新加载后，请点击播放片段。');
      }} /><text className="demo-rich-hint">将重置两段播放进度，重新加载后请手动播放。</text></view> : null}
    </view>
  </view>;
}
