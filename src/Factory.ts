import {
  BinaryExpression,
  BlockStatement,
  EmptyStatement,
  ExpressionStatement,
  Identifier,
  NumericLiteral,
  PrimaryExpression,
  Program,
  Statement,
  StringLiteral,
  VariableDeclaration,
  VariableStatement,
} from "./types";

export default {
  NumericLiteral(value: number): NumericLiteral {
    return {
      type: "NumericLiteral",
      value,
    };
  },
  StringLiteral(value: string): StringLiteral {
    return {
      type: "StringLiteral",
      value,
    };
  },
  AssignmentExpression(
    operator: string,
    left: PrimaryExpression,
    right: PrimaryExpression
  ): BinaryExpression {
    return {
      type: "AssignmentExpression",
      operator,
      left,
      right,
    };
  },
  BinaryExpression(
    operator: string,
    left: PrimaryExpression,
    right: PrimaryExpression
  ): BinaryExpression {
    return {
      type: "BinaryExpression",
      operator,
      left,
      right,
    };
  },
  Identifier(name: string): Identifier {
    return {
      type: "Identifier",
      name,
    };
  },
  ExpressionStatement(expression: PrimaryExpression): ExpressionStatement {
    return {
      type: "ExpressionStatement",
      expression,
    };
  },
  BlockStatement(body: Statement[]): BlockStatement {
    return {
      type: "BlockStatement",
      body,
    };
  },
  EmptyStatement(): EmptyStatement {
    return {
      type: "EmptyStatement",
    };
  },
  VariableDeclaration(
    id: Identifier,
    init: PrimaryExpression | null = null
  ): VariableDeclaration {
    return {
      type: "VariableDeclaration",
      id,
      init,
    };
  },
  VariableStatement(declarations: VariableDeclaration[]): VariableStatement {
    return {
      type: "VariableStatement",
      declarations,
    };
  },
  Program(body: Statement[]): Program {
    return {
      type: "Program",
      body,
    };
  },
};
