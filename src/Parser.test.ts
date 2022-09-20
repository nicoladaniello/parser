import Parser from "./Parser";

const parser = new Parser();

test("Parser", () => {
  const program = "42";
  const ast = parser.parse(program);

  expect(ast).toEqual({ type: "NumericLiteral", value: 42 });
});
