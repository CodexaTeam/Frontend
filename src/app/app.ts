import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

/**
 * @component App
 * @description The root component of the application.
 * It initializes the translation service and sets the default and fallback languages.
 */
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: '<router-outlet></router-outlet>',
})
export class App {
  /**
   * @constructor
   * @param {TranslateService} translate - The service for handling internationalization.
   */
  constructor(private translate: TranslateService) {
    translate.setFallbackLang('es');
    translate.use('es');
  }
}
