import Factory from "../Factory";
import Parser from "../Parser";

describe("Parser", () => {
  const parser = new Parser();
  it("should support while loop", () => {
    const actual = parser.parse(`
        while (x > 10) {
            x -= 1;
        }
    `);

    expect(actual).toEqual(
      Factory.Program([
        Factory.WhileStatement(
          Factory.BinaryExpression(
            ">",
            Factory.Identifier("x"),
            Factory.NumericLiteral(10)
          ),
          Factory.BlockStatement([
            Factory.ExpressionStatement(
              Factory.AssignmentExpression(
                "-=",
                Factory.Identifier("x"),
                Factory.NumericLiteral(1)
              )
            ),
          ])
        ),
      ])
    );
  });

  it("should support do-while loop", () => {
    const actual = parser.parse(`
        do {
            x -= 1;
        } while (x > 10);
    `);

    expect(actual).toEqual(
      Factory.Program([
        Factory.DoWhileStatement(
          Factory.BinaryExpression(
            ">",
            Factory.Identifier("x"),
            Factory.NumericLiteral(10)
          ),
          Factory.BlockStatement([
            Factory.ExpressionStatement(
              Factory.AssignmentExpression(
                "-=",
                Factory.Identifier("x"),
                Factory.NumericLiteral(1)
              )
            ),
          ])
        ),
      ])
    );
  });

  it("should support FOR loop", () => {
    const actual = parser.parse(`
        for (let i = 0, z = 0; i < 10; i += 1) {
            x += 1;
        }
    `);

    expect(actual).toEqual(
      Factory.Program([
        Factory.ForStatement(
          Factory.VariableStatement([
            Factory.VariableDeclaration(
              Factory.Identifier("i"),
              Factory.NumericLiteral(0)
            ),
            Factory.VariableDeclaration(
              Factory.Identifier("z"),
              Factory.NumericLiteral(0)
            ),
          ]),
          Factory.BinaryExpression(
            "<",
            Factory.Identifier("i"),
            Factory.NumericLiteral(10)
          ),
          Factory.AssignmentExpression(
            "+=",
            Factory.Identifier("i"),
            Factory.NumericLiteral(1)
          ),
          Factory.BlockStatement([
            Factory.ExpressionStatement(
              Factory.AssignmentExpression(
                "+=",
                Factory.Identifier("x"),
                Factory.NumericLiteral(1)
              )
            ),
          ])
        ),
      ])
    );
  });

  it("should support empty FOR loop", () => {
    const actual = parser.parse(`
        for ( ; ; ) {
            x += 1;
        }
    `);

    expect(actual).toEqual(
      Factory.Program([
        Factory.ForStatement(
          null,
          null,
          null,
          Factory.BlockStatement([
            Factory.ExpressionStatement(
              Factory.AssignmentExpression(
                "+=",
                Factory.Identifier("x"),
                Factory.NumericLiteral(1)
              )
            ),
          ])
        ),
      ])
    );
  });
});
