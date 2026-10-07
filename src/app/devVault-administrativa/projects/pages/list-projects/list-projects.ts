import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { AlertService } from '@shared/services/alert-service';
import { PageHeader } from '@devVault-administrativa/shared/components/page-header/page-header';
import { LoaderInput } from '@devVault-administrativa/shared/components/loader-input/loader-input';
import { InfiniteScroll } from '@devVault-administrativa/shared/directives/infinite-scroll';
import { RouterLink } from '@angular/router';
import { LoadingOverlay } from '@shared/components/loading-overlay/loading-overlay';
import { Loader } from '@shared/components/loader/loader';
import { Loading } from '@shared/components/loading/loading';
import { CardProject } from '@devVault-administrativa/projects/components/card-project/card-project';
import { Project } from '@devVault-administrativa/projects/interfaces/project.dto';
import { ProjectService } from '@devVault-administrativa/projects/services/project-service';
import { firstValueFrom, switchMap, skip, debounceTime, distinctUntilChanged, filter, tap, catchError, finalize, EMPTY } from 'rxjs';
import { toObservable } from '@angular/core/rxjs-interop';


@Component({
  selector: 'list-projects',
  imports: [PageHeader, LoaderInput, InfiniteScroll, RouterLink, LoadingOverlay, Loader, Loading, CardProject],
  templateUrl: './list-projects.html'  
})
export class ListProjects implements OnInit{
  // Titulo utilizado para filtrar los proyectos por su título 
  public titleProject = signal<string | null>(null);

  // Estado de carga inicial o de busqueda
  public isLoading = signal<boolean>(false);

  // Estado de carga transparente para eliminar o ver el detalle de la experiencia relacionada con el proyecto
  public isLoadingTransparent = signal<boolean>(false);

  // Indica si se están cargando más proyectos al hacer scroll
  public isLoadingMore = signal<boolean>(false);

  // Permite posponer la busqueda mientras se presiona la tecla de borrado
  public teclaBorradoPresionada = signal<boolean>(false);
  
  // Lista de proyectos obtenidos del servidor
  public projects = signal<Project[]>([]);

  // Indica si hay más proyectos para cargar al hacer scroll
  public readonly hayMasProyectos = computed(
    () => this.projects().length > 0 && !this.lastPage() && !this.isLoading()
  );

  private readonly pageSize = 12;
  private readonly page = signal<number>(0);
  private readonly lastPage = signal<boolean>(false);

  private readonly projectService = inject(ProjectService);
  private readonly alertService = inject(AlertService);

  constructor() {
    this.buscarProyectoPorTitulo();
  }

  ngOnInit(): void {
    this.obtenerProyectos();
  }

  // Obtiene los proyectos en la primera renderización
  public async obtenerProyectos() {    
    this.isLoading.set(true); 
       
    try {
      const data = await firstValueFrom(this.projectService.obtenerProyectos(this.pageSize, 0, this.titleProject() ?? ''));
      this.projects.set(data.data.content);
      this.page.set(0);
      this.lastPage.set(data.data.pageableData.lastPage);
    } catch (error: any) {
      if (error.code == 500) {
        this.alertService.error('Ocurrió un error al momento de obtener los proyectos. Por favor, inténtalo de nuevo más tarde.');          
      }
    } finally {
      this.isLoading.set(false);
    }
  }

  // Solicita al servidor más proyectos al hacer scroll
  public async cargarMasProyectos() {
    if (this.isLoadingMore() || this.isLoading() || this.lastPage()) return;

    const titulo = this.titleProject() ?? '';
    const siguientePagina = this.page() + 1;

    this.isLoadingMore.set(true);

    try {
      const data = await firstValueFrom(this.projectService.obtenerProyectos(this.pageSize, siguientePagina, titulo));

      if (titulo !== (this.titleProject() ?? '')) return;

      this.projects.update(items => {
        const yaCargados = new Set(items.map(item => item.proyecto_uuid));
        return [...items, ...data.data.content.filter(item => !yaCargados.has(item.proyecto_uuid))];
      });

      this.page.set(siguientePagina);
      this.lastPage.set(data.data.pageableData.lastPage);
    } catch (error: any) {
      if (error.code == 500) {
        this.alertService.error('Ocurrió un error al momento de obtener los proyectos. Por favor, inténtalo de nuevo más tarde.');
      }
    } finally {
      this.isLoadingMore.set(false);
    }
  }

  // Actualiza el filtro de búsqueda por título de proyecto, excepto cuando se está presionando la tecla de borrado
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

  // Aplica la búsqueda actualizando el título del proyecto
  private aplicarBusqueda(titulo: string) {
    this.titleProject.set(titulo);
  }

  // Observa los cambios en filtro por titulo y realiza la búsqueda correspondiente
  // Se omite la primera emisión porque ngOnInit realiza la carga inicial
  // Espera 400 ms sin cambios en el título de búsqueda antes de realizarla
  public buscarProyectoPorTitulo() {
    toObservable(this.titleProject).pipe(
      skip(1),
      debounceTime(400),
      distinctUntilChanged(),
      filter(titulo => titulo === null || titulo.length === 0 || titulo.length >= 2),
      tap(() => this.isLoading.set(true)),
      switchMap(titulo => {
        this.page.set(0);
        this.lastPage.set(false);

        return this.projectService.obtenerProyectos(this.pageSize, 0, titulo ?? '').pipe(
          tap((response) => {
            this.projects.set(response.data.content);
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

  async eliminarProyecto(uuid: string) {

    const confirmed = await this.alertService.question(
      '¿Está seguro de eliminar este proyecto?'
    )

    if (!confirmed) return;
    
    try {
      console.log('eliminando proyecto');      
      this.isLoadingTransparent.set(true);
      await firstValueFrom(this.projectService.eliminarProyecto(uuid));
      this.obtenerProyectos();
    } catch (error: any) {
      this.alertService.error('Error', 'Ocurrió un error al eliminar el proyecto.');
    } finally {
      this.isLoadingTransparent.set(false);
    }
  }

  public verProyecto(uuid: string) {}

}