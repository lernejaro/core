import {
  AfterContentInit,
  AfterViewInit,
  Directive,
  ElementRef,
  HostBinding,
  Injectable,
  Input,
  Renderer2,
} from '@angular/core'
import {ActivatedRoute, Router} from '@angular/router'
import {UniqueIdService} from '../../unique-id.service'

@Injectable()
export abstract class HDirective implements AfterContentInit {
  constructor(protected elementRef: ElementRef,
              protected renderer: Renderer2,
              private route: ActivatedRoute,
              private router: Router) {
  }

  public title: string

  ngAfterContentInit() {
    const {nativeElement} = this.elementRef
    this.title = nativeElement.textContent

    const id = this.title.replace(/ /g, '_')

    const url = this.route.snapshot.pathFromRoot
      .map(x => x.url)
      .map(x => x.map(segment => segment.path))
      .join('/')
    const link = `${url}#${id}`
    const anchorButton = document.createElement('button')
    anchorButton.innerText = `#`
    anchorButton.onclick = () => {
      // https://github.com/angular/angular/issues/13636#issuecomment-297083132
      window.location.hash = ''
      window.location.hash = id
    }

    this.renderer.setProperty(nativeElement, 'id', id)
    this.renderer.appendChild(nativeElement, anchorButton)
  }
}

@Directive({selector: 'h1'})
export class H1Directive extends HDirective {
}

@Directive({selector: 'h2'})
export class H2Directive extends HDirective {
}

@Directive({selector: 'h3'})
export class H3Directive extends HDirective {
}

@Directive({selector: 'h4'})
export class H4Directive extends HDirective {
}

@Directive({selector: 'h5'})
export class H5Directive extends HDirective {
}

@Directive({selector: 'h6'})
export class H6Directive extends HDirective {
}

@Directive({selector: 'a'})
export class AnchorDirective implements AfterViewInit {

  public id: string
  @Input() public title: string
  @HostBinding('href') @Input() public href: string
  public text: string

  constructor(private elementRef: ElementRef,
              private uniqueId: UniqueIdService,
              private renderer: Renderer2) {
  }

  public ngAfterViewInit(): void {
    const nativeElement: HTMLAnchorElement = this.elementRef.nativeElement

    // For easier grabbing from the notebook
    this.text = nativeElement.innerText

    // Unique but meaningful ID so that anchor links are possible from the
    // bottom of the notebook where "References" are
    const name = (this.title || this.text).replace(/ /g, '_')
    this.id = this.uniqueId.getUniqueId(name)

    // Apply stiff to the element
    if (this.title != null) {
      this.renderer.setProperty(nativeElement, 'title', this.title)
    }
    this.renderer.setProperty(nativeElement, 'id', this.id)
  }

}
