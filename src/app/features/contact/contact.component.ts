import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as AOS from 'aos';
import { gsap } from 'gsap';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit {
  contactForm!: FormGroup;
  isSubmitting = false;

  constructor(private fb: FormBuilder) {
    this.initForm();
  }

  ngOnInit(): void {
    AOS.init({ duration: 1000, once: true });
    this.animateHeader();
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
        alert('تم إرسال رسالتك بنجاح! سيتواصل معك أحد ممثلي خدمة العملاء في أقرب وقت ممكن.');
        this.contactForm.reset();
      }, 1500);
    } else {
      Object.values(this.contactForm.controls).forEach(control => {
        control.markAsTouched();
      });
    }
  }
}
