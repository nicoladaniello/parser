import Factory from "../Factory";
import Parser from "../Parser";

describe("Parser", () => {
  const parser = new Parser();

  it("should support negative unary expression", () => {
    const actual = parser.parse(`-x;`);

    expect(actual).toEqual(
      Factory.Program([
        Factory.ExpressionStatement(
          Factory.UnaryExpression("-", Factory.Identifier("x"))
        ),
      ])
    );
  });

  it("should support chained negative unary expression", () => {
    const actual = parser.parse(`--x;`);

    expect(actual).toEqual(
      Factory.Program([
        Factory.ExpressionStatement(
          Factory.UnaryExpression(
            "-",
            Factory.UnaryExpression("-", Factory.Identifier("x"))
          )
        ),
      ])
    );
  });

  it("should support NOT unary expression", () => {
    const actual = parser.parse(`!x;`);

    expect(actual).toEqual(
      Factory.Program([
        Factory.ExpressionStatement(
          Factory.UnaryExpression("!", Factory.Identifier("x"))
        ),
      ])
    );
  });

  it("should support chained NOT unary expression", () => {
    const actual = parser.parse(`!!x;`);

    expect(actual).toEqual(
      Factory.Program([
        Factory.ExpressionStatement(
          Factory.UnaryExpression(
            "!",
            Factory.UnaryExpression("!", Factory.Identifier("x"))
          )
        ),
      ])
    );
  });

  it("should prioritise unary over multiplicative expressions", () => {
    const actual = parser.parse(`+x * 2;`);

    expect(actual).toEqual(
      Factory.Program([
        Factory.ExpressionStatement(
          Factory.BinaryExpression(
            "*",
            Factory.UnaryExpression("+", Factory.Identifier("x")),
            Factory.NumericLiteral(2)
          )
        ),
      ])
    );
  });
});
