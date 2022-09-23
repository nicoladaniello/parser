import Tokenizer, { Token } from "./Tokenizer";
import {
  BlockStatement,
  EmptyStatement,
  ExpressionStatement,
  Identifier,
  Literal,
  NumericLiteral,
  PrimaryExpression,
  Program,
  Statement,
  StringLiteral,
  VariableDeclaration,
  VariableStatement,
} from "./types";

/**
 * Recursive-descent parser implementation.
 */
export default class Parser {
  private _string: string;
  private _tokenizer: Tokenizer;
  private _lookahead: Token | null = null;

  constructor() {
    this._string = "";
    this._tokenizer = new Tokenizer();
  }

  /**
   * Parse a string into an AST.
   *
   * @param string
   */
  parse(string: string) {
    this._string = string;
    this._tokenizer.init(string);

    this._lookahead = this._tokenizer.getNextToken();

    // Parse recursively starting from the main entry point, the Program.

    return this.Program();
  }

  /**
   * Main entry point.
   *
   * Program
   *  : NumericLiteral
   *  ;
   */
  Program(): Program {
    return {
      type: "Program",
      body: this.StatementList(),
    };
  }

  /**
   * StatementList
   *  : Statement
   *  | StatementList Statement
   *  ;
   */
  StatementList(stopLookAhead: string | null = null): Statement[] {
    const statementList = [this.Statement()];

    while (this._lookahead && this._lookahead.type !== stopLookAhead) {
      statementList.push(this.Statement());
    }

    return statementList;
  }

  /**
   * Statement
   *  : ExpressionStatement
   *  | BlockStatement
   *  | EmptyStatement
   *  | VariableStatement
   *  ;
   */
  Statement(): Statement {
    switch (this._lookahead?.type) {
      case "{":
        return this.BlockStatement();

      case ";":
        return this.EmptyStatement();

      case "let":
        return this.VariableStatement();

      default:
        return this.ExpressionStatement();
    }
  }

  /**
   * VariableStatement
   *  : 'let' VariableDeclarationList ';'
   *  ;
   */
  VariableStatement(): VariableStatement {
    this._eat("let");
    const declarations = this.VariableDeclarationList();
    this._eat(";");

    return {
      type: "VariableStatement",
      declarations,
    };
  }

  /**
   * VariableDeclarationList
   *  : VariableDeclaration
   *  | VariableDeclarationList ',' VariableDeclaration
   *  ;
   */
  VariableDeclarationList(): VariableDeclaration[] {
    const declarations = [];

    do {
      declarations.push(this.VariableDeclaration());
    } while (this._lookahead?.type === "," && this._eat(","));

    return declarations;
  }

  /**
   * VariableDeclaration
   *  : Identifier OptVariableInitializer
   *  ;
   */
  VariableDeclaration(): VariableDeclaration {
    const id = this.Identifier();

    const init =
      this._lookahead?.type !== "," && this._lookahead?.type !== ";"
        ? this.VariableInitializer()
        : null;

    return {
      type: "VariableDeclaration",
      id,
      init,
    };
  }

  /**
   * VariableInitializer
   *  : SIMPLE_ASSIGN AssignmentExpression
   *  ;
   */
  VariableInitializer() {
    this._eat("SIMPLE_ASSIGN");

    return this.AssignmentExpression();
  }

  /**
   * EmptyStatement
   *  : ';'
   *  ;
   */
  EmptyStatement(): EmptyStatement {
    this._eat(";");

    return { type: "EmptyStatement" };
  }

  /**
   * BlockStatement
   *  : '{' OptStatementList '}'
   *  ;
   */
  BlockStatement(): BlockStatement {
    this._eat("{");

    const body = this._lookahead?.type !== "}" ? this.StatementList("}") : [];

    this._eat("}");

    return {
      type: "BlockStatement",
      body,
    };
  }

  /**
   * ExpressionStatement
   *  : Expression ';'
   *  ;
   */
  ExpressionStatement(): ExpressionStatement {
    const expression = this.Expression();
    this._eat(";");

    return {
      type: "ExpressionStatement",
      expression,
    };
  }

  /**
   * Expression
   *  : Literal
   *  ;
   */
  Expression() {
    return this.AssignmentExpression();
  }

  /**
   * AssignmentExpression
   *  : AdditiveExpression
   *  | LeftHandSideExpression AssignmentOperator AssignmentExpression
   */
  AssignmentExpression(): PrimaryExpression {
    const left = this.AdditiveExpression();

    if (!this._isAssignmentOperator(this._lookahead?.type)) {
      return left;
    }

    return {
      type: "AssignmentExpression",
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      operator: this.AssignmentOperator().value!.toString(),
      left: this._checkValidAssignmentTarget(left),
      right: this.AssignmentExpression(),
    };
  }

  /**
   * LeftHandSideExpression
   *  : Identifier
   *  ;
   */
  LeftHandSideExpression() {
    return this.Identifier();
  }

  /**
   * Identifier
   *  : INDENTIFIER
   *  ;
   */
  Identifier(): Identifier {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const name = this._eat("IDENTIFIER").value!.toString();

    return {
      type: "Identifier",
      name,
    };
  }

  /**
   * AssignmentOperator
   *  : SIMPLE_ASSIGN
   *  | COMPLEX_ASSIGN
   *  ;
   */
  AssignmentOperator() {
    if (this._lookahead?.type === "SIMPLE_ASSIGN") {
      return this._eat("SIMPLE_ASSIGN");
    } else {
      return this._eat("COMPLEX_ASSIGN");
    }
  }

  /**
   * AdditiveExpression
   *  : MultiplicativeExpression
   *  | AdditiveExpression ADDITIVE_OPERATOR MultiplicativeExpression
   *  ;
   */
  AdditiveExpression(): PrimaryExpression {
    return this._BinaryExpression(
      this.MultiplicativeExpression.bind(this),
      "ADDITIVE_OPERATOR"
    );
  }

  /**
   * MultiplicativeExpression
   *  : PrimaryExpression
   *  | AdditiveExpression MULTIPLICATIVE_OPERATOR PrimaryExpression
   *  ;
   */
  MultiplicativeExpression(): PrimaryExpression {
    return this._BinaryExpression(
      this.PrimaryExpression.bind(this),
      "MULTIPLICATIVE_OPERATOR"
    );
  }

  /**
   * PrimaryExpression
   *  : Literal
   *  | ParenthesizedExpression
   *  | LeftHandSideExpression
   *  ;
   */
  PrimaryExpression(): PrimaryExpression {
    if (this._isLiteral(this._lookahead?.type)) {
      return this.Literal();
    }

    switch (this._lookahead?.type) {
      case "(":
        return this.ParenthesizedExpression();

      default:
        return this.LeftHandSideExpression();
    }
  }

  /**
   * ParenthesizedExpression
   *  : '(' Expression ')'
   */
  ParenthesizedExpression() {
    this._eat("(");
    const expression = this.Expression();
    this._eat(")");

    return expression;
  }

  /**
   * Literal
   *  : NumericLiteral
   *  | StringLiteral
   *  ;
   */
  Literal(): Literal {
    switch (this._lookahead?.type) {
      case "NUMBER":
        return this.NumericLiteral();

      case "STRING":
        return this.StringLiteral();
    }

    throw new SyntaxError("Literal: unexpected literal production.");
  }

  /**
   * StringLiteral
   *  : STRING
   *  ;
   */
  StringLiteral(): StringLiteral {
    const token = this._eat("STRING");

    return {
      type: "StringLiteral",
      value: String(token.value).slice(1, -1), // strip string qutes.
    };
  }

  /**
   * NumericLiteral
   *  : NUMBER
   *  ;
   */
  NumericLiteral(): NumericLiteral {
    const token = this._eat("NUMBER");

    return {
      type: "NumericLiteral",
      value: Number(token.value),
    };
  }

  /**
   * Validate assignment target.
   */
  private _checkValidAssignmentTarget(node: any) {
    if (node.type === "Identifier") {
      return node;
    }

    throw new SyntaxError(`Invalid left-hand sign in assignment expression.`);
  }

  /**
   * Whether the token is a literal.
   */
  private _isLiteral(tokenType?: string) {
    return tokenType === "NUMBER" || tokenType === "STRING";
  }

  /**
   * Whether the token is an assignment operator (e.g. =, +=, *= etc.).
   */
  private _isAssignmentOperator(type?: string) {
    return type === "SIMPLE_ASSIGN" || type === "COMPLEX_ASSIGN";
  }

  /**
   * BinaryExpression helper
   */
  private _BinaryExpression(
    builder: () => PrimaryExpression,
    operatorType: string
  ) {
    let left = builder();

    while (this._lookahead?.type === operatorType) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const operator = this._eat(operatorType).value!.toString();
      const right = builder();

      left = {
        type: "BinaryExpression",
        operator,
        left,
        right,
      };
    }

    return left;
  }

  /**
   * Consume current token.
   */
  private _eat(tokenType: string): Token {
    const token = this._lookahead;

    if (token == null) {
      throw new Error(`Unexpected end of input, expected: "${tokenType}"`);
    }

    if (token.type !== tokenType) {
      throw new Error(
        `Unexpected token "${token.value}", expected: "${tokenType}"`
      );
    }

    // Advance to next token.
    this._lookahead = this._tokenizer.getNextToken();

    return token;
  }
}
