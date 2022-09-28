import Factory from "../Factory";
import Parser from "../Parser";

describe("Parser", () => {
  const parser = new Parser();

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
});
