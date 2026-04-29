import { Component, input } from '@angular/core';
import { HeaderCard } from "../header-card/header-card";

@Component({
  selector: 'section-card-component',
  imports: [HeaderCard],
  templateUrl: './section-card-component.html',
})
export class SectionCardComponent {
  titleHeader = input<string>();
  iconHeader = input<string>();
}
