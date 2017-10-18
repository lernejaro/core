import {Directive} from '@angular/core'
import {ChoiceComponent} from './choice.component'

@Directive({
    selector: '[lrnCorrect]'
})
export class CorrectDirective {

    constructor(choice: ChoiceComponent) {
        choice.setAsCorrect()
    }

}
