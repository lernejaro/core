/**
 * An interface to implement for building custom interpreters
 * for `ConsoleComponent`. For more details, see the `ConsoleComponent`
 * documentation.
 */
export interface Interpreter {
  language: string
  handle(input: string): string
}
