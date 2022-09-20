import Parser from "./Parser";

describe("Test Parser", () => {
  const parser = new Parser();

  test("NumberLiteral", () => {
    const program = "42;";
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

  test("StringLiteral with double quotes", () => {
    const program = '"Hello";';
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

  test("StringLiteral with single quotes", () => {
    const program = "'Hello';";
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

  test("Skip whitespaces", () => {
    const program = "    42    ;";
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

  test("Skip single-line comments", () => {
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

  test("Skip multi-line comments", () => {
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

  test("StatementList", () => {
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
});
