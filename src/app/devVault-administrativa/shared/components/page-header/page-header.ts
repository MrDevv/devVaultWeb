import { Component, input } from '@angular/core';

@Component({
  selector: 'page-header',
  imports: [],
  templateUrl: './page-header.html',
})
export class PageHeader {
  public firstTitle = input.required<string>();
  public secondTitle = input.required<string>();
  public description = input.required<string>();
}
