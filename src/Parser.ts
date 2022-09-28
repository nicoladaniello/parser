import Factory from "./Factory";
import Tokenizer, { Token } from "./Tokenizer";
import { AST } from "./types";

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
    return Factory.Program(this.StatementList());
  }

  /**
   * StatementList
   *  : Statement
   *  | StatementList Statement
   *  ;
   */
  StatementList(stopLookAhead: string | null = null): AST {
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
  Statement(): AST {
    switch (this._lookahead?.type) {
      case "{":
        return this.BlockStatement();

      case ";":
        return this.EmptyStatement();

      case "let":
        return this.VariableStatement();

      case "if": {
        return this.IfStatement();
      }

      default:
        return this.ExpressionStatement();
    }
  }

  /**
   * IfStatement
   *  : 'if' '(' Expression ')' Statement
   *  | 'if' '(' Expression ')' Statement 'else' Statement
   *  ;
   */
  IfStatement() {
    this._eat("if");
    this._eat("(");
    const test = this.Expression();
    this._eat(")");
    const consequent = this.Statement();

    const alternate =
      this._lookahead?.type === "else"
        ? this._eat("else") && this.Statement()
        : null;

    return Factory.IfStatement(test, consequent, alternate);
  }

  /**
   * VariableStatement
   *  : 'let' VariableDeclarationList ';'
   *  ;
   */
  VariableStatement() {
    this._eat("let");
    const declarations = this.VariableDeclarationList();
    this._eat(";");

    return Factory.VariableStatement(declarations);
  }

  /**
   * VariableDeclarationList
   *  : VariableDeclaration
   *  | VariableDeclarationList ',' VariableDeclaration
   *  ;
   */
  VariableDeclarationList() {
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
  VariableDeclaration() {
    const id = this.Identifier();

    const init =
      this._lookahead?.type !== "," && this._lookahead?.type !== ";"
        ? this.VariableInitializer()
        : null;

    return Factory.VariableDeclaration(id, init);
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
  EmptyStatement() {
    this._eat(";");

    return Factory.EmptyStatement();
  }

  /**
   * BlockStatement
   *  : '{' OptStatementList '}'
   *  ;
   */
  BlockStatement() {
    this._eat("{");

    const body = this._lookahead?.type !== "}" ? this.StatementList("}") : [];

    this._eat("}");

    return Factory.BlockStatement(body);
  }

  /**
   * ExpressionStatement
   *  : Expression ';'
   *  ;
   */
  ExpressionStatement() {
    const expression = this.Expression();
    this._eat(";");

    return Factory.ExpressionStatement(expression);
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
  AssignmentExpression(): AST {
    const left = this.AdditiveExpression();

    if (!this._isAssignmentOperator(this._lookahead?.type)) {
      return left;
    }

    return Factory.AssignmentExpression(
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      this.AssignmentOperator().value!.toString(),
      this._checkValidAssignmentTarget(left),
      this.AssignmentExpression()
    );
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
  Identifier() {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const name = this._eat("IDENTIFIER").value!.toString();

    return Factory.Identifier(name);
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
  AdditiveExpression() {
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
  MultiplicativeExpression() {
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
  PrimaryExpression(): AST {
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
  StringLiteral() {
    const token = this._eat("STRING");

    return Factory.StringLiteral(String(token.value).slice(1, -1));
  }

  /**
   * NumericLiteral
   *  : NUMBER
   *  ;
   */
  NumericLiteral() {
    const token = this._eat("NUMBER");

    return Factory.NumericLiteral(Number(token.value));
  }

  /**
   * Validate assignment target.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
  private _BinaryExpression(builder: () => AST, operatorType: string) {
    let left = builder();

    while (this._lookahead?.type === operatorType) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const operator = this._eat(operatorType).value!.toString();
      const right = builder();

      left = Factory.BinaryExpression(operator, left, right);
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
