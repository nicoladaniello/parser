import Parser from "../Parser";

describe("Parser", () => {
  const parser = new Parser();

  test("should support number literals", () => {
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

  test("should support string literals in double quotes", () => {
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

  test("should support string literals in single quotes", () => {
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

  test("should skip whitespaces", () => {
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
});
