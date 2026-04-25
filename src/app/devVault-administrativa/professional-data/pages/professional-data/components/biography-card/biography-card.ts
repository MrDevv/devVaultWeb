import { Component, inject, input } from '@angular/core';

@Component({
  selector: 'biography-card',
  imports: [],
  templateUrl: './biography-card.html',
  styles: [`
    :host { 
      display: contents;
    }
  `]
})
export class BiographyCard {
  public bio = input.required<string | null | undefined>();
}
