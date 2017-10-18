import {Component, ElementRef, HostBinding, Input, OnInit} from '@angular/core'
import {animate, state, style, transition, trigger} from '@angular/animations'
import {LoggerService} from '../../logger/logger.service'

@Component({
  selector: 'lrn-digression',
  template: `
    <div class="toggle-area" (click)="toggle()">
      <div *ngIf="heading != null" class="heading">{{ heading }}</div>
      <div class="line"></div>
    </div>

    <ng-container>
      <div class="content" [@expandedTrigger]="expanded ? 'expanded' : 'collapsed'">
        <ng-content></ng-content>
      </div>
    </ng-container>
  `,
  styleUrls: ['./digression.component.scss'],
  animations: [
    trigger('expandedTrigger', [
      state('expanded', style({
        height: '*',
      })),
      state('collapsed', style({
        height: '0px',
      })),
      transition('expanded <=> collapsed', animate('.33s ease-out')),
    ]),
  ],
})
export class DigressionComponent implements OnInit {

  @Input() heading: string

  @HostBinding('attr.aria-expanded')
  public expanded: boolean = false

  public toggle() {
    this.expanded = !this.expanded
  }

  constructor(private logger: LoggerService,
              private elementRef: ElementRef) {
  }

  ngOnInit() {
  }

}
