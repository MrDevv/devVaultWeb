import { Component, inject, OnInit, signal } from '@angular/core';
import { AlertService } from '@shared/services/alert-service';
import { RouterLink } from '@angular/router';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { catchError, debounceTime, distinctUntilChanged, filter, firstValueFrom, skip, switchMap, tap } from 'rxjs';

import { PageHeader } from '@devVault-administrativa/shared/components/page-header/page-header';
import { LoadingOverlay } from "@shared/components/loading-overlay/loading-overlay";
import { CardProfessionalTechnology } from "@devVault-administrativa/professional-technologies/components/card-professional-technology/card-professional-technology";
import { LoaderInput } from "@devVault-administrativa/shared/components/loader-input/loader-input";
import { ResponseProfessionalTechnology } from '@devVault-administrativa/professional-technologies/interfaces/professional-technology.dto';
import { ProfessionalTechnologyService } from '@devVault-administrativa/professional-technologies/services/professional-technology-service';
import { Loading } from '@shared/components/loading/loading';

@Component({
  selector: 'list-professional-technologies',
  imports: [PageHeader, RouterLink, LoadingOverlay, CardProfessionalTechnology, LoaderInput, CardProfessionalTechnology, Loading],
  templateUrl: './list-professional-technologies.html',
})
export class ListProfessionalTechnologies implements OnInit {

  // titulo utilizado para filtrar las tecnologías por nombre
  public nameTech = signal<string | null>(null);  

  // Estado de carga inicial o de busqueda
  public isLoading = signal(false);

  public isLoadingTransparent = signal(false);

  // Permite posponer la busqueda mientras se presiona la tecla de borrado
  public teclaBorradoPresionada = signal<boolean>(false);

  // Lista de tecnologías del profesional obtenidas
  public professionalTechnologies = signal<ResponseProfessionalTechnology[]>([]);

  private readonly _technologyService = inject(ProfessionalTechnologyService);
  private readonly alertService = inject(AlertService);

  constructor() {
    this.buscarTecnologiaPorNombre();
  }
  
  ngOnInit(): void {
    this.obtenerTecnologias();
  }

  public onSearchInput(nombre: string) {
    if (this.teclaBorradoPresionada()) return;
    this.aplicarBusqueda(nombre);
  }

  public onSearchKeyDown(event: KeyboardEvent) {
    if (event.key === 'Backspace' || event.key === 'Delete') {
      this.teclaBorradoPresionada.set(true);
    }
  }

  public onSearchKeyUp(event: KeyboardEvent) {
    if (event.key === 'Backspace' || event.key === 'Delete') {
      this.teclaBorradoPresionada.set(false);
      this.aplicarBusqueda((event.target as HTMLInputElement).value);
    }
  }

  private aplicarBusqueda(nombre: string) {
    this.nameTech.set(nombre);
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
      this.professionalTechnologies.set(data.data);
      this.isLoading.set(false);
    });
  }

  // Obtiene las tecnologías del profesional en la primera renderización
  private async obtenerTecnologias() {
    this.isLoading.set(true);

    try {
      const data = await firstValueFrom(this._technologyService.obterTecnologiasDesarrollador(this.nameTech() ?? ''));      
      this.professionalTechnologies.set(data.data);
    } catch (error) {
      console.error('Error al obtener tecnologías:', error);
      this.alertService.error('Error', 'Error al obtener tecnologías');
    } finally {
      this.isLoading.set(false);
    }
  }

  async eliminarTecnologia(profesionalTecnologiaUUID: string) {
    const confirmed = await this.alertService.question('Confirmar', '¿Estás seguro de que deseas eliminar esta tecnología?');
    if (!confirmed) return;
    
    this.isLoadingTransparent.set(true);

    try {
      await firstValueFrom(this._technologyService.eliminarTecnologiaProfesional(profesionalTecnologiaUUID));
      this.alertService.success('Éxito', 'Tecnología eliminada correctamente');
      this.obtenerTecnologias();
    } catch (error) {
      console.error('Error al eliminar tecnología:', error);
      this.alertService.error('Error', 'Error al eliminar tecnología');
    } finally {
      this.isLoadingTransparent.set(false);
    }
  }
}
