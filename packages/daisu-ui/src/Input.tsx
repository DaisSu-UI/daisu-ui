import { forwardRef } from '@lynx-js/react';
import { TextField } from './TextField.js';
import type { TextFieldProps, TextFieldRef } from './TextField.js';
export type InputProps = TextFieldProps & { type?: 'text' | 'number' | 'digit' | 'password' | 'tel' | 'email'; showPassword?: boolean };
export type InputRef = TextFieldRef;
export const Input = forwardRef<InputRef, InputProps>(function Input(props, ref) { return <TextField {...props} ref={ref} />; });
export type { TextFieldEvent } from './TextField.js';
