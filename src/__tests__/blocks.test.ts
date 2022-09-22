import Parser from "../Parser";

describe("Parser", () => {
  const parser = new Parser();

  test("should support block statements", () => {
    const program = `
      {
        /**
         * Documentation comment:
         */
        "Hello";

        // Number
        42;
      }
    `;
    const ast = parser.parse(program);

    expect(ast).toEqual({
      type: "Program",
      body: [
        {
          type: "BlockStatement",
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
        },
      ],
    });
  });

  test("should support empty block statements", () => {
    const program = `
    {

    }
    `;
    const ast = parser.parse(program);

    expect(ast).toEqual({
      type: "Program",
      body: [
        {
          type: "BlockStatement",
          body: [],
        },
      ],
    });
  });

  test("should support nested block statements", () => {
    const program = `
    {
      42;
      {
        "Hello";
      }
    }
    `;
    const ast = parser.parse(program);

    expect(ast).toEqual({
      type: "Program",
      body: [
        {
          type: "BlockStatement",
          body: [
            {
              type: "ExpressionStatement",
              expression: { type: "NumericLiteral", value: 42 },
            },
            {
              type: "BlockStatement",
              body: [
                {
                  type: "ExpressionStatement",
                  expression: { type: "StringLiteral", value: "Hello" },
                },
              ],
            },
          ],
        },
      ],
    });
  });
});
