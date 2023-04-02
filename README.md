# Description

Implementation of a recursive descent parser.

The executable takes a program string or file as input, and returns the AST for that program.

### Execute from command line

1. Build the program
   `npm run build`

2. Run the executable.
   Use `-e` for inline commands:
   `./bin/letter-rdp -e 'x > 1;'`
   or `-f` for files.
   `./bin/letter-rdp -f ./bin/test.lt`

Example output:

```
{
  "type": "Program",
  "body": [
    {
      "type": "ExpressionStatement",
      "expression": {
        "type": "BinaryExpression",
        "operator": ">",
        "left": {
          "type": "Identifier",
          "name": "x"
        },
        "right": {
          "type": "NumericLiteral",
          "value": 1
        }
      }
    }
  ]
}

```

### Test

`npm test`
