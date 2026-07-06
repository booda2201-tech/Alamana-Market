import { Pipe, PipeTransform } from '@angular/core';
import { CountryService } from '../services/country.service';
import { LanguageService } from '../services/language.service';

@Pipe({
  name: 'currencyLabel',
  pure: false
})
export class CurrencyLabelPipe implements PipeTransform {
  constructor(
    private readonly countryService: CountryService,
    private readonly languageService: LanguageService
  ) {}

  transform(_value?: unknown): string {
    void this.languageService.current;
    void this.countryService.getSelectedCountryId();
    return this.countryService.getSelectedLocalizedCurrency();
  }
}
