import Factory from "../Factory";
import Parser from "../Parser";

describe("Parser", () => {
  const parser = new Parser();

  it("should support if statement", () => {
    const ast = parser.parse(`
        if (x) {
            x = 1;
        }
    `);

    expect(ast).toEqual(
      Factory.Program([
        Factory.IfStatement(
          Factory.Identifier("x"),
          Factory.BlockStatement([
            Factory.ExpressionStatement(
              Factory.AssignmentExpression(
                "=",
                Factory.Identifier("x"),
                Factory.NumericLiteral(1)
              )
            ),
          ]),
          null
        ),
      ])
    );
  });

  it("should support if-else statement", () => {
    const ast = parser.parse(`
        if (x) {
            x = 1;
        } else {
            x = 2;
        }
    `);

    expect(ast).toEqual(
      Factory.Program([
        Factory.IfStatement(
          Factory.Identifier("x"),
          Factory.BlockStatement([
            Factory.ExpressionStatement(
              Factory.AssignmentExpression(
                "=",
                Factory.Identifier("x"),
                Factory.NumericLiteral(1)
              )
            ),
          ]),
          Factory.BlockStatement([
            Factory.ExpressionStatement(
              Factory.AssignmentExpression(
                "=",
                Factory.Identifier("x"),
                Factory.NumericLiteral(2)
              )
            ),
          ])
        ),
      ])
    );
  });

  it("should support inline if", () => {
    const ast = parser.parse(`
        if (x) x = 1;
    `);

    expect(ast).toEqual(
      Factory.Program([
        Factory.IfStatement(
          Factory.Identifier("x"),
          Factory.ExpressionStatement(
            Factory.AssignmentExpression(
              "=",
              Factory.Identifier("x"),
              Factory.NumericLiteral(1)
            )
          ),
          null
        ),
      ])
    );
  });

  it("should support consequent ifs", () => {
    const ast = parser.parse(`
        if (x) if (y) {} else {} else {}
    `);

    expect(ast).toEqual(
      Factory.Program([
        Factory.IfStatement(
          Factory.Identifier("x"),
          Factory.IfStatement(
            Factory.Identifier("y"),
            Factory.BlockStatement([]),
            Factory.BlockStatement([])
          ),
          Factory.BlockStatement([])
        ),
      ])
    );
  });
});
