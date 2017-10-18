import {Injectable} from '@angular/core'

/**
 * A small utility service for building more complex LaTeX
 * constructions with ease.
 */
@Injectable()
export class KatexService {

  constructor() {
  }

  /**
   * @internal
   *
   * A matrix transformer which takes the matrix environement name
   * as an input, so different types of matrices can be created.
   *
   * @param envName
   * @param matrix
   * @returns {string}
   */
  private matrix(envName: 'bmatrix' | 'vmatrix', matrix: string[][]): string {
    const header = `\\begin{${envName}}`
    const footer = `\\end{${envName}}`
    const main = matrix.map(row => row.join(` & `)).join(` \\\\ `)
    return [header, main, footer].join(' ')
  }

  /**
   * Transform a JavaScript array of arrays (a matrix) into a
   * string which represents a matrix with square parans in
   * LaTeX notation.
   *
   * @param matrix -- The matrix to transform.
   * @returns {string} -- The equivalent LaTeX string.
   */
  public bMatrix(matrix: string[][]): string {
    return this.matrix('bmatrix', matrix)
  }

  /**
   * Transform a JavaScript array of arrays (a matrix) into a
   * string which represents a matrix with vertical parans in
   * LaTeX notation.
   *
   * @param matrix -- The matrix to transform.
   * @returns {string} -- The equivalent LaTeX string.
   */
  public vMatrix(matrix: string[][]): string {
    return this.matrix('vmatrix', matrix)
  }

}
