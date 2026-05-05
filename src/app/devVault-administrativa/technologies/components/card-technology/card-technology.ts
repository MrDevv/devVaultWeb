import { NgClass } from '@angular/common';
import { Component, input } from '@angular/core';

import { colorTechnologies } from '@devVault-administrativa/shared/utils/color-technologies';
import { TechnologySimple } from '@devVault-administrativa/technologies/interfaces/technology-simple';

@Component({
  selector: 'card-technology',
  imports: [NgClass],
  templateUrl: './card-technology.html',
})
export class CardTechnology {
  public technology = input.required<TechnologySimple>();

  obtenerColorTech(tipoTecnologia: string): string {
    return colorTechnologies[tipoTecnologia];
  }
}
