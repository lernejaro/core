import {Injectable} from '@angular/core'
import {Interpreter} from '../interpreter.interface'

interface Token {
  type: 'number' | 'function'
  value: any
}

/**
 * A very basic version of Lisp interpreter used with the `ConsoleComponent`
 * class. For advances interpreting, you might want to use an instance of
 * this class in your components instead of relying on its usage internally
 * inside `ConsoleComponent`. Since there are no dependencies, you can easily
 * instantiate it without hassle around `Injector`.
 *
 * This very basic version of Lisp supports the following operators:
 * - n-ary addition with `+`,
 * - n-ary subtraction with `-`,
 * - n-ary multiplication with `*`,
 * - n-ary division with `/`,
 * - unary absolute value with `abs`,
 * - unary square root with `sqrt`,
 * - binary equality comparison with `=`,
 * - binary less-than comparison with `<`,
 * - binary greater-than comparison with `>`,
 * - unary `car`, `cdr`, `cadr` and `cddr`.
 *
 * For example, the following code would output `10`.
 *
 * ```lisp
 * (+ 1 2 3 4)
 * ```
 *
 * You can see more examples in the tests, which are contained inside
 * the `lisp.spec.ts` file.
 */
@Injectable()
export class LispInterpreter implements Interpreter {
  public language = 'lisp'

  public print(input: string | string[]): string {
    if (Array.isArray(input)) {
      return `(${input.map(x => this.print(x)).join(' ')})`
    } else {
      return input.toString()
    }
  }

  public handle(input: string): string {
    // const interpreted = this.interpret(this.parse(input))
    // return this.interpret(this.parse(input)).toString()
    // return JSON.stringify(<any>this.parse(input), null, 2)
    return this.print(this.interpret(this.parse(input)))
  }

  private tokenize(input: string): string[] {
    const openParans = input.split('').filter(char => char == '(').length
    const closedParans = input.split('').filter(char => char == ')').length
    if (openParans != closedParans) {
      throw new Error(`Unmatched parenthesis.`)
    }

    return input
      .replace(/\(/g, ` ( `)
      .replace(/\)/g, ' ) ')
      .trim()
      .split(/\s+/)
  }

  private parenthesize(input: string[], list: Token[] = []): Token | Token[] {
    const token = input.shift()
    switch (true) {
      case token == null:
        return list.pop()
      case token == '(':
        list.push(<Token>this.parenthesize(input, []))
        return this.parenthesize(input, list)
      case token == ')':
        return list
      default:
        return this.parenthesize(input, [...list, this.categorize(token)])
    }
  }

  private functions = {
    '+': (...args) => args.reduce((acc, curr) => acc + curr),
    '-': (...args) => args.reduce((acc, curr) => acc - curr),
    '*': (...args) => args.reduce((acc, curr) => acc * curr),
    '/': (...args) => args.reduce((acc, curr) => acc / curr),
    'abs': x => Math.abs(x),
    'sqrt': x => Math.sqrt(x),
    '=': (x, y) => x == y,
    '<': (x, y) => x < y,
    '>': (x, y) => x > y,
    'car': list => list[0],
    'cdr': list => list.slice(1),
    'cadr': list => list[1],
    'cddr': list => list.slice(2),
  }

  private categorize(value: string): Token {
    switch (true) {
      case !isNaN(parseFloat(value)):
        return {type: 'number', value: parseFloat(value)}
      case value in this.functions:
        return {type: 'function', value}
      default:
        throw new Error(`Unknown value "${value}"`)
    }
  }

  private parse(input: string): Token[] {
    return <Token[]>this.parenthesize(this.tokenize(input))
  }

  private interpret(input: Token | Token[]) {
    switch (true) {
      case Array.isArray(input):
        return this.interpretList(<Token[]>input)
      default:
        return (input as Token).value
    }
  }


  private interpretList(input: Token[]) {
    if (input.length > 0) {
      let result

      if (input[0].type == 'function') {
        const fnName = input[0].value
        const fn = this.functions[fnName]
        const args = input.slice(1).map(arg => this.interpret(arg))
        if (fn.length != 0 && args.length != fn.length) {
          throw new Error(`Function '${fnName}' requires exactly ${fn.length} arguments, ` +
            `but got ${args.length}.`)
        }
        result = fn(...args)
      } else {
        result = input.map(x => this.interpret(x))
      }

      switch (result) {
        case true:
          return 't'
        case false:
          return 'nil'
        default:
          return result
      }
    } else {
      return input.map(x => this.interpret(x))
    }
  }
}

