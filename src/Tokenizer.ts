import { Token } from "./types";

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

  /**
   * Return next token.
   */
  getNextToken(): Token | null {
    if (!this.hasMoreTokens()) return null;

    const string = this._string.slice(this._cursor);

    if (!Number.isNaN(string[0])) {
      let value = "";

      while (!Number.isNaN(Number(string[this._cursor]))) {
        value += string[this._cursor++];
      }

      return { type: "NUMBER", value };
    }

    return null;
  }
}
