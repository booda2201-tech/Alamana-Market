import { Pipe, PipeTransform } from '@angular/core';
import { LanguageService } from '../services/language.service';

@Pipe({
  name: 'localized',
  pure: false
})
export class LocalizedPipe implements PipeTransform {
  constructor(private readonly languageService: LanguageService) {}

  transform(arabic?: string, english?: string, fallback?: string): string {
    return this.languageService.pickLocalized(arabic, english, fallback);
  }
}
