import { NgClass } from '@angular/common';
import { Component, input } from '@angular/core';

import { colorTechnologies } from '@devVault-administrativa/shared/utils/color-technologies';
import { Technology } from '@devVault-administrativa/technologies/interfaces/Technology';

@Component({
  selector: 'card-technology',
  imports: [NgClass],
  templateUrl: './card-technology.html',
})
export class CardTechnology {
  public technology = input.required<Technology>();

  obtenerColorTech(tipoTecnologia: string): string {
    return colorTechnologies[tipoTecnologia];
  }
}
