import Parser from "../Parser";

describe("Parser", () => {
  const parser = new Parser();

  test("should support additions", () => {
    const ast = parser.parse(`
      2 + 3;
    `);

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
              value: 3,
            },
          },
        },
      ],
    });
  });

  test("should support multiplications", () => {
    const ast = parser.parse(`
      2 * 3;
    `);

    expect(ast).toEqual({
      type: "Program",
      body: [
        {
          type: "ExpressionStatement",
          expression: {
            type: "BinaryExpression",
            operator: "*",
            left: {
              type: "NumericLiteral",
              value: 2,
            },
            right: {
              type: "NumericLiteral",
              value: 3,
            },
          },
        },
      ],
    });
  });

  test("should support chained additions", () => {
    // (2 + 2) + 3
    const ast = parser.parse(`
      2 + 2 + 3;
    `);

    expect(ast).toEqual({
      type: "Program",
      body: [
        {
          type: "ExpressionStatement",
          expression: {
            type: "BinaryExpression",
            operator: "+",
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
            right: {
              type: "NumericLiteral",
              value: 3,
            },
          },
        },
      ],
    });
  });

  test("should support mixed additions and multiplications", () => {
    // 2 + (2 * 3)
    const ast = parser.parse(`
      2 + 2 * 3;
    `);

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
                value: 3,
              },
            },
          },
        },
      ],
    });
  });

  test("should support parenthesis", () => {
    const ast = parser.parse(`
      (2 + 2) * 3;
    `);

    expect(ast).toEqual({
      type: "Program",
      body: [
        {
          type: "ExpressionStatement",
          expression: {
            type: "BinaryExpression",
            operator: "*",
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
            right: {
              type: "NumericLiteral",
              value: 3,
            },
          },
        },
      ],
    });
  });

  test("should support operations between identifiers", () => {
    const ast = parser.parse(`
      x + y;
    `);

    expect(ast).toEqual({
      type: "Program",
      body: [
        {
          type: "ExpressionStatement",
          expression: {
            type: "BinaryExpression",
            operator: "+",
            left: {
              type: "Identifier",
              name: "x",
            },
            right: {
              type: "Identifier",
              name: "y",
            },
          },
        },
      ],
    });
  });
});
