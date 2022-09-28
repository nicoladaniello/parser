import { AST } from "./types";

export default {
  NumericLiteral(value: number): AST {
    return {
      type: "NumericLiteral",
      value,
    };
  },
  StringLiteral(value: string): AST {
    return {
      type: "StringLiteral",
      value,
    };
  },
  AssignmentExpression(operator: string, left: AST, right: AST): AST {
    return {
      type: "AssignmentExpression",
      operator,
      left,
      right,
    };
  },
  BinaryExpression(operator: string, left: AST, right: AST): AST {
    return {
      type: "BinaryExpression",
      operator,
      left,
      right,
    };
  },
  Identifier(name: string): AST {
    return {
      type: "Identifier",
      name,
    };
  },
  ExpressionStatement(expression: AST): AST {
    return {
      type: "ExpressionStatement",
      expression,
    };
  },
  BlockStatement(body: AST): AST {
    return {
      type: "BlockStatement",
      body,
    };
  },
  EmptyStatement(): AST {
    return {
      type: "EmptyStatement",
    };
  },
  VariableDeclaration(id: AST, init: AST | null = null): AST {
    return {
      type: "VariableDeclaration",
      id,
      init,
    };
  },
  VariableStatement(declarations: AST): AST {
    return {
      type: "VariableStatement",
      declarations,
    };
  },
  Program(body: AST): AST {
    return {
      type: "Program",
      body,
    };
  },
  IfStatement(test: AST, consequent: AST, alternate: AST | null = null): AST {
    return {
      type: "IfStatement",
      test,
      consequent,
      alternate,
    };
  },
};