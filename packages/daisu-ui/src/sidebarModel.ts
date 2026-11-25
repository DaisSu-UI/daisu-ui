export type SidebarValue = string | number;
export type SidebarBeforeChange = (value: SidebarValue) => boolean | Promise<boolean>;

/** Confirmation is invalidated by another tap, new props or unmounting. */
export function createSidebarGuard() {
  let sequence = 0;
  return {
    cancel() { 'background only'; sequence++; },
    async request(value: SidebarValue, before: SidebarBeforeChange | undefined, commit: () => void) {
      'background only';
      const request = ++sequence;
      try {
        const result = before ? before(value) : true;
        const allowed = typeof result === 'boolean' ? result : await result;
        if (allowed === true && request === sequence) commit();
      } catch { /* Rejected confirmations leave the selection unchanged. */ }
    },
  };
}

export function sidebarBadge(value: string | number | undefined, max = 99): string {
  if (value === undefined || value === '') return '';
  const ceiling = Number.isFinite(max) ? Math.max(0, max) : 99;
  return Number.isFinite(Number(value)) && Number(value) > ceiling ? `${ceiling}+` : String(value);
}
