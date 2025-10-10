import { HttpClient } from '@angular/common/http';
import { TranslateLoader } from '@ngx-translate/core';
import {Observable} from 'rxjs';

/**
 * @class CustomTranslateLoader
 * @description Custom loader for the ngx-translate library that loads translation files from the `/i18n/` directory.
 */
export class CustomTranslateLoader implements TranslateLoader {
  constructor(private http: HttpClient) {}

  /**
   * @method getTranslation
   * @description Gets the translation file for a given language.
   * @param {string} lang - The language code (e.g., 'en', 'es').
   * @returns {Observable<any>} An observable of the translation data.
   */
  getTranslation(lang: string): Observable<any> {
    return this.http.get(`/i18n/${lang}.json`);
  }
}

/**
 * @function HttpLoaderFactory
 * @description Factory function for creating an instance of the CustomTranslateLoader.
 * @param {HttpClient} http - The HttpClient instance.
 * @returns {TranslateLoader} A new instance of CustomTranslateLoader.
 */
export function HttpLoaderFactory(http: HttpClient): TranslateLoader {
  return new CustomTranslateLoader(http);
}
