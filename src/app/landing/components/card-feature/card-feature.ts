import { NgClass } from '@angular/common';
import { Component, input } from '@angular/core';
import { Feature } from '../../interfaces/Feature';


@Component({
  selector: 'card-feature',
  imports: [NgClass],
  templateUrl: './card-feature.html'  
})
export class CardFeature {

  public feature = input<Feature>();

}
