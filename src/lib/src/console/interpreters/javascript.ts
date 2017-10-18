import {Injectable} from '@angular/core'
import {Interpreter} from '../interpreter.interface'

/**
 * The JavaScript interpreter used with the `ConsoleComponent` class.
 * For advanced interpreting, you might want to use an instance of this
 * class in your components instead of relying on its usage internally
 * inside `ConsoleComponent`. Since there are no dependencies, you can
 * easily instantiate it without hassle around `Injector`.
 */
@Injectable()
export class JavaScriptInterpreter implements Interpreter {
  public language = 'javascript'

  public handle(input: string): string {
    // tslint:disable-next-line
    const evaluated = eval(input)
    if (typeof evaluated == 'object') {
      return JSON.stringify(evaluated as Object, null, 2)
    }
    if (typeof evaluated == 'function') {
      const functionName = (evaluated as Function).name
      if (functionName == null || functionName == '') {
        return `Anonymous function`
      } else {
        return `Function ${functionName}`
      }
    }
  }
}

