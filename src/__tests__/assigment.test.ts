import Parser from "../Parser";

describe("Parser", () => {
  const parser = new Parser();

  test("should support simple assignments", () => {
    const ast = parser.parse(`
      x = 42;
    `);

    expect(ast).toEqual({
      type: "Program",
      body: [
        {
          type: "ExpressionStatement",
          expression: {
            type: "AssignmentExpression",
            operator: "=",
            left: {
              type: "Identifier",
              name: "x",
            },
            right: {
              type: "NumericLiteral",
              value: 42,
            },
          },
        },
      ],
    });
  });

  // Chained assignment
  test("should support chained assignments", () => {
    const ast = parser.parse(`
      x = y = 42;
    `);

    expect(ast).toEqual({
      type: "Program",
      body: [
        {
          type: "ExpressionStatement",
          expression: {
            type: "AssignmentExpression",
            operator: "=",
            left: {
              type: "Identifier",
              name: "x",
            },
            right: {
              type: "AssignmentExpression",
              operator: "=",
              left: {
                type: "Identifier",
                name: "y",
              },
              right: {
                type: "NumericLiteral",
                value: 42,
              },
            },
          },
        },
      ],
    });
  });

  // Complex assignment
  test("should support complex assignments", () => {
    const ast = parser.parse(`x += 1;`);

    expect(ast).toEqual({
      type: "Program",
      body: [
        {
          type: "ExpressionStatement",
          expression: {
            type: "AssignmentExpression",
            operator: "+=",
            left: {
              type: "Identifier",
              name: "x",
            },
            right: {
              type: "NumericLiteral",
              value: 1,
            },
          },
        },
      ],
    });
  });

  // Chained assignment
  test("should throw if identifier is a number", () => {
    expect(() => parser.parse(`42 = 42;`)).toThrowError();
  });
});
