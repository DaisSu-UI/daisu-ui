import { useLocale } from './useLocale.js';
import type { ReactNode } from '@lynx-js/react';
import type { CSSProperties } from '@lynx-js/types';
import { Divider } from './Divider.js';
import { Icon } from './Icon.js';
import { Loading } from './Loading.js';
import type { LoadingProps } from './Loading.js';

export type LoadmoreState = 'loading' | 'finished' | 'error';
export type LoadmoreProps = {
  state?: LoadmoreState;
  loadingText?: string;
  finishedText?: string;
  errorText?: string;
  loadingProps?: LoadingProps;
  loading?: ReactNode;
  finished?: ReactNode;
  error?: ReactNode;
  onReload?: () => void;
  className?: string;
  style?: CSSProperties;
};
function contentNode(content: ReactNode) {
  return typeof content === 'string' || typeof content === 'number' ? <text className="ui-loadmore-text">{content}</text> : content;
}

export function Loadmore({ state, loadingText, finishedText, errorText, loadingProps, loading, finished, error, onReload, className = '', style }: LoadmoreProps) {
  const { t: localeText } = useLocale();
  loadingText ??= localeText('loadmore.loading');
  finishedText ??= localeText('loadmore.finished');
  errorText ??= localeText('loadmore.failed');

  const retry = () => { 'background only'; if (state === 'error') onReload?.(); };
  return <view className={`ui-loadmore ${state ? `ui-loadmore-${state}` : ''} ${className}`} style={style} bindtap={retry} accessibility-element accessibility-traits={state === 'error' ? 'button' : 'text'} accessibility-label={state === 'error' ? localeText('loadmore.retryLabel', { error: errorText }) : state === 'loading' ? loadingText : state === 'finished' ? finishedText : undefined}>
    {state === 'loading' ? loading !== undefined ? contentNode(loading) : <><Loading {...loadingProps} className={`ui-loadmore-loading ${loadingProps?.className || ''}`} /><text className="ui-loadmore-text">{loadingText}</text></> : state === 'finished' ? finished !== undefined ? contentNode(finished) : <Divider className="ui-loadmore-divider" label={finishedText} /> : state === 'error' ? error !== undefined ? contentNode(error) : <><text className="ui-loadmore-text">{errorText}</text><text className="ui-loadmore-retry">{localeText('common.retry')}</text><Icon name="refresh" size={16} color="#1c64fd" /></> : null}
  </view>;
}
