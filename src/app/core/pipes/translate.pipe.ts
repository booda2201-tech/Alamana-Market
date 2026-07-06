import { Pipe, PipeTransform } from '@angular/core';
import { LanguageService } from '../services/language.service';
import { TranslationKey } from '../i18n/translations';

@Pipe({
  name: 't',
  pure: false
})
export class TranslatePipe implements PipeTransform {
  constructor(private readonly languageService: LanguageService) {}

  transform(key: TranslationKey, params?: Record<string, string>): string {
    return this.languageService.translate(key, params);
  }
}
