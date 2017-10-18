import {
    Component, OnInit, ViewChild, ElementRef,
    AfterContentInit, AfterViewInit
} from '@angular/core'
import {MarkdownParserService} from "./markdown-parser.service"

@Component({
    selector: 'lrn-markdown, [lrnMarkdown]',
    templateUrl: './markdown.component.html',
    styleUrls: ['./markdown.component.scss'],
})
export class MarkdownComponent implements OnInit, AfterContentInit, AfterViewInit {

    @ViewChild('content')
    public content: ElementRef

    public markedText: string

    private update(): void {
        const plain: string = this.content.nativeElement.innerHTML
        this.markedText = this.markdown.transform(plain)
    }

    constructor(private markdown: MarkdownParserService) {
    }

    ngOnInit() {
    }

    ngAfterContentInit() {
    }

    ngAfterViewInit() {
        setTimeout(() => this.update())
    }

}
