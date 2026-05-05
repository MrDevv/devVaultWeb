import { afterNextRender, Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { catchError, debounceTime, distinctUntilChanged, filter, firstValueFrom, skip, switchMap, tap } from 'rxjs';

import { TechnologyService } from '@devVault-administrativa/technologies/services/technology-service';
import { PageHeader } from '@devVault-administrativa/shared/components/page-header/page-header';
import { LoadingOverlay } from "@shared/components/loading-overlay/loading-overlay";
import { CardTechnology } from "@devVault-administrativa/technologies/components/card-technology/card-technology";
import { TechnologySimple } from '@devVault-administrativa/technologies/interfaces/technology-simple';
import { LoaderInput } from "@devVault-administrativa/shared/components/loader-input/loader-input";

@Component({
  selector: 'list-technologies',
  imports: [PageHeader, RouterLink, LoadingOverlay, CardTechnology, LoaderInput],
  templateUrl: './list-technologies.html',
})
export class ListTechnologies {

  public nameTech = signal<string | null>(null);  
  public isLoading = signal(false);
  public technologies = signal<TechnologySimple[]>([]);

  private _technologyService = inject(TechnologyService);

  constructor() {
    afterNextRender(() => {
      this.obtenerTecnologias();
    });

    this.buscarTecnologiaPorNombre();
  }

  private buscarTecnologiaPorNombre() {
    toObservable(this.nameTech).pipe(
    skip(1),
    debounceTime(400),
    distinctUntilChanged(),
    filter(name => name === null || name.length === 0 || name.length >= 2),
    tap(() => this.isLoading.set(true)),
    switchMap(name => {            
      return this._technologyService.obterTecnologiasDesarrollador(name ?? '').pipe(
        catchError((error) => {
          console.error(error);
          return [];
        })
      );
    }),
    takeUntilDestroyed()
    ).subscribe(data => {
      this.technologies.set(data);
      this.isLoading.set(false);
    });
  }

  private async obtenerTecnologias(nombre: string = '') {
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
