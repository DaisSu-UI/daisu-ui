import { iconPaths } from './icons/paths.js';
import type { IconName } from './icons/paths.js';

export type IconProps = {
  name: IconName | (string & {});
  color?: string;
  size?: number;
  className?: string;
  accessibilityLabel?: string;
  onTap?: () => void;
};

function escapeAttribute(value: string) {
  return value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

/** Original Wot glyph outlines rendered as native SVG, without iconfont/::before. */
export function Icon({ name, color, size = 16, className = '', accessibilityLabel, onTap }: IconProps) {
  const dimension = Number.isFinite(size) ? Math.max(0, size) : 16;
  const path = iconPaths[name as IconName];
  const imageSource = /^(https?:\/\/|\/|\.\/|\.\.\/|data:image\/)/.test(name);
  const markup = (fill: string) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024"><path transform="translate(0 896) scale(1 -1)" fill="${escapeAttribute(fill)}" d="${path}"/></svg>`;
  return <view className={`ui-icon ${color ? '' : 'ui-icon-auto'} ${className}`} style={{ width: `${dimension}px`, height: `${dimension}px` }} accessibility-element={!!accessibilityLabel || !!onTap} accessibility-traits={onTap ? 'button' : 'image'} accessibility-label={accessibilityLabel ?? name} bindtap={onTap}>
    {path ? color ? <svg className="ui-icon-svg" content={markup(color)} /> : <><svg className="ui-icon-svg ui-icon-light" content={markup('#1d1f29')} /><svg className="ui-icon-svg ui-icon-dark" content={markup('#e5e6eb')} /></> : imageSource ? /\.svg(?:[?#]|$)/i.test(name) ? <svg className="ui-icon-svg" src={name} /> : <image className="ui-icon-svg" src={name} mode="aspectFit" /> : null}
  </view>;
}
