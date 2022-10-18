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
  BooleanLiteral(value: boolean): AST {
    return {
      type: "BooleanLiteral",
      value,
    };
  },
  NullLiteral(): AST {
    return {
      type: "NullLiteral",
      value: null,
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
  UnaryExpression(operator: string, argument: AST) {
    return {
      type: "UnaryExpression",
      operator,
      argument,
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
  LogicalExpression(operator: string, left: AST, right: AST): AST {
    return {
      type: "LogicalExpression",
      operator,
      left,
      right,
    };
  },
  MemberExpression(computed: boolean, object: AST, property: AST) {
    return {
      type: "MemberExpression",
      computed,
      object,
      property,
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
  WhileStatement(test: AST, body: AST): AST {
    return {
      type: "WhileStatement",
      test,
      body,
    };
  },
  DoWhileStatement(test: AST, body: AST): AST {
    return {
      type: "WhileStatement",
      test,
      body,
    };
  },
  ForStatement(init: AST, test: AST, update: AST, body: AST): AST {
    return {
      type: "ForStatement",
      init,
      test,
      update,
      body,
    };
  },
  FunctionDeclaration(name: AST, params: AST, body: AST): AST {
    return {
      type: "FunctionDeclaration",
      name,
      params,
      body,
    };
  },
  ReturnStatement(argument: AST): AST {
    return {
      type: "ReturnStatement",
      argument,
    };
  },
};
