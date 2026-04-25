import { Component, input } from '@angular/core';

@Component({
  selector: 'data-field',
  imports: [],
  templateUrl: './data-field.html',
})
export class DataField {
  public title = input.required<string>();
  public value = input.required<string | null | undefined>();
}
