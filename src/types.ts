export type AST =
  | null
  | string
  | number
  | boolean
  | AST[]
  | { [key: string]: AST };
