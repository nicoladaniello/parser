import Factory from "../Factory";
import Parser from "../Parser";

describe("Parser", () => {
  const parser = new Parser();

  test("should support function calls", () => {
    const actual = parser.parse(`foo(x);`);
    expect(actual).toEqual(
      Factory.Program([
        Factory.ExpressionStatement(
          Factory.CallExpression(Factory.Identifier("foo"), [
            Factory.Identifier("x"),
          ])
        ),
      ])
    );
  });

  test("should support chained function calls", () => {
    const actual = parser.parse(`foo(x)();`);
    expect(actual).toEqual(
      Factory.Program([
        Factory.ExpressionStatement(
          Factory.CallExpression(
            Factory.CallExpression(Factory.Identifier("foo"), [
              Factory.Identifier("x"),
            ]),
            []
          )
        ),
      ])
    );
  });

  test("should support chained function calls", () => {
    const actual = parser.parse(`console.log(x, y);`);
    expect(actual).toEqual(
      Factory.Program([
        Factory.ExpressionStatement(
          Factory.CallExpression(
            Factory.MemberExpression(
              false,
              Factory.Identifier("console"),
              Factory.Identifier("log")
            ),
            [Factory.Identifier("x"), Factory.Identifier("y")]
          )
        ),
      ])
    );
  });
});
