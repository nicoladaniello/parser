import Parser from "../Parser";

describe("Parser", () => {
  const parser = new Parser();

  test("should support multiple statements", () => {
    const program = `
    
    /**
     * Documentation comment:
     */
    "Hello";

    // Number
    42;
    
    `;
    const ast = parser.parse(program);

    expect(ast).toEqual({
      type: "Program",
      body: [
        {
          type: "ExpressionStatement",
          expression: { type: "StringLiteral", value: "Hello" },
        },
        {
          type: "ExpressionStatement",
          expression: { type: "NumericLiteral", value: 42 },
        },
      ],
    });
  });

  test("should support empty statements", () => {
    const program = `
    ;
    `;
    const ast = parser.parse(program);

    expect(ast).toEqual({
      type: "Program",
      body: [{ type: "EmptyStatement" }],
    });
  });
});
