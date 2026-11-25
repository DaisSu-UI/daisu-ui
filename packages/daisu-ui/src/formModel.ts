export type FormModel = Record<string, unknown>;
export type FormSchemaIssue = { path: string | readonly (string | number)[]; message: string };
export type FormSchema = { validate: (model: FormModel) => readonly FormSchemaIssue[] | Promise<readonly FormSchemaIssue[]>; isRequired?: (path: string) => boolean | undefined };
export type FormError = { prop: string; message: string };
export type FormValidateResult = { valid: boolean; errors: FormError[]; outOfDate?: boolean };
export type FormValidateTrigger = 'submit' | 'change' | 'blur';
export const formPath = (path: FormSchemaIssue['path']) => Array.isArray(path) ? path.map(String).join('.') : String(path).replace(/\[(\d+)\]/g, '.$1');
export const includesFormPath = (parent: string, child: string) => parent === child || child.startsWith(`${parent}.`);
export function formValue(model: unknown, path: string): unknown { return formPath(path).split('.').reduce<unknown>((value, key) => value !== null && typeof value === 'object' ? (value as FormModel)[key] : undefined, model); }
export function copyFormValue<T>(value: T): T { if (Array.isArray(value)) return value.map(copyFormValue) as T; if (value instanceof Date) return new Date(value.getTime()) as T; if (value && typeof value === 'object') return Object.fromEntries(Object.entries(value).map(([key, child]) => [key, copyFormValue(child)])) as T; return value; }
export function equalFormValue(a: unknown, b: unknown): boolean { if (Object.is(a, b)) return true; if (a instanceof Date && b instanceof Date) return a.getTime() === b.getTime(); if (!a || !b || typeof a !== 'object' || typeof b !== 'object' || Array.isArray(a) !== Array.isArray(b)) return false; const keys = Object.keys(a); return keys.length === Object.keys(b).length && keys.every(key => Object.prototype.hasOwnProperty.call(b, key) && equalFormValue((a as FormModel)[key], (b as FormModel)[key])); }
/** Structural adapter: Zod stays an optional application dependency. */
export function zodAdapter(schema: { safeParseAsync: (model: unknown) => Promise<{ success: boolean; error?: { issues: readonly { path: readonly PropertyKey[]; message: string }[] } }> }, options?: FormSchema['isRequired'] | { isRequired?: FormSchema['isRequired'] }): FormSchema {
  const isRequired = typeof options === 'function' ? options : options?.isRequired;
  return { isRequired, async validate(model) { const result = await schema.safeParseAsync(model); return result.success ? [] : (result.error?.issues ?? []).map(issue => ({ path: issue.path.map(String), message: issue.message })); } };
}
