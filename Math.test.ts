import Parser from "./src/Parser";

describe("Parse math expressions", () => {
  const parser = new Parser();

  test("2 + 2;", () => {
    const program = "2 + 2;";
    const ast = parser.parse(program);

    expect(ast).toEqual({
      type: "Program",
      body: [
        {
          type: "ExpressionStatement",
          expression: {
            type: "BinaryExpression",
            operator: "+",
            left: {
              type: "NumericLiteral",
              value: 2,
            },
            right: {
              type: "NumericLiteral",
              value: 2,
            },
          },
        },
      ],
    });
  });

  // Nested binary
  test("3 + 2 - 2;", () => {
    const program = "3 + 2 - 2;";
    const ast = parser.parse(program);

    expect(ast).toEqual({
      type: "Program",
      body: [
        {
          type: "ExpressionStatement",
          expression: {
            type: "BinaryExpression",
            operator: "-",
            left: {
              type: "BinaryExpression",
              operator: "+",
              left: {
                type: "NumericLiteral",
                value: 3,
              },
              right: {
                type: "NumericLiteral",
                value: 2,
              },
            },
            right: {
              type: "NumericLiteral",
              value: 2,
            },
          },
        },
      ],
    });
  });

  // Multiplicative operator
  test("2 + 2 * 2;", () => {
    const program = "2 + 2 * 2;";
    const ast = parser.parse(program);

    expect(ast).toEqual({
      type: "Program",
      body: [
        {
          type: "ExpressionStatement",
          expression: {
            type: "BinaryExpression",
            operator: "+",
            left: {
              type: "NumericLiteral",
              value: 2,
            },
            right: {
              type: "BinaryExpression",
              operator: "*",
              left: {
                type: "NumericLiteral",
                value: 2,
              },
              right: {
                type: "NumericLiteral",
                value: 2,
              },
            },
          },
        },
      ],
    });
  });

  // ParenthesizedExpression
  test("(2 + 2) * 2;", () => {
    const program = "(2 + 2) * 2;";
    const ast = parser.parse(program);

    expect(ast).toEqual({
      type: "Program",
      body: [
        {
          type: "ExpressionStatement",
          expression: {
            type: "BinaryExpression",
            operator: "*",
            right: {
              type: "NumericLiteral",
              value: 2,
            },
            left: {
              type: "BinaryExpression",
              operator: "+",
              left: {
                type: "NumericLiteral",
                value: 2,
              },
              right: {
                type: "NumericLiteral",
                value: 2,
              },
            },
          },
        },
      ],
    });
  });
});
