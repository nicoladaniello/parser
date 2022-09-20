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
      body: this.NumericLiteral(),
    };
  }

  /**
   * NumericLiteral
   *  : NUMBER
   *  ;
   */
  NumericLiteral() {
    const token = this._eat("NUMBER");

    return {
      type: "NumericLiteral",
      value: Number(token.value),
    };
  }

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
