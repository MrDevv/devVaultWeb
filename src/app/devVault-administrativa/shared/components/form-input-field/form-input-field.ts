import { Component, input } from '@angular/core';
import { AbstractControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'form-input-field',
  imports: [ReactiveFormsModule],
  templateUrl: './form-input-field.html',
})
export class FormInputField {
  label = input.required<string>();
  placeholder = input.required<string>();
  type = input.required<string>();
  control = input.required<AbstractControl>();
  required = input<boolean>(false);
}
