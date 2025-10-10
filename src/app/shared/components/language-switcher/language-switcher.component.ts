import { Component } from '@angular/core';
import {Language, TranslateService} from '@ngx-translate/core';
import { CommonModule } from '@angular/common';

/**
 * @Component
 * @description A component that allows the user to switch between supported languages.
 */
@Component({
  selector: 'app-language-switcher',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './language-switcher.component.html',
  styleUrls: ['./language-switcher.component.css']
})
export class LanguageSwitcherComponent {
  currentLang: Language | null;

  constructor(private translate: TranslateService) {
    this.currentLang = translate.defaultLang || translate.getFallbackLang();
  }

  /**
   * @method switchLanguage
   * @description Switches the application's language.
   * @param {string} lang - The language code to switch to (e.g., 'en', 'es').
   */
  switchLanguage(lang: string) {
    this.translate.use(lang);
    this.currentLang = lang;
  }
}
