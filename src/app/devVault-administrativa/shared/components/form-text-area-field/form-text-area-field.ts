import { Component, input } from '@angular/core';
import { AbstractControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'form-text-area-field',
  imports: [ReactiveFormsModule],
  templateUrl: './form-text-area-field.html',
})
export class FormTextAreaField {
  label = input.required<string>();
  placeholder = input.required<string>();  
  control = input.required<AbstractControl>();
  maxLength = input.required<string>();
  descriptionMaxLength = input.required<string>();
}
