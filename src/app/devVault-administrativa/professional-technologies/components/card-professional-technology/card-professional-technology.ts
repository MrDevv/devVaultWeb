import { NgClass } from '@angular/common';
import { Component, computed, input } from '@angular/core';

import { colorTechnologies } from '@devVault-administrativa/shared/utils/color-technologies';
import { ResponseProfessionalTechnology } from '@devVault-administrativa/professional-technologies/interfaces/professional-technology.dto';

@Component({
  selector: 'card-professional-technology',
  imports: [NgClass],
  templateUrl: './card-professional-technology.html',
})
export class CardProfessionalTechnology {
  public professionalTechnology = input.required<ResponseProfessionalTechnology>();

  public logoOptimizado = computed(() => {
  const url = this.professionalTechnology().logoURL;

  return url
    ? url.replace(
        '/image/upload/',
        '/image/upload/c_limit,w_80,h_80,f_auto,q_auto/'
      )
    : null;
  });

  obtenerColorTech(tipoTecnologia: string): string {
    return colorTechnologies[tipoTecnologia];
  }
}
