import {Pipe, PipeTransform} from '@angular/core'

@Pipe({
    name: 'step'
})
export class StepPipe implements PipeTransform {

    transform(value: number, decimals: number): string {
        if (decimals == null) {
            if (value == null) {
                return null
            } else {
                return value.toString()
            }
        }
        return value.toFixed(decimals)
    }

}
