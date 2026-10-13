import { afterNextRender, Component, computed, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { catchError, debounceTime, distinctUntilChanged, EMPTY, filter, finalize, firstValueFrom, skip, switchMap, tap } from 'rxjs';
import { toObservable } from '@angular/core/rxjs-interop';

import { PageHeader } from "@devVault-administrativa/shared/components/page-header/page-header";
import { LoaderInput } from "@devVault-administrativa/shared/components/loader-input/loader-input";
import { LoadingOverlay } from "@shared/components/loading-overlay/loading-overlay";
import { ExperienceService } from '@devVault-administrativa/experience/services/experience-service';
import { ExperienceDetailResponse } from '@devVault-administrativa/experience/interfaces/experience.dto';
import { CardExperienceDetail } from '@devVault-administrativa/experience/components/card-experience-detail/card-experience-detail';
import { AlertService } from '@shared/services/alert-service';
import { Loading } from '@shared/components/loading/loading';
import { ModalService } from '@shared/services/modal-service';
import { ModalExperienceDetail } from '@devVault-administrativa/experience/components/modal-experience-detail/modal-experience-detail';
import { ExperienceWithProjectsResponse } from '../../interfaces/experience.dto';
import { Loader } from '@shared/components/loader/loader';
import { InfiniteScroll } from '@devVault-administrativa/shared/directives/infinite-scroll';

@Component({
  selector: 'list-experience',
  imports: [PageHeader, LoaderInput, InfiniteScroll, LoadingOverlay, RouterLink, CardExperienceDetail, Loading, Loader],
  templateUrl: './list-experience.html'  
})
export class ListExperience implements OnInit {
    // Titulo utilizado para filtrar las experiencias por el nombre de la empresa
    public nameCompany = signal<string | null>(null);

    // Estado de carga inicial o de busqueda
    public isLoading = signal<boolean>(false);

    // Estado de carga transparente para eliminar o ver el detalle de la experiencia relacionada con el proyecto
    public isLoadingTransparent = signal<boolean>(false);

    // Indica si se están cargando más experiencias al hacer scroll
    public isLoadingMore = signal<boolean>(false);

    // Permite posponer la busqueda mientras se presiona la tecla de borrado
    public teclaBorradoPresionada = signal<boolean>(false);

    // Lista de experiencias obtenidas del servidor
    public experiences = signal<ExperienceDetailResponse[]>([]); 
    
    private readonly pageSize = 3;
    private readonly page = signal<number>(0);
    private readonly lastPage = signal<boolean>(false);

    // Indica si hay más experiencias para cargar al hacer scroll
    public readonly hayMasExperiencias = computed(
      () => this.experiences().length > 0 && !this.lastPage() && !this.isLoading()
    );

    private experienceService = inject(ExperienceService);
    private alertService = inject(AlertService);
    private modalService = inject(ModalService);

    constructor() {       
      this.buscarExperienciaPorNombre();
    }
    
    ngOnInit(): void {
      this.obtenerExperiencias();
    }

    // Obtiene las experiencias en la primera renderización
    public async obtenerExperiencias() {
      this.isLoading.set(true); 

      try {
        const data = await firstValueFrom(this.experienceService.obtenerExperiencias(this.pageSize, 0, this.nameCompany() ?? ''));
        this.experiences.set(data.data.content);
        this.page.set(0);
        this.lastPage.set(data.data.pageableData.lastPage);
      } catch (error: any) {
        if (error.code == 500) {
          this.alertService.error('Ocurrió un error al momento de obtener las experiencias. Por favor, inténtalo de nuevo más tarde.');          
        }
      } finally {
        this.isLoading.set(false);
      }
    }

    // Carga más experiencias al hacer scroll
    public async cargarMasExperiencias() {
      if (this.isLoadingMore() || this.isLoading() || this.lastPage()) return;

      const nameCompany = this.nameCompany() ?? '';
      const siguientePagina = this.page() + 1;

      this.isLoadingMore.set(true);

      try {
        const data = await firstValueFrom(this.experienceService.obtenerExperiencias(this.pageSize, siguientePagina, this.nameCompany() ?? ''));

        if(nameCompany !== (this.nameCompany() ?? '')) return;

        this.experiences.update((items) => {
          const yaCargados = new Set(items.map(item => item.experienciaUUID));
          return [...items, ...data.data.content.filter(item => !yaCargados.has(item.experienciaUUID))];
        });

        this.page.set(siguientePagina);
        this.lastPage.set(data.data.pageableData.lastPage);
      } catch (error: any) {
        if (error.code == 500) {
          this.alertService.error('Ocurrió un error al momento de obtener más experiencias. Por favor, inténtalo de nuevo más tarde.');          
        }
      } finally {
        this.isLoadingMore.set(false);
      }
    }
    
    // Actualiza el filtro de búsqueda por nombre de empresa, excepto cuando se está presionando la tecla de borrado
    public onSearchInput(titulo: string) {
      if (this.teclaBorradoPresionada()) return;
      this.aplicarBusqueda(titulo);
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

    // Aplica la búsqueda actualizando el nombre de la empresa
    private aplicarBusqueda(titulo: string) {
      this.nameCompany.set(titulo);
    }


    // Observa los cambios en filtro por nombre de empresa y realiza la búsqueda correspondiente
    // Se omite la primera emisión porque ngOnInit realiza la carga inicial
    // Espera 400 ms sin cambios en el nombre de la empresa de búsqueda antes de realizarla
    private buscarExperienciaPorNombre() {
      toObservable(this.nameCompany).pipe(
        skip(1),
        debounceTime(400),
        distinctUntilChanged(),
        filter(name => name === null || name.length === 0 || name.length >= 2),
        tap(() => this.isLoading.set(true)),
        switchMap(name => {
          this.page.set(0);
          this.lastPage.set(false);

          return this.experienceService.obtenerExperiencias(10, 0, name ?? '').pipe(
            tap((response) => {
              this.experiences.set(response.data.content);
              this.lastPage.set(response.data.pageableData.lastPage);
            }),
            catchError((error) => {
              console.error(error);
              return EMPTY;
            }),
            finalize(() => this.isLoading.set(false))
          );
        })
      ).subscribe();
    }

    async eliminarExperiencia(uuid: string) {
      const confirmed = await this.alertService.question(
        '¿Está seguro de eliminar esta experiencia?',
        'Al eliminar la experiencia también se borrarán los proyectos vinculados.'
      );

      if (!confirmed) {
        return;
      }

      this.isLoadingTransparent.set(true);

      try {
        await firstValueFrom(this.experienceService.eliminarExperiencia(uuid));
        this.obtenerExperiencias();
        this.alertService.success('Experiencia eliminada', 'La experiencia ha sido eliminada correctamente.');
      } catch (error) {
        this.alertService.error('Error', 'Ocurrió un error al intentar eliminar la experiencia.');
      } finally {
        this.isLoadingTransparent.set(false);
      }
    }

    async verExperiencia(uuid: string) {
      try {
        this.isLoadingTransparent.set(true);
        const experiencaProyectos: ExperienceWithProjectsResponse = (await firstValueFrom(this.experienceService.obtenerExperienciaConProyectos(uuid))).data;
        this.modalService.openModal(ModalExperienceDetail, experiencaProyectos, false);
      } catch (error) {
        this.alertService.error('Error', 'Ocurrió un error al intentar ver la experiencia.');
        console.log(error);
        
      } finally {
        this.isLoadingTransparent.set(false);
      }
    }
}
