import {Component, OnInit} from '@angular/core'
import {MaterialColorsString, PaletteService, ThemeNameString} from '../palette.service'

@Component({
  selector: 'lrn-palette-picker',
  templateUrl: 'palette-picker.component.html',
  styleUrls: ['palette-picker.component.scss'],
})
export class PalettePickerComponent implements OnInit {

  // TODO This should be a separate component
  // and this array should actually be injected or something
  public colors: MaterialColorsString[] = [
    'red',
    'pink',
    'purple',
    'deep-purple',
    'indigo',
    'blue',
    'light-blue',
    'cyan',
    'teal',
    'green',
    'light-green',
    'lime',
    'yellow',
    'amber',
    'orange',
    'deep-orange',
  ]

  public selectColor(color: MaterialColorsString = this.palette.color) {
    this.palette.selectColor(color)
  }

  public selectTheme(theme: ThemeNameString = this.palette.theme) {
    this.palette.selectTheme(theme)
  }

  constructor(public palette: PaletteService) {
  }

  ngOnInit() {
  }

}
