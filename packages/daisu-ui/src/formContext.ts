import { createContext } from '@lynx-js/react';
export type FormFieldState = { disabled: boolean; compact: boolean; error: boolean; onBlur: () => void };
export const FormFieldContext = createContext<FormFieldState | undefined>(undefined);
