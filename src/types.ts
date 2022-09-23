export type NumericLiteral = {
  type: "NumericLiteral";
  value: number;
};

export type StringLiteral = {
  type: "StringLiteral";
  value: string;
};

export type Literal = NumericLiteral | StringLiteral;

export type BinaryExpression = {
  type: string;
  operator: string;
  left: PrimaryExpression;
  right: PrimaryExpression;
};

export type Identifier = {
  type: "Identifier";
  name: string;
};

export type ExpressionStatement = {
  type: "ExpressionStatement";
  expression: PrimaryExpression;
};

export type BlockStatement = {
  type: "BlockStatement";
  body: Statement[];
};

export type EmptyStatement = {
  type: "EmptyStatement";
};

export type VariableDeclaration = {
  type: "VariableDeclaration";
  id: Identifier;
  init: PrimaryExpression | null;
};

export type VariableStatement = {
  type: "VariableStatement";
  declarations: VariableDeclaration[];
};

export type Statement =
  | BlockStatement
  | EmptyStatement
  | VariableStatement
  | ExpressionStatement;

export type Program = {
  type: "Program";
  body: Statement[];
};

export type PrimaryExpression = BinaryExpression | Literal | Identifier;
