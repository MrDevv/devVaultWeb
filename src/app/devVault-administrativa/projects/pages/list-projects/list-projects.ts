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
  public titleProject = signal<string | null>(null);
  public isLoading = signal<boolean>(false);
  public isLoadingTransparent = signal<boolean>(false);
  public isLoadingMore = signal<boolean>(false);

  public teclaBorradoPresionada = signal<boolean>(false);
  
  public projects = signal<Project[]>([]);

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

  public onSearchInput(titulo: string) {
    if (this.teclaBorradoPresionada()) return;
    this.aplicarBusqueda(titulo);
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

  private aplicarBusqueda(titulo: string) {
    this.titleProject.set(titulo);
  }

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

  public eliminarProyecto(uuid: string) {}

  public verProyecto(uuid: string) {}

}