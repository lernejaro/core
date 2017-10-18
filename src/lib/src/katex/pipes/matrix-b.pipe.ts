import {Pipe, PipeTransform} from '@angular/core'
import {KatexService} from '../katex.service'

/**
 * A pipe version of the bMatrix transformer found in the
 * KaTeX service.
 *
 * Transform a JavaScript array of arrays (a matrix) into a
 * string which represents a matrix with bracket parans in
 * LaTeX notation.
 */
@Pipe({name: 'bMatrix'})
export class BMatrixPipe implements PipeTransform {

  constructor(private service: KatexService) {
  }

  transform(matrix: string[][]): string {
    return this.service.bMatrix(matrix)
  }

}
