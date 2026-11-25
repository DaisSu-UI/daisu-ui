import { forwardRef } from '@lynx-js/react';
import { TextField } from './TextField.js';
import type { TextFieldProps, TextFieldRef } from './TextField.js';
export type TextareaProps = Omit<TextFieldProps, 'suffixIcon' | 'suffix'> & {
  autoHeight?: boolean; height?: number; minHeight?: number; maxHeight?: number; maxlines?: number;
  onLineChange?: (event: { lineCount: number }) => void;
};
export type TextareaRef = TextFieldRef;
export const Textarea = forwardRef<TextareaRef, TextareaProps>(function Textarea(props, ref) { return <TextField {...props} ref={ref} multiline />; });
