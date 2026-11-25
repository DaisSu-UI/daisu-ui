declare module 'jsbarcode/bin/barcodes/index.js' {
  export type Encoding = { data: string; text?: string; options?: { height?: number } };
  export type Encoder = new (value: string, options: Record<string, unknown>) => { valid(): boolean; encode(): Encoding | Encoding[] };
  const encoders: Record<string, Encoder>;
  export default encoders;
}
