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

  isEOF() {
    return this._cursor === this._string.length;
  }

  /**
   * Return next token and move cursor.
   */
  getNextToken(): Token | null {
    if (!this.hasMoreTokens()) return null;

    const string = this._string.slice(this._cursor);

    let matched = /^\d+/.exec(string);

    if (matched) {
      this._cursor += matched[0].length;
      return { type: "NUMBER", value: matched[0] };
    }

    matched = /"[^"]*"/.exec(string);

    if (matched) {
      this._cursor += matched[0].length;

      return { type: "STRING", value: matched[0] };
    }

    matched = /'[^']*'/.exec(string);

    if (matched) {
      this._cursor += matched[0].length;

      return { type: "STRING", value: matched[0] };
    }

    return null;
  }
}
