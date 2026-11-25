export type TabbarValue = string | number;
export type TabbarBeforeChange = (value: TabbarValue) => boolean | Promise<boolean>;

/** Only the latest request may commit; false, rejection and disposal cancel it. */
export function createTabbarGuard() {
  let sequence = 0;
  return {
    cancel() { 'background only'; sequence++; },
    async request(value: TabbarValue, before: TabbarBeforeChange | undefined, commit: () => void) {
      'background only';
      const request = ++sequence;
      try {
        const result = before ? before(value) : true;
        const allowed = typeof result === 'boolean' ? result : await result;
        if (allowed && request === sequence) commit();
      } catch { /* A failed confirmation must leave the selection unchanged. */ }
    },
  };
}

export function tabbarBadge(value: string | number | undefined, max = 99): string {
  if (value === undefined || value === '') return '';
  const ceiling = Number.isFinite(max) ? Math.max(0, max) : 99;
  return typeof value === 'number' && value > ceiling ? `${ceiling}+` : String(value);
}
