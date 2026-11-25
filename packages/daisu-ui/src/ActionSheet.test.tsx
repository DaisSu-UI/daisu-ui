import { expect, test } from '@rstest/core';
import { cleanup, fireEvent, render, waitFor } from '@lynx-js/react/testing-library';
import { ActionSheet } from './ActionSheet.js';
import type { ActionSheetSelection } from './ActionSheet.js';

test('ActionSheet ignores inactive items, supports keeping open, cancellation and close requests', async () => {
  const selections: ActionSheetSelection[] = []; const events: string[] = [];
  const actions = [{ name: '颜色' }, { name: '禁用', disabled: true }, { loading: true }];
  try {
    const screen = render(<ActionSheet show duration={0} actions={actions} cancelText="取消" closeOnClickAction={false} onSelect={e => selections.push(e)} onChange={() => events.push('change')} onCancel={() => events.push('cancel')} onClose={() => events.push('close')} />);
    await waitFor(() => expect(screen.container.querySelectorAll('.ui-action-sheet-action')).toHaveLength(3));
    const items = screen.container.querySelectorAll('.ui-action-sheet-action');
    fireEvent.tap(items[1]!); fireEvent.tap(items[2]!); expect(selections).toEqual([]);
    fireEvent.tap(items[0]!); expect(selections).toEqual([{ item: actions[0], index: 0 }]); expect(events).toEqual([]);
    fireEvent.tap(screen.container.querySelector('.ui-action-sheet-cancel')!); expect(events).toEqual(['cancel', 'change', 'close']);
  } finally { cleanup(); }
});

test('ActionSheet emits original row/column coordinates and custom children replace generated items', async () => {
  const selections: ActionSheetSelection[] = []; const panel = { title: '图片', icon: 'file-image' };
  try {
    const screen = render(<ActionSheet show duration={0} panels={[[{ title: '分享' }], [panel]]} onSelect={e => selections.push(e)} />);
    await waitFor(() => expect(screen.container.querySelectorAll('.ui-action-sheet-panel')).toHaveLength(2));
    fireEvent.tap(screen.container.querySelectorAll('.ui-action-sheet-panel')[1]!);
    expect(selections).toEqual([{ item: panel, rowIndex: 1, colIndex: 0 }]);
    screen.rerender(<ActionSheet show panels={[[panel]]}><text>自定义</text></ActionSheet>);
    expect(screen.getByText('自定义')).toBeTruthy(); expect(screen.container.querySelector('.ui-action-sheet-panel')).toBeNull();
  } finally { cleanup(); }
});
