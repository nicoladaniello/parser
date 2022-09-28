import Factory from "../Factory";
import Parser from "../Parser";

describe("Parser", () => {
  const parser = new Parser();

  it("should support logical AND", () => {
    const actual = parser.parse(`x > 0 && y <= 1;`);

    expect(actual).toEqual(
      Factory.Program([
        Factory.ExpressionStatement(
          Factory.LogicalExpression(
            "&&",
            Factory.BinaryExpression(
              ">",
              Factory.Identifier("x"),
              Factory.NumericLiteral(0)
            ),
            Factory.BinaryExpression(
              "<=",
              Factory.Identifier("y"),
              Factory.NumericLiteral(1)
            )
          )
        ),
      ])
    );
  });

  it("should support logical OR", () => {
    const actual = parser.parse(`x > 0 || y <= 1;`);

    expect(actual).toEqual(
      Factory.Program([
        Factory.ExpressionStatement(
          Factory.LogicalExpression(
            "||",
            Factory.BinaryExpression(
              ">",
              Factory.Identifier("x"),
              Factory.NumericLiteral(0)
            ),
            Factory.BinaryExpression(
              "<=",
              Factory.Identifier("y"),
              Factory.NumericLiteral(1)
            )
          )
        ),
      ])
    );
  });
});
