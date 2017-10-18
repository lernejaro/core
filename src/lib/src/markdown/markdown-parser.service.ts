import {Injectable} from '@angular/core'
import * as marked from 'marked'
import {format} from '../code/code'

@Injectable()
export class MarkdownParserService {

  private encloseInTag(text: string,
                       tagName: string,
                       className: string,
                       on: boolean = true): string {
    return on ?
      `<${tagName} class="${className}">${text}</${tagName}>` :
      text
  }

  public transform(text: string): string {
    if (text) {
      text = text.replace(/&gt;/g, '>')
      const gobbledText = format`${text}`
      const markedText: string = marked.parse(gobbledText)
      return this.encloseInTag(markedText, 'div', 'slide-inner', false)
    } else {
      return ''
    }
  }

  constructor() {
    marked.setOptions({
      smartypants: true,
      gfm: true,
    })
  }

}
