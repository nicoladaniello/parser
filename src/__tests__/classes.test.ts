import Factory from "../Factory";
import Parser from "../Parser";

describe("Parser", () => {
  const parser = new Parser();

  it("should support class declarations", () => {
    const actual = parser.parse(`
        class Point {
            def constructor(x, y) {
                this.x = x;
                this.y = y;
            }

            def calc() {
                return this.x + this.y;
            }
        }
    `);
    expect(actual).toEqual(
      Factory.Program([
        // class Point()
        Factory.ClassDeclaration(
          Factory.Identifier("Point"),
          null,
          Factory.BlockStatement([
            // def constructor(x, y)
            Factory.FunctionDeclaration(
              Factory.Identifier("constructor"),
              [Factory.Identifier("x"), Factory.Identifier("y")],
              Factory.BlockStatement([
                // this.x = x;
                Factory.ExpressionStatement(
                  Factory.AssignmentExpression(
                    "=",
                    Factory.MemberExpression(
                      false,
                      Factory.ThisExpression(),
                      Factory.Identifier("x")
                    ),
                    Factory.Identifier("x")
                  )
                ),
                // this.y = y;
                Factory.ExpressionStatement(
                  Factory.AssignmentExpression(
                    "=",
                    Factory.MemberExpression(
                      false,
                      Factory.ThisExpression(),
                      Factory.Identifier("y")
                    ),
                    Factory.Identifier("y")
                  )
                ),
              ])
            ),

            // def calc()
            Factory.FunctionDeclaration(
              Factory.Identifier("calc"),
              null,
              Factory.BlockStatement([
                // return this.x + this.y;
                Factory.ReturnStatement(
                  Factory.BinaryExpression(
                    "+",
                    Factory.MemberExpression(
                      false,
                      Factory.ThisExpression(),
                      Factory.Identifier("x")
                    ),
                    Factory.MemberExpression(
                      false,
                      Factory.ThisExpression(),
                      Factory.Identifier("y")
                    )
                  )
                ),
              ])
            ),
          ])
        ),
      ])
    );
  });

  it("should support class declaration with super class", () => {
    const actual = parser.parse(`
        class Point3D extends Point {
            def constructor(x, y, z) {
                super(x, y);
                this.z = z;
            }

            def calc() {
                return super() + this.z;
            }
        }
    `);
    expect(actual).toEqual(
      Factory.Program([
        // class Point3D() extends Point
        Factory.ClassDeclaration(
          Factory.Identifier("Point3D"),
          Factory.Identifier("Point"),
          Factory.BlockStatement([
            // def constructor(x, y, z)
            Factory.FunctionDeclaration(
              Factory.Identifier("constructor"),
              [
                Factory.Identifier("x"),
                Factory.Identifier("y"),
                Factory.Identifier("z"),
              ],
              Factory.BlockStatement([
                // super(x, y);
                Factory.ExpressionStatement(
                  Factory.CallExpression(Factory.SuperExpression(), [
                    Factory.Identifier("x"),
                    Factory.Identifier("y"),
                  ])
                ),
                // this.z = z;
                Factory.ExpressionStatement(
                  Factory.AssignmentExpression(
                    "=",
                    Factory.MemberExpression(
                      false,
                      Factory.ThisExpression(),
                      Factory.Identifier("z")
                    ),
                    Factory.Identifier("z")
                  )
                ),
              ])
            ),

            // def calc()
            Factory.FunctionDeclaration(
              Factory.Identifier("calc"),
              null,
              Factory.BlockStatement([
                // return super() + this.z;
                Factory.ReturnStatement(
                  Factory.BinaryExpression(
                    "+",
                    Factory.CallExpression(Factory.SuperExpression(), []),
                    Factory.MemberExpression(
                      false,
                      Factory.ThisExpression(),
                      Factory.Identifier("z")
                    )
                  )
                ),
              ])
            ),
          ])
        ),
      ])
    );
  });

  it("should support class instantiation with 'new' operator", () => {
    const actual = parser.parse(`
        new Point3D(10, 20, 30);
    `);
    expect(actual).toEqual(
      Factory.Program([
        Factory.ExpressionStatement(
          Factory.NewExpression(Factory.Identifier("Point3D"), [
            Factory.NumericLiteral(10),
            Factory.NumericLiteral(20),
            Factory.NumericLiteral(30),
          ])
        ),
      ])
    );
  });

  it("should support class instantiation with 'new' operator as a member call", () => {
    const actual = parser.parse(`
        new Namespace.Point3D(10, 20, 30);
    `);
    expect(actual).toEqual(
      Factory.Program([
        Factory.ExpressionStatement(
          Factory.NewExpression(
            Factory.MemberExpression(
              false,
              Factory.Identifier("Namespace"),
              Factory.Identifier("Point3D")
            ),
            [
              Factory.NumericLiteral(10),
              Factory.NumericLiteral(20),
              Factory.NumericLiteral(30),
            ]
          )
        ),
      ])
    );
  });
});
