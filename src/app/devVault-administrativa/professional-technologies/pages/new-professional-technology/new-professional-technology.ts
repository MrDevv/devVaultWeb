
import { NgClass } from '@angular/common';
import { Component, inject, signal, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { toObservable } from '@angular/core/rxjs-interop';
import { catchError, debounceTime, distinctUntilChanged, filter, firstValueFrom, skip, switchMap, tap } from 'rxjs';

import { PageHeader } from "@devVault-administrativa/shared/components/page-header/page-header";
import { colorTechnologies } from '@devVault-administrativa/shared/utils/color-technologies';
import { ProfessionalTechnologyService } from '@devVault-administrativa/professional-technologies/services/professional-technology-service';
import { LoaderInput } from "@devVault-administrativa/shared/components/loader-input/loader-input";
import { TechnologyService } from '@devVault-administrativa/technologies/services/technologyService';
import { ResponseTechnology } from '@devVault-administrativa/technologies/interfaces/technology.dto';
import { CreateProfessionalTechnology } from '@devVault-administrativa/professional-technologies/interfaces/professional-technology.dto';
import { AlertService } from '@shared/services/alert-service';
import { APIResponseWithPageable } from '@shared/interfaces/APIResponseWithPageable';
import { Loading } from '@shared/components/loading/loading';

type Nivel = 'Básico' | 'Intermedio' | 'Avanzado';

@Component({
  selector: 'new-professional-technology',
  imports: [PageHeader, RouterLink, NgClass, LoaderInput, ReactiveFormsModule, Loading],
  templateUrl: './new-professional-technology.html',
})
export class NewProfessionalTechnology implements OnInit {
  // Nombre utilizado para filtrar las tecnologías
  public nameTech = signal<string | null>(null);  

  // Estado de carga inicial o de busqueda
  public isLoading = signal(false);

  public technologies = signal<APIResponseWithPageable<ResponseTechnology> | null>(null);
  public totalElements = signal(0);

  public nivelSelected = signal<Nivel | null>(null);
  public technologySelected = signal<ResponseTechnology | null>(null);

  // Permite posponer la busqueda mientras se presiona la tecla de borrado
  public teclaBorradoPresionada = signal<boolean>(false);

  private readonly pageSize = 8;  

  private professionalTechnologyService = inject(ProfessionalTechnologyService);
  private technologyService = inject(TechnologyService);
  private alertService = inject(AlertService)
  private router = inject(Router);

  constructor() {
    this.buscarTecnologiaPorNombre();
  }
  
  ngOnInit(): void {
    this.obtenerTecnologias();
  }

  seleccionarNivel(nivel: Nivel) {
    if (this.nivelSelected() === nivel) {
      this.nivelSelected.set(null);
      return;
    }

    this.nivelSelected.set(nivel);
  }

  // Actualiza el filtro de búsqueda por título de proyecto, excepto cuando se está presionando la tecla de borrado
  public onSearchInput(nombre: string) {
    if (this.teclaBorradoPresionada()) return;
    this.aplicarBusqueda(nombre);
  }

  // Marca el inicio del borrado de texto en el campo de búsqueda
  public onSearchKeyDown(event: KeyboardEvent) {
    if (event.key === 'Backspace' || event.key === 'Delete') {
      this.teclaBorradoPresionada.set(true);
    }
  }

  // Marca el fin del borrado de texto en el campo de búsqueda y aplica la búsqueda
  public onSearchKeyUp(event: KeyboardEvent) {
    if (event.key === 'Backspace' || event.key === 'Delete') {
      this.teclaBorradoPresionada.set(false);
      this.aplicarBusqueda((event.target as HTMLInputElement).value);
    }
  }

  // Aplica la búsqueda actualizando el nombre de la tecnología
  private aplicarBusqueda(nombre: string) {
    this.nameTech.set(nombre);
  }

  seleccionarTech(tech: ResponseTechnology) {
    if (this.technologySelected()?.tecnologiaUUID === tech.tecnologiaUUID) {      
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
        return this.technologyService.obtenerTecnologias(this.pageSize, 0, name ?? '').pipe(
          catchError((error) => {
            console.error(error);
            return [];
          })
        );
      })
    ).subscribe(data => {
      this.technologySelected.set(null);
      this.technologies.set(data.data);
      this.isLoading.set(false);
    });
  }

  // Obtiene la lista de tecnologías en la primera renderización.
  private async obtenerTecnologias() {    
    this.isLoading.set(true);
    try {
      const response = await firstValueFrom(this.technologyService.obtenerTecnologias(this.pageSize, 0, this.nameTech() ?? ''));
      this.technologies.set(response.data);
      this.totalElements.set(response.data.pageableData.totalElements);
    } catch (error) {
      console.error('Error al obtener tecnologías:', error);
      this.alertService.error('Error', 'Ocurrió un error al obtener las tecnologías.');
    } finally {
      this.isLoading.set(false);
    }
  }

  obtenerColorTech(tipoTecnologia: string): string {
    return colorTechnologies[tipoTecnologia];
  }

  async agregarTecnologiaDesarrollador() {
    if (!this.technologySelected()) {
      this.alertService.warning('Advertencia', 'Por favor, selecciona una tecnología para agregar.');
      return;
    }

    const createTechnology: CreateProfessionalTechnology = {
      tecnologiaUUID: this.technologySelected()?.tecnologiaUUID ?? '',
      nivel: this.nivelSelected() && this.nivelSelected()
    };

    try {
      this.isLoading.set(true);
      await firstValueFrom(this.professionalTechnologyService.registrarNuevaTecnologiaProfesional(createTechnology));     
      this.router.navigateByUrl('technologies');
    } catch (error: any) {
      console.error('Error al agregar la tecnología profesional:', error);

      if (error.code == 400) {
        this.alertService.warning('Error', 'Verifique los datos ingresados e intente nuevamente.');
        return;
      }

      if (error.code == 409) {
        this.alertService.warning('Error', 'La tecnología ya está registrada.');
        return;
      }

      this.alertService.error('Error', 'Ocurrió un error al agregar la tecnología.');
      
    } finally {
      this.isLoading.set(false);
    }
    
  }
}
