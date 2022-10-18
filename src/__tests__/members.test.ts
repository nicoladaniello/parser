import Factory from "../Factory";
import Parser from "../Parser";

describe("Parser", () => {
  const parser = new Parser();

  it("should parse member properties", () => {
    const actual = parser.parse(`x.y;`);

    expect(actual).toEqual(
      Factory.Program([
        Factory.ExpressionStatement(
          Factory.MemberExpression(
            false,
            Factory.Identifier("x"),
            Factory.Identifier("y")
          )
        ),
      ])
    );
  });

  it("should parse assignments to member properties", () => {
    const actual = parser.parse(`x.y = 1;`);

    expect(actual).toEqual(
      Factory.Program([
        Factory.ExpressionStatement(
          Factory.AssignmentExpression(
            "=",
            Factory.MemberExpression(
              false,
              Factory.Identifier("x"),
              Factory.Identifier("y")
            ),
            Factory.NumericLiteral(1)
          )
        ),
      ])
    );
  });

  it("should parse assignments to computed properties", () => {
    const actual = parser.parse(`x[0] = 1;`);

    expect(actual).toEqual(
      Factory.Program([
        Factory.ExpressionStatement(
          Factory.AssignmentExpression(
            "=",
            Factory.MemberExpression(
              true,
              Factory.Identifier("x"),
              Factory.NumericLiteral(0)
            ),
            Factory.NumericLiteral(1)
          )
        ),
      ])
    );
  });

  it("should parse chained properties", () => {
    const actual = parser.parse(`a.b.c['d'];`);

    expect(actual).toEqual(
      Factory.Program([
        Factory.ExpressionStatement(
          Factory.MemberExpression(
            true,
            Factory.MemberExpression(
              false,
              Factory.MemberExpression(
                false,
                Factory.Identifier("a"),
                Factory.Identifier("b")
              ),
              Factory.Identifier("c")
            ),
            Factory.StringLiteral("d")
          )
        ),
      ])
    );
  });
});
