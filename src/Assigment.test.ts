import Parser from "./Parser";

describe("Assignment operator", () => {
  const parser = new Parser();

  test("x = 42;", () => {
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
  test("x = y = 42;", () => {
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

  test("x + y;", () => {
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

  // Complex assignment
  test("x += 1;", () => {
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
  test("42 = 42;", () => {
    expect(() => parser.parse(`42 = 42;`)).toThrowError();
  });
});
