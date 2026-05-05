import { afterNextRender, Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PageHeader } from '@devVault-administrativa/shared/components/page-header/page-header';
import { TechnologyService } from '@devVault-administrativa/technologies/services/technology-service';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { debounceTime, filter, firstValueFrom, skip } from 'rxjs';

import { LoadingOverlay } from "@shared/components/loading-overlay/loading-overlay";
import { CardTechnology } from "@devVault-administrativa/technologies/components/card-technology/card-technology";
import { Technology } from '@devVault-administrativa/technologies/interfaces/Technology';
import { LoaderInput } from "@devVault-administrativa/shared/components/loader-input/loader-input";

@Component({
  selector: 'list-technologies',
  imports: [PageHeader, RouterLink, LoadingOverlay, CardTechnology, LoaderInput],
  templateUrl: './list-technologies.html',
})
export class ListTechnologies {

  public nameTech = signal<string | null>(null);  
  public isLoading = signal(false);
  public technologies = signal<Technology[]>([]);

  private _technologyService = inject(TechnologyService);

  constructor() {
    afterNextRender(() => {
      this.obtenerTecnologias('');
    });

    toObservable(this.nameTech).pipe(
    skip(1),
    debounceTime(400),
    filter(name => name === null || name.length === 0 || name.length >= 3),
    takeUntilDestroyed()
    ).subscribe(name => {
      this.obtenerTecnologias(name ?? '');
    });
  }

  private async obtenerTecnologias(nombre: string) {
    this.isLoading.set(true);
    nombre = nombre.trim();
    try {
      const data = await firstValueFrom(this._technologyService.obterTecnologiasDesarrollador(nombre));
      this.technologies.set(data);
    } catch (error) {
      console.error('Error al obtener tecnologías:', error);
    } finally {
      this.isLoading.set(false);
    }
  }
}
