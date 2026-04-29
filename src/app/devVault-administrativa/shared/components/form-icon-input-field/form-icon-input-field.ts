import { Component, input } from '@angular/core';
import { AbstractControl, ReactiveFormsModule } from "@angular/forms";

@Component({
  selector: 'form-icon-input-field',
  imports: [ReactiveFormsModule],
  templateUrl: './form-icon-input-field.html',
})
export class FormIconInputField {
  label = input.required<string>();
  icon = input.required<string>();
  placeholder = input.required<string>();
  type = input.required<string>();
  control = input.required<AbstractControl>();
  required = input<boolean>(false);
}
