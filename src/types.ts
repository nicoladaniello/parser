export type Token = {
  type: string;
  value?: string | number;
  expression?: Token;
  body?: Token[];
};
