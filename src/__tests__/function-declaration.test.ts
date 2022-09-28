import Factory from "../Factory";
import Parser from "../Parser";

describe("Parser", () => {
  const parser = new Parser();
  it("should support function declaration", () => {
    const actual = parser.parse(`
        def empty() {
            
        }
    `);

    expect(actual).toEqual(
      Factory.Program([
        Factory.FunctionDeclaration(
          Factory.Identifier("empty"),
          null,
          Factory.BlockStatement([])
        ),
      ])
    );
  });

  it("should support function declaration with parameter and body", () => {
    const actual = parser.parse(`
        def square(x) {
            return x * x;
        }
    `);

    expect(actual).toEqual(
      Factory.Program([
        Factory.FunctionDeclaration(
          Factory.Identifier("square"),
          [Factory.Identifier("x")],
          Factory.BlockStatement([
            Factory.ReturnStatement(
              Factory.BinaryExpression(
                "*",
                Factory.Identifier("x"),
                Factory.Identifier("x")
              )
            ),
          ])
        ),
      ])
    );
  });

  it("should support function declaration with multiple parameters", () => {
    const actual = parser.parse(`
        def square(x, y, z) {
            return x + y + z;
        }
    `);

    expect(actual).toEqual(
      Factory.Program([
        Factory.FunctionDeclaration(
          Factory.Identifier("square"),
          [
            Factory.Identifier("x"),
            Factory.Identifier("y"),
            Factory.Identifier("z"),
          ],
          Factory.BlockStatement([
            Factory.ReturnStatement(
              Factory.BinaryExpression(
                "+",
                Factory.BinaryExpression(
                  "+",
                  Factory.Identifier("x"),
                  Factory.Identifier("y")
                ),
                Factory.Identifier("z")
              )
            ),
          ])
        ),
      ])
    );
  });
});
