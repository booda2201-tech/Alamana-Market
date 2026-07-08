import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as AOS from 'aos';
import { gsap } from 'gsap';
import { Subscription } from 'rxjs';
import { CountryService } from '../../core/services/country.service';
import { LanguageService } from '../../core/services/language.service';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit, OnDestroy {
  contactForm!: FormGroup;
  isSubmitting = false;
  isSubjectMenuOpen = false;
  readonly subjectOptions = [
    { value: 'sales', labelKey: 'contact.subjectSales' as const },
    { value: 'support', labelKey: 'contact.subjectSupport' as const },
    { value: 'other', labelKey: 'contact.subjectOther' as const }
  ];
  contactInfo = this.countryService.getSelectedContactInfo();
  private countrySubscription?: Subscription;
  private languageSubscription?: Subscription;

  constructor(
    private readonly fb: FormBuilder,
    private readonly countryService: CountryService,
    public readonly language: LanguageService
  ) {
    this.initForm();
  }

  ngOnInit(): void {
    AOS.init({ duration: 1000, once: true });
    this.animateHeader();

    this.countryService.loadCountries().subscribe(() => this.refreshContactInfo());
    this.countrySubscription = this.countryService.selectedCountryId$.subscribe(() => this.refreshContactInfo());
    this.languageSubscription = this.language.language$.subscribe(() => this.refreshContactInfo());
  }

  ngOnDestroy(): void {
    this.countrySubscription?.unsubscribe();
    this.languageSubscription?.unsubscribe();
  }

  private refreshContactInfo(): void {
    this.contactInfo = this.countryService.getSelectedContactInfo();
  }

  initForm() {
    this.contactForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      company: [''],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern('^[0-9+]*$')]],
      subject: ['', Validators.required],
      message: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  get selectedSubjectLabel(): string {
    const value = this.contactForm.get('subject')?.value;
    const option = this.subjectOptions.find((item) => item.value === value);
    return option
      ? this.language.translate(option.labelKey)
      : this.language.translate('contact.subjectPlaceholder');
  }

  toggleSubjectMenu(event?: Event): void {
    event?.stopPropagation();
    this.isSubjectMenuOpen = !this.isSubjectMenuOpen;
  }

  selectSubject(value: string): void {
    this.contactForm.get('subject')?.setValue(value);
    this.contactForm.get('subject')?.markAsTouched();
    this.isSubjectMenuOpen = false;
  }

  closeSubjectMenu(): void {
    this.isSubjectMenuOpen = false;
  }

  animateHeader() {
    gsap.from('.header-content', {
      y: 30,
      opacity: 0,
      duration: 1,
      ease: 'power2.out'
    });
  }

  onSubmit() {
    if (this.contactForm.valid) {
      this.isSubmitting = true;

      // محاكاة لإرسال البيانات
      setTimeout(() => {
        this.isSubmitting = false;
        alert(this.language.translate('contact.successSent'));
        this.contactForm.reset();
      }, 1500);
    } else {
      Object.values(this.contactForm.controls).forEach(control => {
        control.markAsTouched();
      });
    }
  }
}
