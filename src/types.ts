type Literal = string | number;

export type Token = {
  type: string;
  value?: string | number;
  expression?: Token;
  body?: Token[];
  operator?: string;
  left?: Literal | Token;
  right?: Literal | Token;
};
