import {Injectable} from '@angular/core'
import {LrnPalette, MaterialColorsString, ThemeNameString} from './palette.service'

// TODO this should prolly be opaque token not a class
@Injectable()
export class PaletteConfigService implements LrnPalette {
  public color: MaterialColorsString
  public theme: ThemeNameString
}
