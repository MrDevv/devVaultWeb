import { NgClass } from '@angular/common';
import { Component, input } from '@angular/core';
import { AbstractControl, ReactiveFormsModule, ɵInternalFormsSharedModule } from '@angular/forms';


@Component({
  selector: 'logo-preview-component',
  imports: [ReactiveFormsModule, NgClass],
  templateUrl: './logo-preview-component.html',
})
export class LogoPreviewComponent {
  control = input.required<AbstractControl>();
  iconNotFound = input.required<string>();
  subTitle = input.required<string>();
  placeHolder = input.required<string>();

}
