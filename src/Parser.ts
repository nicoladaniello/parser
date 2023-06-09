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
   *  | IfStatement
   *  | IterationStatement
   *  | FunctionStatement
   *  | ReturnStatement
   *  | ClassDeclaration
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

      case "while":
      case "do":
      case "for": {
        return this.IterationStatement();
      }

      case "def": {
        return this.FunctionStatement();
      }

      case "return": {
        return this.ReturnStatement();
      }

      case "class": {
        return this.ClassDeclaration();
      }

      default:
        return this.ExpressionStatement();
    }
  }

  /**
   * ClassDeclaration
   *  : 'class' Identifier OptClassExtends BlockStatement
   *  |
   */
  ClassDeclaration() {
    this._eat("class");
    const id = this.Identifier();
    const superClass =
      this._lookahead?.type === "extends" ? this.ClassExtends() : null;
    const body = this.BlockStatement();

    return Factory.ClassDeclaration(id, superClass, body);
  }

  /**
   * ClassExtends
   *  : 'extends' Identifier
   *  ;
   */
  ClassExtends() {
    this._eat("extends");
    return this.Identifier();
  }

  /**
   * FunctionStatement
   *  : 'def' Identifier '(' OptFormalParameterList ')' BlockStatement
   *  ;
   */
  FunctionStatement() {
    this._eat("def");
    const name = this.Identifier();
    this._eat("(");
    const params =
      this._lookahead?.type !== ")" ? this.FormalParameterList() : null;
    this._eat(")");
    const body = this.BlockStatement();

    return Factory.FunctionDeclaration(name, params, body);
  }

  /**
   * FormalParameterList
   *  : Identifier
   *  | FormalParameterList ',' Identifier
   */
  FormalParameterList() {
    const params = [];

    do {
      params.push(this.Identifier());
    } while (this._lookahead?.type === "," && this._eat(","));

    return params;
  }

  /**
   * ReturnStatement
   *  : 'return' OptExpression ';'
   *  ;
   */
  ReturnStatement() {
    this._eat("return");
    const argument = this._lookahead?.type !== ";" ? this.Expression() : null;
    this._eat(";");

    return Factory.ReturnStatement(argument);
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
   * IterationStatement
   *  : WhileStatement
   *  | DoWhileStatement
   *  | ForStatement
   *  ;
   */
  IterationStatement(): AST {
    switch (this._lookahead?.type) {
      case "while": {
        return this.WhileStatement();
      }

      case "do": {
        return this.DoWhileStatement();
      }

      case "for": {
        return this.ForStatement();
      }

      default:
        throw `Unexpected iteration statement: "${this._lookahead?.value}"`;
    }
  }

  /**
   * WhileStatement
   *  : 'while' '(' Expression ')' Statement
   *  ;
   */
  WhileStatement() {
    this._eat("while");
    this._eat("(");
    const test = this.Expression();
    this._eat(")");
    const body = this.Statement();

    return Factory.WhileStatement(test, body);
  }

  /**
   * DoWhileStatement
   *  : 'do' Statement 'while' '(' Expression ')' ';'
   *  ;
   */
  DoWhileStatement() {
    this._eat("do");
    const body = this.Statement();
    this._eat("while");
    this._eat("(");
    const test = this.Expression();
    this._eat(")");
    this._eat(";");

    return Factory.DoWhileStatement(test, body);
  }

  /**
   * ForStatement
   *  : 'for' '(' OptForStatementInit OptExpression OptExpression  ')' Statement
   *  ;
   */
  ForStatement() {
    this._eat("for");
    this._eat("(");

    const init =
      this._lookahead?.type !== ";" ? this.OptForStatementInit() : null;
    this._eat(";");

    const test = this._lookahead?.type !== ";" ? this.Expression() : null;
    this._eat(";");

    const update = this._lookahead?.type !== ")" ? this.Expression() : null;
    this._eat(")");

    const body = this.Statement();

    return Factory.ForStatement(init, test, update, body);
  }

  /**
   * OptForStatementInit
   *  : VariableStatementInit
   *  | Expression
   *  ;
   */
  OptForStatementInit() {
    if (this._lookahead?.type === "let") {
      return this.VariableStatementInit();
    }
    return this.Expression();
  }

  /**
   * VariableStatementInit
   *  : 'let' VariableDeclarationList
   *  ;
   */
  VariableStatementInit() {
    this._eat("let");
    const declarations = this.VariableDeclarationList();

    return Factory.VariableStatement(declarations);
  }

  /**
   * VariableStatement
   *  : VariableStatementInit ';'
   *  ;
   */
  VariableStatement() {
    const variableStatement = this.VariableStatementInit();
    this._eat(";");
    return variableStatement;
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
   *  : LogicalORExpression
   *  | LeftHandSideExpression ASSIGNMENT_OPERATOR AssignmentExpression
   */
  AssignmentExpression(): AST {
    const left = this.LogicalORExpression();

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
   * LogicalORExpression
   *  : LogicalANDExpression
   *  | LogicalANDExpression LOGICAL_OR LogicalORExpression
   */
  LogicalORExpression() {
    return this._LogicalExpression(
      this.LogicalANDExpression.bind(this),
      "LOGICAL_OR"
    );
  }

  /**
   * LogicalANDExpression
   *  : EqualityExpression
   *  | EqualityExpression LOGICAL_AND LogicalANDExpression
   */
  LogicalANDExpression() {
    return this._LogicalExpression(
      this.EqualityExpression.bind(this),
      "LOGICAL_AND"
    );
  }

  /**
   * EqualityExpression
   *  : RelationalExpression
   *  | RelationalExpression EQUALITY_OPERATOR EqualityExpression
   *  ;
   */
  EqualityExpression() {
    return this._BinaryExpression(
      this.RelationalExpression.bind(this),
      "EQUALITY_OPERATOR"
    );
  }

  /**
   * RelationalExpression
   *  : AdditiveExpression
   *  | AdditiveExpression RELATIONAL_OPERATOR AdditiveExpression
   *  ;
   */
  RelationalExpression() {
    return this._BinaryExpression(
      this.AdditiveExpression.bind(this),
      "RELATIONAL_OPERATOR"
    );
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
   *  : UnaryExpression
   *  | AdditiveExpression MULTIPLICATIVE_OPERATOR UnaryExpression
   *  ;
   */
  MultiplicativeExpression() {
    return this._BinaryExpression(
      this.UnaryExpression.bind(this),
      "MULTIPLICATIVE_OPERATOR"
    );
  }

  /**
   * UnaryExpression
   *  : LeftHandSideExpression
   *  | ADDITIVE_OPERATOR UnaryExpression
   *  | LOGICAL_NOT UnaryExpression
   *  ;
   */
  UnaryExpression(): AST {
    let operator: string | null = null;

    switch (this._lookahead?.type) {
      case "ADDITIVE_OPERATOR":
        operator = this._eat("ADDITIVE_OPERATOR").value as string;
        break;

      case "LOGICAL_NOT":
        operator = this._eat("LOGICAL_NOT").value as string;
        break;
    }

    if (operator !== null) {
      return Factory.UnaryExpression(operator, this.UnaryExpression());
    }

    return this.LeftHandSideExpression();
  }

  /**
   * LeftHandSideExpression
   *  : CallMemberExpression
   *  ;
   */
  LeftHandSideExpression() {
    return this.CallMemberExpression();
  }

  /**
   * CallMemberExpression
   *  : MemberExpression
   *  | CallExpression
   *  ;
   */
  CallMemberExpression() {
    // Super call
    if (this._lookahead?.type === "super") {
      return this._CallExpression(this.SuperExpression());
    }

    const member = this.MemberExpression();

    if (this._lookahead?.type === "(") {
      return this._CallExpression(member);
    }

    return member;
  }

  /**
   * MemberExpression
   *  : PrimaryExpression
   *  | MemberExpression '.' Identifier
   *  | MemberExpression '[' Expression ']'
   *  ;
   */
  MemberExpression() {
    let object = this.PrimaryExpression();

    while (this._lookahead?.type === "." || this._lookahead?.type === "[") {
      if (this._lookahead?.type === ".") {
        this._eat(".");
        const property = this.Identifier();
        object = Factory.MemberExpression(false, object, property);
      }

      if (this._lookahead?.type === "[") {
        this._eat("[");
        const property = this.Expression();
        this._eat("]");
        object = Factory.MemberExpression(true, object, property);
      }
    }

    return object;
  }

  /**
   * PrimaryExpression
   *  : Literal
   *  | ParenthesizedExpression
   *  | Identifier
   *  | ThisExpression
   *  | NewExpression
   *  ;
   */
  PrimaryExpression(): AST {
    if (this._isLiteral(this._lookahead?.type)) {
      return this.Literal();
    }

    switch (this._lookahead?.type) {
      case "(":
        return this.ParenthesizedExpression();

      case "this":
        return this.ThisExpression();

      case "new":
        return this.NewExpression();

      default:
        return this.Identifier();
    }
  }

  /**
   * NewExpression
   *  : 'new' MemberExpression Arguments;
   *  ;
   */
  NewExpression() {
    this._eat("new");
    const callee = this.MemberExpression();
    const args = this.Arguments();

    return Factory.NewExpression(callee, args);
  }

  /**
   * ThisExpression
   *  : 'this'
   *  ;
   */
  ThisExpression() {
    this._eat("this");
    return Factory.ThisExpression();
  }

  /**
   * SuperExpression
   *  : 'super'
   *  ;
   */
  SuperExpression() {
    this._eat("super");
    return Factory.SuperExpression();
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
   *  | BooleanLiteral
   *  | NullLiteral
   *  ;
   */
  Literal() {
    switch (this._lookahead?.type) {
      case "NUMBER":
        return this.NumericLiteral();

      case "STRING":
        return this.StringLiteral();

      case "true":
        return this.BooleanLiteral(true);

      case "false":
        return this.BooleanLiteral(false);

      case "null":
        return this.NullLiteral();
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
   * BooleanLiteral
   *  : true
   *  | false
   *  ;
   */
  BooleanLiteral(value: boolean) {
    this._eat(String(value));
    return Factory.BooleanLiteral(value);
  }

  /**
   * BooleanLiteral
   *  : null
   *  ;
   */
  NullLiteral() {
    return Factory.NullLiteral();
  }

  /**
   * Generic CallExpression helper.
   *
   * CallExpression
   *  : Callee Arguments
   *  ;
   *
   * Callee
   *  : MemberExpression
   *  | CallExpression
   *  ;
   */
  private _CallExpression(callee: AST): AST {
    const args = this.Arguments();

    let callExpression: AST = Factory.CallExpression(callee, args);

    if (this._lookahead?.type === "(") {
      callExpression = this._CallExpression(callExpression);
    }

    return callExpression;
  }

  /**
   * Arguments
   *  : '(' OptArgumentList ')'
   *  ;
   */
  Arguments() {
    this._eat("(");
    const argumentList =
      this._lookahead?.type !== ")" ? this.ArgumentList() : [];
    this._eat(")");

    return argumentList;
  }

  /**
   * ArgumentList
   *  : AssignmentExpression
   *  | ArgumentList ',' AssignmentExpression
   *  ;
   */
  ArgumentList() {
    const args = [];

    do {
      args.push(this.AssignmentExpression());
    } while (this._lookahead?.type === "," && this._eat(","));

    return args;
  }

  /**
   * Validate assignment target.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private _checkValidAssignmentTarget(node: any) {
    if (node.type === "Identifier" || node.type === "MemberExpression") {
      return node;
    }

    throw new SyntaxError(`Invalid left-hand sign in assignment expression.`);
  }

  /**
   * Whether the token is a literal.
   */
  private _isLiteral(tokenType?: string) {
    return (
      tokenType === "NUMBER" ||
      tokenType === "STRING" ||
      tokenType === "true" ||
      tokenType === "false" ||
      tokenType === "null"
    );
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
   * LogicalExpression helper
   */
  private _LogicalExpression(builder: () => AST, operatorType: string) {
    let left = builder();

    while (this._lookahead?.type === operatorType) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const operator = this._eat(operatorType).value!.toString();
      const right = builder();

      left = Factory.LogicalExpression(operator, left, right);
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
