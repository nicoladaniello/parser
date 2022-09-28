import Factory from "../Factory";
import Parser from "../Parser";

describe("Parser", () => {
  const parser = new Parser();

  it("should support equality", () => {
    const actual = parser.parse(`x > 0 == true;`);

    expect(actual).toEqual(
      Factory.Program([
        Factory.ExpressionStatement(
          Factory.BinaryExpression(
            "==",
            Factory.BinaryExpression(
              ">",
              Factory.Identifier("x"),
              Factory.NumericLiteral(0)
            ),
            Factory.BooleanLiteral(true)
          )
        ),
      ])
    );
  });

  it("should support inequality", () => {
    const actual = parser.parse(`x > 0 != false;`);

    expect(actual).toEqual(
      Factory.Program([
        Factory.ExpressionStatement(
          Factory.BinaryExpression(
            "!=",
            Factory.BinaryExpression(
              ">",
              Factory.Identifier("x"),
              Factory.NumericLiteral(0)
            ),
            Factory.BooleanLiteral(false)
          )
        ),
      ])
    );
  });
});
