import { NgClass } from '@angular/common';
import { Component, input } from '@angular/core';
import { Option } from '../../interfaces/Option';

@Component({
  selector: 'card-landing',
  imports: [NgClass],
  templateUrl: './card-landing.html'  
})
export class CardLanding {
  public option = input<Option>();
}
