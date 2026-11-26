import type { ReactNode } from '@lynx-js/react';
import type { CSSProperties } from '@lynx-js/types';
import { Icon } from './Icon.js';
import { usePressState } from './usePressState.js';

/** Shared close control for popup surfaces; positioning belongs to the surface. */
export function LayerCloseButton({ show, onClose, label, className, style, children }: {
  show: boolean;
  onClose: () => void;
  label: string;
  className: string;
  style?: CSSProperties;
  children?: ReactNode;
}) {
  const press = usePressState(show);
  return <view className={`ui-layer-close ${press.pressed ? 'ui-layer-close-pressed' : ''} ${className}`} style={style} catchtap={onClose} bindtouchstart={press.start} bindtouchend={press.end} bindtouchcancel={press.end} accessibility-element accessibility-traits="button" accessibility-label={label}>
    {children === undefined ? <Icon name="close" size={24} color="var(--cso-ui-layer-close-color)" /> : children}
  </view>;
}
