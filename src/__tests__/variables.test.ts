import Parser from "../Parser";

describe("Variables", () => {
  const parser = new Parser();

  test("Declare a variable.", () => {
    const ast = parser.parse(`let x;`);

    expect(ast).toEqual({
      type: "Program",
      body: [
        {
          type: "VariableStatement",
          declarations: [
            {
              type: "VariableDeclaration",
              id: {
                type: "Identifier",
                name: "x",
              },
              init: null,
            },
          ],
        },
      ],
    });
  });

  test("Declare multiple variables.", () => {
    const ast = parser.parse(`let x, y;`);

    expect(ast).toEqual({
      type: "Program",
      body: [
        {
          type: "VariableStatement",
          declarations: [
            {
              type: "VariableDeclaration",
              id: {
                type: "Identifier",
                name: "x",
              },
              init: null,
            },
            {
              type: "VariableDeclaration",
              id: {
                type: "Identifier",
                name: "y",
              },
              init: null,
            },
          ],
        },
      ],
    });
  });

  test("Declare a variable with initializer.", () => {
    const ast = parser.parse(`let x = 42;`);

    expect(ast).toEqual({
      type: "Program",
      body: [
        {
          type: "VariableStatement",
          declarations: [
            {
              type: "VariableDeclaration",
              id: {
                type: "Identifier",
                name: "x",
              },
              init: {
                type: "NumericLiteral",
                value: 42,
              },
            },
          ],
        },
      ],
    });
  });

  test("Declare multiple variables with initializer.", () => {
    const ast = parser.parse(`let x, y = 42;`);

    expect(ast).toEqual({
      type: "Program",
      body: [
        {
          type: "VariableStatement",
          declarations: [
            {
              type: "VariableDeclaration",
              id: {
                type: "Identifier",
                name: "x",
              },
              init: null,
            },
            {
              type: "VariableDeclaration",
              id: {
                type: "Identifier",
                name: "y",
              },
              init: {
                type: "NumericLiteral",
                value: 42,
              },
            },
          ],
        },
      ],
    });
  });
});
