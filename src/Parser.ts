import Tokenizer from "./Tokenizer";
import { Token } from "./types";

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
  Program() {
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
  StatementList(stopLookAhead: string | null = null): Token[] {
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
   *  ;
   */
  Statement(): Token {
    switch (this._lookahead?.type) {
      case "{":
        return this.BlockStatement();

      case ";":
        return this.EmptyStatement();

      default:
        return this.ExpressionStatement();
    }
  }

  /**
   * EmptyStatement
   *  : ';'
   *  ;
   */
  EmptyStatement(): Token {
    this._eat(";");

    return { type: "EmptyStatement" };
  }

  /**
   * BlockStatement
   *  : '{' OptStatementList '}'
   *  ;
   */
  BlockStatement(): Token {
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
  ExpressionStatement(): Token {
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
   *  | AdditiveExpression
   *  ;
   */
  Expression(): Token {
    return this.AdditiveExpression();
  }

  /**
   * AdditiveExpression
   *  : MultiplicativeExpression
   *  | AdditiveExpression ADDITIVE_OPERATOR MultiplicativeExpression
   *  ;
   */
  AdditiveExpression() {
    let left = this.MultiplicativeExpression();

    while (this._lookahead?.type === "ADDITIVE_OPERATOR") {
      const operator = this._eat("ADDITIVE_OPERATOR").value?.toString();
      const right = this.MultiplicativeExpression();

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
   * MultiplicativeExpression
   *  : PrimaryExpression
   *  | AdditiveExpression MULTIPLICATIVE_OPERATOR PrimaryExpression
   *  ;
   */
  MultiplicativeExpression() {
    let left = this.PrimaryExpression();

    while (this._lookahead?.type === "MULTIPLICATIVE_OPERATOR") {
      const operator = this._eat("MULTIPLICATIVE_OPERATOR").value?.toString();
      const right = this.PrimaryExpression();

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
   * PrimaryExpression
   *  : Literal
   *  ;
   */
  PrimaryExpression() {
    return this.Literal();
  }

  /**
   * Literal
   *  : NumericLiteral
   *  | StringLiteral
   *  ;
   */
  Literal() {
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
  StringLiteral(): Token {
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
  NumericLiteral(): Token {
    const token = this._eat("NUMBER");

    return {
      type: "NumericLiteral",
      value: Number(token.value),
    };
  }

  /**
   * Consume current token.
   */
  private _eat(tokenType: string) {
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
