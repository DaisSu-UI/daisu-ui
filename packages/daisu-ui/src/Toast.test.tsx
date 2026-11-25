import { expect, test } from '@rstest/core';
import { cleanup, fireEvent, render, waitFor } from '@lynx-js/react/testing-library';
import { Toast } from './Toast.js';
import { useToast } from './useToast.js';

test('Toast call options override component defaults and reuse public Loading and Icon', async () => {
  try {
    const screen = render(<Toast show duration={0} direction="vertical" msg="默认" iconName="success" options={{ direction: 'horizontal', msg: '本次', iconName: 'loading', loadingType: 'dots', loadingSize: 30 }} />);
    await waitFor(() => expect(screen.container.querySelector('.ui-toast-horizontal')).toBeTruthy());
    expect(screen.queryByText('默认')).toBeNull(); expect(screen.getByText('本次')).toBeTruthy();
    expect(screen.container.querySelector('.ui-loading-spinner-dots')?.getAttribute('style')).toContain('30px');
    screen.rerender(<Toast show duration={0} iconName="error" cover options={{ iconClass: 'star', iconColor: '#ff0000' }} />);
    expect(screen.container.querySelector('.ui-icon-svg')?.getAttribute('content')).toContain('#ff0000');
    expect(screen.container.querySelector('.ui-overlay')).toBeTruthy();
  } finally { cleanup(); }
});

test('useToast replaces messages, cancels old timers and keeps loading open until closed', async () => {
  function Demo() {
    const toast = useToast();
    return <><view className="first" bindtap={() => toast.show({ msg: 'first', duration: 80 })} /><view className="loading" bindtap={() => toast.loading('waiting')} /><view className="close" bindtap={toast.close} /><Toast {...toast.props} /></>;
  }
  try {
    const screen = render(<Demo />);
    fireEvent.tap(screen.container.querySelector('.first')!);
    await waitFor(() => expect(screen.getByText('first')).toBeTruthy());
    fireEvent.tap(screen.container.querySelector('.loading')!);
    await new Promise(resolve => setTimeout(resolve, 130));
    expect(screen.getByText('waiting')).toBeTruthy();
    expect(screen.container.querySelector('.ui-transition-fade-leave-from')).toBeNull();
    fireEvent.tap(screen.container.querySelector('.close')!);
    await waitFor(() => expect(screen.container.querySelector('.ui-toast')?.getAttribute('style')).toContain('display: none'));
  } finally { cleanup(); }
});

test('Toast auto-closes once, emits animation callbacks and isolates separate hook instances', async () => {
  const events: string[] = [];
  function Demo() {
    const first = useToast(), second = useToast();
    return <><view className="open" bindtap={() => { first.show({ msg: 'first', duration: 300 }); second.info({ msg: 'second', duration: 0 }); }} /><Toast {...first.props} opened={() => events.push('opened')} closed={() => events.push('closed')} /><Toast {...second.props} /></>;
  }
  try {
    const screen = render(<Demo />);
    fireEvent.tap(screen.container.querySelector('.open')!);
    await waitFor(() => expect(events).toEqual(['opened', 'closed']));
    expect(screen.container.querySelectorAll('.ui-toast')[0]?.getAttribute('style')).toContain('display: none');
    expect(screen.container.querySelectorAll('.ui-toast')[1]?.getAttribute('style')).toContain('display: flex');
  } finally { cleanup(); }
});
