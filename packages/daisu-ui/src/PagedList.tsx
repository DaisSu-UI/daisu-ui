import { useLocale } from './useLocale.js';
import { FeedList, type FeedListRef } from '@lynx-js/lynx-ui';
import { useEffect, useMemo, useRef } from '@lynx-js/react';
import type { ReactElement, ReactNode, RefObject } from '@lynx-js/react';

const REFRESH_SPINNER_URL = 'https://lf-lynx.tiktok-cdns.com/obj/lynx-artifacts-oss-sg/plugin/static/loading.gif';

/** The platform refresh element owns pull distance, threshold, pinning and rebound. */
export function PagedList({ listId, listRef, refreshing, onRefresh, onLoadMore, onLayoutComplete, footer, children }: {
  listId: string;
  listRef: RefObject<FeedListRef | null>;
  refreshing: boolean;
  onRefresh: () => void;
  onLoadMore: () => void;
  onLayoutComplete?: () => void;
  footer: ReactElement | null;
  children: ReactNode;
}) {
  const { t: localeText } = useLocale();

  const pending = useRef(false);
  const refreshHeader = useMemo(() => <view className="native-refresh-header">
    <image className="native-refresh-spinner" src={REFRESH_SPINNER_URL} mode="aspectFit" />
    <text className="native-refresh-label">{localeText('list.refreshing')}</text>
  </view>, [localeText]);
  useEffect(() => {
    // Initial data loading is not a refresh gesture. Only finish a refresh
    // after onStartRefresh has actually fired, matching the official demo.
    if (!refreshing && pending.current) {
      pending.current = false;
      listRef.current?.finishRefresh();
    }
  }, [refreshing, listRef]);
  return <view className="data-list-body" flatten={false}>
    <FeedList
      listId={listId}
      ref={listRef}
      listType="single"
      spanCount={1}
      scrollOrientation="vertical"
      useRefactorList={true}
      bounces={true}
      style={{ zIndex: 0, width: '100%', height: '100%' }}
      refreshOptions={{
        enableRefresh: true,
        mode: 'native',
        headerContent: refreshHeader,
        onStartRefresh: () => {
          if (pending.current) return;
          pending.current = true;
          if (!refreshing) onRefresh();
        },
      }}
      onLayoutComplete={onLayoutComplete}
      onScrollToLower={onLoadMore}>
      {children}
      {footer}
    </FeedList>
  </view>;
}
