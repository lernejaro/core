import {Injectable} from '@angular/core'

@Injectable()
export class UniqueIdService {

    constructor() {
    }

    private _counter: number = 0

    private getUniqueValue() {
        return ++this._counter
    }

    public getUniqueId(prefix?: string): string {
        if (prefix == null) {
            return this.getUniqueValue().toString()
        } else {
            return `${prefix}-${this.getUniqueValue()}`
        }
    }

}
