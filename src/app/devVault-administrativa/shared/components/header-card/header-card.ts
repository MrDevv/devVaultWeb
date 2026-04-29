import { Component, input } from '@angular/core';

@Component({
  selector: 'header-card',
  imports: [],
  templateUrl: './header-card.html',
})
export class HeaderCard {
  title = input<string>();
  icon = input<string>();
}
