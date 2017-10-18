import {Pipe, PipeTransform} from '@angular/core'
import {KatexService} from '../katex.service'

/**
 * A pipe version of the vMatrix transformer found in the
 * KaTeX service.
 *
 * Transform a JavaScript array of arrays (a matrix) into a
 * string which represents a matrix with vertical parans in
 * LaTeX notation.
 */
@Pipe({name: 'vMatrix'})
export class VMatrixPipe implements PipeTransform {

  constructor(private service: KatexService) {
  }

  transform(matrix: string[][]): string {
    return this.service.vMatrix(matrix)
  }

}
