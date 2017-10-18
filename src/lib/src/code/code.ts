import {dropRightWhile, dropWhile, takeWhile} from 'lodash-es'

/**
 * A helper functions which manipulates whitespace in a multi-line string
 * so that it's ready for the <pre> tags in templates.
 *
 * Note that this function **does not** prettify the whole code. It is not even
 * aware of the language. It simply removes all blank lines from top and
 * bottom and then automatically decreases the columns of empty lines on the left
 * as much as it can without removing any code.
 *
 * ### Usage
 *
 * This function is implemented as a **template literal tag**, which means it's
 * just attached before the opening backtick for a template literal.
 *
 * ```typescript
 * const code = format`
 *   fancy(code) {
 *     here()
 *   }
 * `
 *
 * In the example above, the first and last empty line would be removed. The first
 * two spaces on all three remaining lines would also be removed.
 * ```
 *
 * @param literals
 * @param placeholders
 * @returns {string}
 */
export function format(literals, ...placeholders): string {
  let string = ''
  for (let i = 0; i < placeholders.length; i++) {
    string += literals[i]
    string += placeholders[i]
  }
  string += literals[literals.length - 1]

  const relevantLines = dropRightWhile(
    dropWhile(
      string.split('\n'),
      line => line.trim() == '',
    ),
    line => line.trim() == '',
  )

  const indentLength = takeWhile(relevantLines[0].split(''), letter => letter == ' ').length

  return relevantLines
    .map(line => line.slice(indentLength))
    .join('\n')
}
