import Parser from "./Parser";

describe("Test Parser", () => {
  const parser = new Parser();

  test("NumberLiteral", () => {
    const program = "42";
    const ast = parser.parse(program);

    expect(ast).toEqual({
      type: "Program",
      body: { type: "NumericLiteral", value: 42 },
    });
  });

  test("StringLiteral", () => {
    const program = '"Hello"';
    const ast = parser.parse(program);

    expect(ast).toEqual({
      type: "Program",
      body: { type: "StringLiteral", value: "Hello" },
    });
  });
});
