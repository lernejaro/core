import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostBinding,
  Input,
  OnChanges,
  OnInit,
} from '@angular/core'
import {LessonIcon} from './lesson-icon.enum'
import {LoggerService} from '../../logger/logger.service'
import {UnknownIconErrorComponent} from '../errors'

@Component({
  selector: 'lrn-icon',
  templateUrl: './icon.component.html',
  styleUrls: ['./icon.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IconComponent implements OnInit, OnChanges {

  @Input() public icon: LessonIcon | string

  @HostBinding('style.font-size.em')
  @Input() public size: number = 1

  public fontAwesomeIconId: string

  constructor(private logger: LoggerService, private elementRef: ElementRef) {
  }

  ngOnChanges() {
    let id: string
    if (typeof this.icon == 'string') {
      id = <string>this.icon
    } else {
      switch (this.icon) {
        case LessonIcon.Calendar:
          id = 'calendar'
          break
        case LessonIcon.Circle:
          id = 'circle'
          break
        case LessonIcon.Cog:
          id = 'cog'
          break
        case LessonIcon.Cubes:
          id = 'cubes'
          break
        case LessonIcon.Eye:
          id = 'eye'
          break
        case LessonIcon.Flask:
          id = 'flask'
          break
        case LessonIcon.Trophy:
          id = 'trophy'
          break
        case LessonIcon.Lock:
          id = 'lock'
          break
        case LessonIcon.Magnet:
          id = 'magnet'
          break
        case LessonIcon.Umbrella:
          id = 'umbrella'
          break
        case LessonIcon.Wrench:
          id = 'wrench'
          break
        case LessonIcon.Trash:
          id = 'trash'
          break
        case LessonIcon.Star:
          id = 'star'
          break
        case LessonIcon.Question:
          id = 'question'
          break
        case LessonIcon.Cross:
        case LessonIcon.Times:
          id = 'times'
          break
        case LessonIcon.Check:
          id = 'check'
          break
        default:
          this.logger.display(UnknownIconErrorComponent, {icon: id})
          return
      }
    }
    this.fontAwesomeIconId = `fa fa-${id}`
  }

  ngOnInit() {
  }

}
