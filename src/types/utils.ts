export type KeyMap = { [K: string]: any }
export type R<T> = T extends (...rest: any[]) => infer I ? I : never
export type A1<T> = T extends (a1: infer I, ...rest: any[]) => any ? I : never
export type A2<T> = T extends (a1: any, a2: infer I, ...rest: any[]) => any
  ? I
  : never
export type ReturnVoid<T> = R<T> extends void ? void : never

// ______________________________________________________

export type DiffKey<
  T extends string | number | symbol,
  U extends string | number | symbol
> = ({ [P in T]: P } & { [P in U]: never } & { [x: string]: never })[T]

export type HasKeysDiff<T, M> = DiffKey<keyof M, keyof T> extends never
  ? false
  : DiffKey<keyof T, keyof M> extends never
  ? false
  : true
