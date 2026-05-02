import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PageHeader } from '@devVault-administrativa/shared/components/page-header/page-header';
import { TechnologyService } from '@devVault-administrativa/technologies/services/technology-service';
import { rxResource } from '@angular/core/rxjs-interop';

import { colorTechnologies } from '@devVault-administrativa/shared/utils/color-technologies';
import { NgClass } from '@angular/common';
import { LoadingOverlay } from "@shared/components/loading-overlay/loading-overlay";

@Component({
  selector: 'list-technologies',
  imports: [PageHeader, RouterLink, NgClass, LoadingOverlay],
  templateUrl: './list-technologies.html',
})
export class ListTechnologies {

  private _technologyService = inject(TechnologyService);

  resourceTechnologies = rxResource({
    stream: () => {
      return this._technologyService.obterTecnologiasDesarrollador();
    }
  })

  obtenerColorTech(tipoTecnologia: string): string {
    return colorTechnologies[tipoTecnologia];
  }

}
