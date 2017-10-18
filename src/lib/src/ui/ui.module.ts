import {ModuleWithProviders, NgModule} from '@angular/core'
import {CommonModule} from '@angular/common'
import {InputComponent} from './input/input.component'
import {FormsModule} from '@angular/forms'
import {GetColorNamePipe} from './get-color-name.pipe'
import {CardComponent} from './card/card.component'
import {ButtonComponent} from './button/button.component'
import {RadioButtonComponent} from './radio-button/radio-button.component'
import {OptionPickerComponent} from './option-picker/option-picker.component'
import {OptionComponent} from './option-picker/option/option.component'
import {RadioButtonGroupComponent} from './radio-button-group/radio-button-group.component'
import {ExpandingFabComponent} from './expanding-fab/expanding-fab.component'
import {ProgressBarComponent} from './progress-bar/progress-bar.component'
import {PalettePickerComponent} from './palette-picker/palette-picker.component'
import {PaletteConfigService} from './palette-config.service'
import {LrnPalette, PaletteService} from './palette.service'
import {LogoComponent} from './logo/logo.component'
import {StepPipe} from './input/step.pipe'
import {CardHeaderComponent} from './card/card-header/card-header.component'
import {CardFooterComponent} from './card/card-footer/card-footer.component'
import {CardContentComponent} from './card/card-content/card-content.component'
import {CheckboxComponent} from './checkbox/checkbox.component'
import {CheckboxGroupComponent} from './checkbox-group/checkbox-group.component'
import {CardBadgeComponent} from './card/card-badge/card-badge.component'
import {ChipComponent} from './chip/chip.component'
import {IconComponent} from './icon/icon.component'
import {UnknownIconErrorComponent} from './errors'
import {LoggerModule} from '../logger/logger.module'
import {CodeModule} from '../code/code.module'
import {BlackoutModule} from '@lernejaro/blackout'
import {ModalComponent} from './modal/modal.component'
import {ModalModule} from '@lernejaro/modal'

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    LoggerModule,
    CodeModule,
    BlackoutModule,
    ModalModule.forRoot(ModalComponent),
  ],
  declarations: [
    InputComponent,
    GetColorNamePipe,
    CardComponent,
    ButtonComponent,
    RadioButtonComponent,
    OptionPickerComponent,
    OptionComponent,
    RadioButtonGroupComponent,
    ExpandingFabComponent,
    ProgressBarComponent,
    ModalComponent,
    PalettePickerComponent,
    LogoComponent,
    StepPipe,
    CardHeaderComponent,
    CardFooterComponent,
    CardContentComponent,
    CheckboxComponent,
    CheckboxGroupComponent,
    CardBadgeComponent,
    ChipComponent,
    IconComponent,
    UnknownIconErrorComponent,
  ],
  exports: [
    InputComponent,
    GetColorNamePipe,
    CardComponent,
    ButtonComponent,
    OptionPickerComponent,
    OptionComponent,
    RadioButtonComponent,
    RadioButtonGroupComponent,
    ExpandingFabComponent,
    ProgressBarComponent,
    PalettePickerComponent,
    LogoComponent,
    CardHeaderComponent,
    CardFooterComponent,
    CardContentComponent,
    CheckboxComponent,
    CheckboxGroupComponent,
    CardBadgeComponent,
    ChipComponent,
    IconComponent,
  ],
  providers: [],
  entryComponents: [
    ModalComponent,
    UnknownIconErrorComponent,
    PalettePickerComponent,
  ],
})
export class UiModule {
  public static forRoot(palette: LrnPalette): ModuleWithProviders {
    return {
      ngModule: UiModule,
      providers: [
        PaletteService,
        {
          provide: PaletteConfigService,
          useValue: palette,
        },
      ],
    }
  }
}
