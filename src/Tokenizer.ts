import { Token } from "./types";

/**
 * Tokenizer spec.
 */
const Spec: [RegExp, string | null][] = [
  // Whitespace
  [/^\s+/, null], // skip whitespaces

  // Comments.
  [/^\/\/.*/, null], // skip single-line comment
  [/^\/\*[\s\S]*?\*\//, null], // skip multi-line comment

  // Symbols, delimiters.
  [/^;/, ";"],
  [/^\{/, "{"],
  [/^\}/, "}"],
  [/^\(/, "("],
  [/^\)/, ")"],

  // Numbers.
  [/^\d+/, "NUMBER"],

  // Identifiers
  [/^\w+/, "IDENTIFIER"],

  // Assignment operators
  [/^=/, "SIMPLE_ASSIGN"],
  [/^[*/+-]=/, "COMPLEX_ASSIGN"],

  // Math operators
  [/^[+-]/, "ADDITIVE_OPERATOR"],
  [/^[*/]/, "MULTIPLICATIVE_OPERATOR"],

  // Strings.
  [/"[^"]*"/, "STRING"],
  [/'[^']*'/, "STRING"],
];

export default class Tokenizer {
  private _string = "";
  private _cursor = 0;

  /**
   * Initialise the string.
   */
  init(string: string) {
    this._string = string;
    this._cursor = 0;
  }

  hasMoreTokens() {
    return this._cursor < this._string.length;
  }

  isEOF() {
    return this._cursor === this._string.length;
  }

  /**
   * Return next token and move cursor.
   */
  getNextToken(): Token | null {
    if (!this.hasMoreTokens()) return null;

    const string = this._string.slice(this._cursor);

    for (const [regExp, type] of Spec) {
      const value = this._match(regExp, string);

      if (!value) continue;

      // Skip token (e.g. whitespace).
      if (type === null) {
        return this.getNextToken();
      }

      return { type, value };
    }

    throw new SyntaxError(`Unexpected token "${string[0]}"`);
  }

  /**
   * Returns the matched token and moves the cursor forward.
   */
  private _match(regExp: RegExp, string: string) {
    const matched = regExp.exec(string);

    if (!matched) return null;

    this._cursor += matched[0].length;

    return matched[0];
  }
}
