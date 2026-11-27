import { useDemoLocale } from '../demoLocale.js';
import { useEffect, useRef, useState } from '@lynx-js/react';
import { List } from '@lynx-js/lynx-ui';
import { Loadmore } from '@daisu-ui/ui';
import type { LoadmoreState } from '@daisu-ui/ui';
import cat from '../../../assets/demo-cat.png';

export function LoadmoreExample() {
  const { text: demoText } = useDemoLocale();
  const [count, setCount] = useState(15);
  const [state, setState] = useState<LoadmoreState>('loading');
  const total = useRef(15);
  const status = useRef<LoadmoreState>('loading');
  const timer = useRef<ReturnType<typeof setTimeout>>();
  useEffect(() => () => { if (timer.current !== undefined) clearTimeout(timer.current); }, []);
  const load = (retry = false) => {
    'background only';
    if (timer.current !== undefined || status.current === 'finished' || (status.current === 'error' && !retry)) return;
    if (total.current >= 60) { status.current = 'finished'; setState('finished'); return; }
    if (total.current === 45 && !retry) { status.current = 'error'; setState('error'); return; }
    status.current = 'loading'; setState('loading');
    timer.current = setTimeout(() => {
      'background only';
      timer.current = undefined;
      total.current = Math.min(60, total.current + 15);
      setCount(total.current);
    }, 200);
  };
  return <view className="demo-loadmore-page"><List style={{ zIndex: 0 }} listId="demo-loadmore-list" listType="single" spanCount={1} scrollOrientation="vertical" className="demo-loadmore-list" onScrollToLower={() => { 'background only'; load(); }}>
    {Array.from({ length: count }, (_, index) => <list-item key={index} item-key={`loadmore-${index}`} estimated-main-axis-size-px={98} style={{ height: '98px' }}><view className="demo-loadmore-item"><image className="demo-loadmore-image" src={cat} mode="scaleToFill" /><text className="demo-loadmore-content">{demoText(`这是一条测试${index + 1}1`)}</text><view className="demo-loadmore-line" /></view></list-item>)}
    <list-item item-key="loadmore-footer" estimated-main-axis-size-px={48}><Loadmore state={state} onReload={() => { 'background only'; load(true); }} /></list-item>
  </List></view>;
}
