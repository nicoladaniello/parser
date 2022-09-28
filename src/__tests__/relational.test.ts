import Factory from "../Factory";
import Parser from "../Parser";

describe("Parser", () => {
  const parser = new Parser();

  it("should support greater than", () => {
    const actual = parser.parse(`x > 0;`);

    expect(actual).toEqual(
      Factory.Program([
        Factory.ExpressionStatement(
          Factory.BinaryExpression(
            ">",
            Factory.Identifier("x"),
            Factory.NumericLiteral(0)
          )
        ),
      ])
    );
  });

  it("should support less than", () => {
    const actual = parser.parse(`x < 0;`);

    expect(actual).toEqual(
      Factory.Program([
        Factory.ExpressionStatement(
          Factory.BinaryExpression(
            "<",
            Factory.Identifier("x"),
            Factory.NumericLiteral(0)
          )
        ),
      ])
    );
  });

  it("should support greater than", () => {
    const actual = parser.parse(`x >= 0;`);

    expect(actual).toEqual(
      Factory.Program([
        Factory.ExpressionStatement(
          Factory.BinaryExpression(
            ">=",
            Factory.Identifier("x"),
            Factory.NumericLiteral(0)
          )
        ),
      ])
    );
  });

  it("should support greater than", () => {
    const actual = parser.parse(`x <= 0;`);

    expect(actual).toEqual(
      Factory.Program([
        Factory.ExpressionStatement(
          Factory.BinaryExpression(
            "<=",
            Factory.Identifier("x"),
            Factory.NumericLiteral(0)
          )
        ),
      ])
    );
  });

  it("should prioritise additive over relational expressions", () => {
    const actual = parser.parse(`x + 5 > 3;`);

    expect(actual).toEqual(
      Factory.Program([
        Factory.ExpressionStatement(
          Factory.BinaryExpression(
            ">",
            Factory.BinaryExpression(
              "+",
              Factory.Identifier("x"),
              Factory.NumericLiteral(5)
            ),
            Factory.NumericLiteral(3)
          )
        ),
      ])
    );
  });
});
