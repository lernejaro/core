import {Pipe, PipeTransform} from '@angular/core'
import {enumToString} from '../planimetryts/renderers/color'
import {MaterialColor as MaterialColorEnum} from '../planimetryts/geometry-objects/everything'


@Pipe({name: 'getColorString'})
export class GetColorNamePipe implements PipeTransform {

  transform(color: MaterialColorEnum): string {
    return enumToString(color)
  }

}
