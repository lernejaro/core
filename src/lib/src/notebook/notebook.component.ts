import {
  AfterContentInit,
  Component,
  ContentChildren,
  ElementRef,
  HostListener,
  Input,
  OnInit,
  QueryList,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core'
import {
  AnchorDirective,
  H1Directive,
  H2Directive,
  H3Directive,
  H4Directive,
  H5Directive,
  H6Directive,
  HDirective,
} from './directives/heading-directives'
import {Tree} from './tree/tree'
import {TreeNode} from './tree/tree-node'
import {
  NodeDataTableOfContent,
  TreeNodeTableOfContent,
  TreeTableOfContent,
} from './table-of-content/table-of-content-tree-node.interface'
import {LoggerService} from '../logger/logger.service'
import {PaletteService} from '../ui/palette.service'
import {animate, state, style, transition, trigger} from '@angular/animations'
import {debounce, groupBy, map, sortBy} from 'lodash-es'
import {
  NoExternalResourcesWarningComponent,
  NotebookTitleWithoutContentErrorComponent,
  NotebookWithoutAuthorErrorComponent,
  NotebookWithoutLanguageSpecifiedErrorComponent,
} from './errors'
import {LatexService} from '../latex/latex.service'
import {MissingTitleComponent} from './errors/missing-title.component'
import {LatexComponent} from '../latex/latex.component'
import {ModalService} from '@lernejaro/modal'

const HUMAN_WPM = 275

const wordsInNode = node => node.textContent.split(/\s+/g).length

function getNumberOfWords(node: Node) {
  if (node.nodeType == Node.TEXT_NODE) {
    return wordsInNode(node) || 0
  } else {
    return Array.from(node.childNodes)
      .reduce((acc, curr: Node) => acc + getNumberOfWords(curr), 0)
  }
}

const roundUp = (step: number) => (number: number) => number - (number % step) + step

@Component({
  selector: 'lrn-notebook',
  templateUrl: './notebook.component.html',
  styleUrls: ['./notebook.component.scss', './notebook.component.print.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: [
    trigger('footerTrigger', [
      state('show', style({
        transform: 'translateY(0)',
      })),
      state('hide', style({
        transform: 'translateY(100%)',
      })),
      transition('show <=> hide', animate('.33s ease')),
    ]),
  ],
})
export class NotebookComponent implements OnInit, AfterContentInit {

  @Input() public suppressNoExternalResourcesWarning: boolean

  @Input() public author: string
  @Input('lang') public language: 'en' | 'sr'

  constructor(private elementRef: ElementRef,
              private logger: LoggerService,
              private palette: PaletteService,
              public modal: ModalService,
              private latex: LatexService) {
  }

  @ContentChildren(H1Directive) public heading1: QueryList<H1Directive>
  @ContentChildren(H2Directive) public heading2: QueryList<H2Directive>
  @ContentChildren(H3Directive) public heading3: QueryList<H3Directive>
  @ContentChildren(H4Directive) public heading4: QueryList<H4Directive>
  @ContentChildren(H5Directive) public heading5: QueryList<H5Directive>
  @ContentChildren(H6Directive) public heading6: QueryList<H6Directive>
  @ContentChildren(AnchorDirective, {descendants: true}) public anchors: QueryList<AnchorDirective>

  public headings: HDirective[][]

  public notebookTitle: string

  public tableOfContents: TreeTableOfContent

  @ViewChild('article') public article: ElementRef

  public isVisibleTableOfContent: boolean = false

  public toggleTableOfContentVisibility() {
    this.isVisibleTableOfContent = !this.isVisibleTableOfContent
  }

  private prepareTableOfContents(): void {
    this.tableOfContents = new Tree<NodeDataTableOfContent>(
      new TreeNode<NodeDataTableOfContent>(
        null, {
          title: this.notebookTitle,
          id: 'top',
        }))
    let currentNode: TreeNodeTableOfContent = this.tableOfContents.getRoot()

    const childrenArray: HTMLElement[] = <any>Array.from(this.article.nativeElement.children)
    const n = childrenArray.length
    for (let i = 0; i < n; i++) {
      const child: HTMLElement = childrenArray[i]

      let childLevel: number
      switch (child.nodeName.toLowerCase()) {
        case 'h2':
          childLevel = 2
          break
        case 'h3':
          childLevel = 3
          break
        case 'h4':
          childLevel = 4
          break
        case 'h5':
          childLevel = 5
          break
        case 'h6':
          childLevel = 6
          break
        default:
          continue
      }

      const title = child.innerText.trim().slice(0, -1)

      if (title == '') {
        this.logger.display(NotebookTitleWithoutContentErrorComponent)
      }

      let id = 'unknown'
      let nodeData = {title, id}

      if (childLevel > currentNode.getLevel()) {
        currentNode.addChild(nodeData)
        currentNode = currentNode.getLastChild()
      } else if (childLevel == currentNode.getLevel()) {
        currentNode = currentNode.getParent()
        currentNode.addChild(nodeData)
        currentNode = currentNode.getLastChild()
      } else {
        const difference = currentNode.getLevel() - childLevel + 1
        for (let j = 0; j < difference; j++) {
          currentNode = currentNode.getParent()
        }
        currentNode.addChild(nodeData)
        currentNode = currentNode.getLastChild()
      }

      nodeData = {title, id: child.id}
      currentNode.setData(nodeData)
    }
  }

  private lastScrollTop: number = 0
  public visibleFooter: boolean = true

  @HostListener('window:scroll')
  public onWindowScroll = debounce(() => {
    const scrollTop: number = window.pageYOffset || document.documentElement.scrollTop
    this.visibleFooter = scrollTop <= this.lastScrollTop
    this.lastScrollTop = scrollTop
  }, 300)

  public wordCount: number
  public estimatedReadingTimeMinutes: number

  private prepareWordCount(): void {
    this.wordCount = roundUp(50)(getNumberOfWords(this.elementRef.nativeElement))
    this.estimatedReadingTimeMinutes = Math.ceil(this.wordCount / HUMAN_WPM)
  }

  public references: { href: string, name: string, ids: string[] }[] = []

  private prepareReferences(): void {
    if (this.anchors.length == 0 && this.wordCount > 2000 &&
      !this.suppressNoExternalResourcesWarning) {
      this.logger.display(NoExternalResourcesWarningComponent, {
        notebookTitle: this.notebookTitle,
        numberOfWords: this.wordCount,
      })
    }

    const arr = this.anchors.toArray()
    const grouped = groupBy(arr, ({id, text, title, href}: AnchorDirective) => href)
    const mapped = map(grouped, ((anchors: AnchorDirective[], href: string) => {
      const withTitle = anchors.find(({title}) => title != null)
      const name: string = withTitle
        ? withTitle.title
        : anchors[0].text
      return {
        href,
        name,
        ids: anchors.map(({id}) => id),
      }
    }) as any) as any

    this.references = sortBy(mapped, ({name}) => name) as any
  }

  public openAsLatexDocument() {
    const latexDocument = this.latex.render(this.article.nativeElement as HTMLElement, {
      title: this.notebookTitle,
      author: this.author,
      language: this.language,
    })
    this.modal.open(LatexComponent, {code: latexDocument})
  }

  ngOnInit() {
    if (this.author == null) {
      this.logger.display(NotebookWithoutAuthorErrorComponent)
      return
    }

    if (this.language == null) {
      this.logger.display(NotebookWithoutLanguageSpecifiedErrorComponent)
      return
    }
  }

  ngAfterContentInit() {
    this.headings = [
      this.heading1,
      this.heading2,
      this.heading3,
      this.heading4,
      this.heading5,
      this.heading6,
    ].map(queryList => queryList.toArray())

    const heading1 = this.heading1.toArray()[0]
    if (heading1) {
      this.notebookTitle = heading1.title
    } else {
      this.logger.display(MissingTitleComponent)
      return
    }

    this.prepareWordCount()
    this.prepareTableOfContents()
    setTimeout(() => {
      this.prepareReferences()
    })
  }

  public goToFragment(hash) {
    window.location.hash = ''
    window.location.hash = hash
  }

  public print() {
    window.print()
  }

}
