import {InjectionToken} from '@angular/core'

/**
 * The token you need to provide as a multi-dependency when creating custom
 * interpreters for the console. For more information, see the `ConsoleComponent`
 * documentation.
 *
 * @type {InjectionToken}
 */
export const LRN_CONSOLE_INTERPRETER = new InjectionToken('consoleInterpreter')
