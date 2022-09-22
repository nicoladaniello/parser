import Parser from "../Parser";

describe("Parser", () => {
  const parser = new Parser();

  test("should skip single-line comments", () => {
    const program = `
        // Number
        42;
    `;
    const ast = parser.parse(program);

    expect(ast).toEqual({
      type: "Program",
      body: [
        {
          type: "ExpressionStatement",
          expression: { type: "NumericLiteral", value: 42 },
        },
      ],
    });
  });

  test("should skip multi-line comments", () => {
    const program = `
        /**
         * Documentation comment:
         */
        "Hello";
    `;
    const ast = parser.parse(program);

    expect(ast).toEqual({
      type: "Program",
      body: [
        {
          type: "ExpressionStatement",
          expression: { type: "StringLiteral", value: "Hello" },
        },
      ],
    });
  });
});
