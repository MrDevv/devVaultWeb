import { afterNextRender, Component, inject, signal } from '@angular/core';
import { AlertService } from '@shared/services/alert-service';
import { PageHeader } from '@devVault-administrativa/shared/components/page-header/page-header';
import { LoaderInput } from '@devVault-administrativa/shared/components/loader-input/loader-input';
import { RouterLink } from '@angular/router';
import { LoadingOverlay } from '@shared/components/loading-overlay/loading-overlay';
import { Loading } from '@shared/components/loading/loading';
import { CardProject } from '@devVault-administrativa/projects/components/card-project/card-project';
import { Project } from '@devVault-administrativa/projects/interfaces/project.dto';
import { ProjectService } from '@devVault-administrativa/projects/services/project-service';
import { firstValueFrom, switchMap, skip, debounceTime, distinctUntilChanged, filter, tap, catchError } from 'rxjs';
import { toObservable } from '@angular/core/rxjs-interop';


@Component({
  selector: 'list-projects',
  imports: [PageHeader, LoaderInput, RouterLink, LoadingOverlay, Loading, CardProject],
  templateUrl: './list-projects.html'  
})
export class ListProjects {
  public titleProject = signal<string | null>(null);
  public isLoading = signal<boolean>(false);
  public isLoadingTransparent = signal<boolean>(false);

  public projects = signal<Project[]>([]);

  private readonly projectService = inject(ProjectService);
  private readonly alertService = inject(AlertService);

  constructor() {
    afterNextRender(() => {
      this.obtenerProyectos();
    });

    this.buscarProyectoPorTitulo();
  }

  public async obtenerProyectos() {
    this.isLoading.set(true); 

    try {
      const data = await firstValueFrom(this.projectService.obtenerProyectos(12, 0, this.titleProject() ?? ''));
      this.projects.set(data.data.content);
    } catch (error: any) {
      if (error.code == 500) {
        this.alertService.error('Ocurrió un error al momento de obtener los proyectos. Por favor, inténtalo de nuevo más tarde.');          
      }
    } finally {
      this.isLoading.set(false);
    }
  }

  public buscarProyectoPorTitulo() {
    toObservable(this.titleProject).pipe(
      skip(1),
      debounceTime(400),
      distinctUntilChanged(),
      filter(titulo => titulo === null || titulo.length === 0 || titulo.length >= 2),
      tap(() => this.isLoading.set(true)),
      switchMap(titulo => {
        return this.projectService.obtenerProyectos(10, 0, titulo ?? '').pipe(
          catchError((error) => {
            console.error(error);
            return [];
          })
        );
      })
    ).subscribe((data) => {
      this.projects.set(data.data.content);
      this.isLoading.set(false);
    });
  }

  public eliminarProyecto(uuid: string) {}

  public verProyecto(uuid: string) {}

}
