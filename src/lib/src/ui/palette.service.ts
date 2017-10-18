import {Injectable, OnDestroy} from '@angular/core'
import {PaletteConfigService} from './palette-config.service'

export type MaterialColorsString =
  'red'
  | 'pink'
  | 'purple'
  | 'deep-purple'
  | 'indigo'
  | 'blue'
  | 'light-blue'
  | 'cyan'
  | 'teal'
  | 'green'
  | 'light-green'
  | 'lime'
  | 'yellow'
  | 'amber'
  | 'orange'
  | 'deep-orange'
  | 'brown'
  | 'grey'
  | 'blue-grey'

export type ThemeNameString = 'light' | 'dark'

export interface LrnPalette {
  color: MaterialColorsString
  theme: ThemeNameString
}

export type ThemeAreaColorString = 'primary' | 'secondary' | 'hint' | 'dividers'
export type ThemeTextColorString = 'front' | 'back' | 'app-bar' | 'status-bar'

export type ThemeColorString = ThemeAreaColorString | ThemeTextColorString

@Injectable()
export class PaletteService implements OnDestroy {

  public ngOnDestroy(): void {
    // Force creation of service eagerly so the app doesn't remain colorless
  }

  public color: MaterialColorsString
  public theme: ThemeNameString

  private materialColors = new Map<MaterialColorsString, string>()
    .set('red', '#f44336')
    .set('pink', '#e91e63')
    .set('purple', '#9c27b0')
    .set('deep-purple', '#673ab7')
    .set('indigo', '#3f51b5')
    .set('blue', '#2196f3')
    .set('light-blue', '#03a9f4')
    .set('cyan', '#00bcd4')
    .set('teal', '#009688')
    .set('green', '#4caf50')
    .set('light-green', '#8bc34a')
    .set('lime', '#cddc39')
    .set('yellow', '#ffeb3b')
    .set('amber', '#ffc107')
    .set('orange', '#ff9800')
    .set('deep-orange', '#ff5722')
    .set('brown', '#795548')
    .set('grey', '#9e9e9e')
    .set('blue-grey', '#607d8b')

  private accentColor = new Map<MaterialColorsString, MaterialColorsString>()
    .set('red', 'light-green')
    .set('pink', 'lime')
    .set('purple', 'green')
    .set('deep-purple', 'lime')
    .set('indigo', 'pink')
    .set('blue', 'orange')
    .set('light-blue', 'orange')
    .set('cyan', 'amber')
    .set('teal', 'deep-orange')
    .set('green', 'deep-purple')
    .set('light-green', 'purple')
    .set('lime', 'indigo')
    .set('yellow', 'red')
    .set('amber', 'teal')
    .set('orange', 'orange')
    .set('deep-orange', 'lime')

  private visibleThemeOnBackground = new Map<MaterialColorsString, ThemeNameString>()
    .set('red', 'dark')
    .set('pink', 'dark')
    .set('deep-purple', 'dark')
    .set('indigo', 'dark')
    .set('blue', 'dark')
    .set('light-blue', 'light')
    .set('cyan', 'light')
    .set('teal', 'dark')
    .set('green', 'light')
    .set('light-green', 'light')
    .set('lime', 'light')
    .set('yellow', 'light')
    .set('amber', 'light')
    .set('orange', 'light')
    .set('deep-orange', 'dark')
    .set('brown', 'dark')
    .set('grey', 'light')
    .set('blue-grey', 'dark')

  private lightTheme = new Map<ThemeColorString, string>()
    .set('primary', 'rgba(0, 0, 0, .87)')
    .set('secondary', 'rgba(0, 0, 0, .54')
    .set('hint', 'rgba(0, 0, 0, .38)')
    .set('dividers', 'rgba(0, 0, 0, .12)')
    .set('front', '#FFFFFF')
    .set('back', '#FAFAFA')
    .set('app-bar', '#F5F5F5')
    .set('status-bar', '#E0E0E0')

  private darkTheme = new Map<ThemeColorString, string>()
    .set('primary', 'rgba(255, 255, 255, 1)')
    .set('secondary', 'rgba(255, 255, 255, .7)')
    .set('hint', 'rgba(255, 255, 255, .5)')
    .set('dividers', 'rgba(255, 255, 255, .12')
    .set('front', '#424242')
    .set('back', '#303030')
    .set('app-bar', '#212121')
    .set('status-bar', '#000000')

  constructor(private paletteConfig: PaletteConfigService) {
    this.selectFromConfig()
  }

  private selectFromConfig() {
    this.selectTheme(this.paletteConfig.theme)
    this.selectColor(this.paletteConfig.color)
  }

  public selectColor(color: MaterialColorsString = this.color) {
    this.color = color
    document.body.style.setProperty('--color',
      this.materialColors.get(color))
    document.body.style.setProperty('--accent-color',
      this.materialColors.get(this.accentColor.get(color)))
    document.body.style.setProperty('--text-on-color',
      this.visibleThemeOnBackground.get(color) == 'light'
        ? this.lightTheme.get('primary')
        : this.darkTheme.get('primary'))
  }

  public selectTheme(theme: ThemeNameString = this.theme) {
    this.theme = theme

    const list = [
      'primary', 'secondary', 'hint', 'dividers', 'front', 'back', 'app-bar', 'status-bar',
    ] as any[]

    list
      .forEach(v => {
        const cssCustomProperty = `--color-${v}`
        const map = theme == 'light' ? this.lightTheme : this.darkTheme
        document.body.style.setProperty(cssCustomProperty, map.get(v))
      })
  }


}
