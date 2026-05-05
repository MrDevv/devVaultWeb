
import { NgClass } from '@angular/common';
import { afterNextRender, Component, inject, signal } from '@angular/core';
import { rxResource, toObservable } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { PageHeader } from "@devVault-administrativa/shared/components/page-header/page-header";
import { colorTechnologies } from '@devVault-administrativa/shared/utils/color-technologies';
import { TechnologySimple } from '@technologies/interfaces/technology-simple';
import { Technology } from '@technologies/interfaces/technology';
import { TechnologyService } from '@devVault-administrativa/technologies/services/technology-service';
import { catchError, debounceTime, distinctUntilChanged, filter, firstValueFrom, skip, switchMap, tap } from 'rxjs';
import { APIResponseWithPageable } from '../../../../shared/interfaces/APIResponseWithPageable';
import { LoadingOverlay } from "@shared/components/loading-overlay/loading-overlay";
import { LoaderInput } from "@devVault-administrativa/shared/components/loader-input/loader-input";
import Swal from 'sweetalert2';

type Nivel = 'Básico' | 'Intermedio' | 'Avanzado';

@Component({
  selector: 'new-technology',
  imports: [PageHeader, RouterLink, NgClass, LoadingOverlay, LoaderInput],
  templateUrl: './new-technology.html',
})
export class NewTechnology {
  public nameTech = signal<string | null>(null);  
  public isLoading = signal(false);
  public technologies = signal<APIResponseWithPageable<Technology> | null>(null);
  public totalElements = signal(0);

  public nivelSelected = signal<Nivel | null>(null);
  public technologySelected = signal<Technology | null>(null);

  private _technologyService = inject(TechnologyService);

  constructor() {
    afterNextRender(() => {
      this.obtenerTecnologias();
    });

    this.buscarTecnologiaPorNombre();
  }

  seleccionarNivel(nivel: Nivel) {
    if (this.nivelSelected() === nivel) {
      this.nivelSelected.set(null);
      return;
    }

    this.nivelSelected.set(nivel);
  }

  seleccionarTech(tech: Technology) {
    if (this.technologySelected()?.tecnologia_uuid === tech.tecnologia_uuid) {      
      this.technologySelected.set(null);
      return;
    }

    this.technologySelected.set(tech);
  }

  private buscarTecnologiaPorNombre() {
    toObservable(this.nameTech).pipe(
      skip(1),
      debounceTime(400),
      distinctUntilChanged(),
      filter(name => name === null || name.length === 0 || name.length >= 2),
      tap(() => this.isLoading.set(true)),
      switchMap(name => {
        return this._technologyService.obtenerTecnologias(name ?? '').pipe(
          catchError((error) => {
            console.error(error);
            return [];
          })
        );
      })
    ).subscribe(data => {
      this.technologySelected.set(null);
      this.technologies.set(data);
      this.isLoading.set(false);
    });
  }

  private async obtenerTecnologias(nombre: string = '') {    
    this.isLoading.set(true);
    nombre = nombre.trim();
    try {
      const data = await firstValueFrom(this._technologyService.obtenerTecnologias(nombre));      
      this.technologies.set(data);
      this.totalElements.set(data.pageableData.totalElements);
    } catch (error) {
      console.error('Error al obtener tecnologías:', error);
    } finally {
      this.isLoading.set(false);
    }
  }

  obtenerColorTech(tipoTecnologia: string): string {
    return colorTechnologies[tipoTecnologia];
  }

  agregarTecnologiaDesarrollador() {
    if (!this.technologySelected()) {
      Swal.fire({
        icon: 'warning',
        title: 'Advertencia',
        text: 'Por favor, selecciona una tecnología para agregar.',
      });
      return;
    }
    console.log({ 
      technology_uuid: this.technologySelected()?.tecnologia_uuid,
      level: this.nivelSelected()
    });
    
  }
}
