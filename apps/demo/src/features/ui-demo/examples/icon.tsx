import { useEffect, useState } from '@lynx-js/react';
import { Icon, SyncedInput } from '@daisu-ui/ui';
import { iconCategories } from './iconCatalog.js';
import { usePressState } from '@daisu-ui/ui/utils';
import type { IconName } from '@daisu-ui/ui';

function IconTile({ name, onSelect }: { name: IconName; onSelect: (name: string) => void }) {
  const press = usePressState(true);
  return <view className={`demo-icon-item ${press.pressed ? 'demo-icon-item-pressed' : ''}`} accessibility-element accessibility-traits="button" accessibility-label={name} bindtouchstart={press.start} bindtouchend={press.end} bindtouchcancel={press.end} bindmousedown={press.start} bindmouseup={press.end} bindmouseleave={press.end} bindtap={() => { 'background only'; onSelect(name); }}><view className="demo-icon-glyph"><Icon name={name} size={24} /></view><text className="demo-icon-name">{name}</text></view>;
}

export function IconExample() {
  const [keyword, setKeyword] = useState('');
  const [selected, setSelected] = useState('');
  const categories = iconCategories.map(category => ({ ...category, names: category.names.filter(name => name.toLowerCase().includes(keyword.trim().toLowerCase())) })).filter(category => category.names.length);
  useEffect(() => {
    if (!selected) return;
    const timer = setTimeout(() => setSelected(''), 1500);
    return () => clearTimeout(timer);
  }, [selected]);
  return <view className="demo-icon-page">
    <view className="demo-icon-search"><view className="demo-icon-search-field"><Icon name="search-line" size={16} color="#4e5369" /><SyncedInput className={`demo-icon-search-input ${keyword ? '' : 'demo-icon-search-input-empty'}`} value={keyword} placeholder="搜你所想" onInput={setKeyword} />{keyword ? <Icon name="close-circle-fill" size={16} accessibilityLabel="清空搜索" onTap={() => { 'background only'; setKeyword(''); }} /> : null}</view></view>
    <scroll-view className="demo-icon-scroll" scroll-y scroll-orientation="vertical">
    {categories.map(category => <view key={category.title} className="demo-icon-category"><text className="demo-icon-category-title">{category.title}</text><view className="demo-icon-grid">{category.names.map(name => <IconTile key={name} name={name} onSelect={setSelected} />)}</view></view>)}
    {!categories.length ? <view className="demo-icon-empty"><Icon name="search-line" size={64} /><text>当前无相关图标</text></view> : null}
    </scroll-view>
    {selected ? <view className="demo-icon-notice" user-interaction-enabled={false}><text>{`<Icon name="${selected}" size={24} />`}</text></view> : null}
  </view>;
}
