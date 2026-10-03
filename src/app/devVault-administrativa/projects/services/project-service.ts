import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { catchError, delay, Observable, of, tap, throwError } from 'rxjs';

import { APIResponse } from '@shared/interfaces/APIResponse';
import { APIResponseWithPageable } from '@shared/interfaces/APIResponseWithPageable';
import { CreateProject, Project } from '../interfaces/project.dto';
import { environment } from '@environments/environment';

const PROJECTS_ENDPOINT = `${environment.API_URL}/me/proyectos`;

@Injectable({
  providedIn: 'root',
})
export class ProjectService {

  private _http = inject(HttpClient);

  private projectsCache = signal<APIResponse<APIResponseWithPageable<Project>> | null>(null);

  public obtenerProyectos(size: number = 3, page: number = 0, titulo: string = ''): Observable<APIResponse<APIResponseWithPageable<Project>>> {

    const cached = this.projectsCache();

    if (cached && titulo.length < 2) {
      return of(cached);
    }

    if (cached) {
      const content = this.filtrarPorTitulo(cached.data.content, titulo);
      if (content.length > 0) {
        return of({
          ...cached,
          data: {
            ...cached.data,
            content,
          },
        });
      }
    }


    return this._http.get<APIResponse<APIResponseWithPageable<Project>>>(PROJECTS_ENDPOINT, {
      params: {
        size,
        page,
        titulo,
      },
    }).pipe(
      tap((response) => {
        if (response.data.content.length > 0 && !titulo) {
          this.projectsCache.set(response);
        }
      }),
      catchError((error: HttpErrorResponse) => throwError(() => error.error))
    )
  }

  public crearProyecto(proyecto: CreateProject): Observable<APIResponse<Project>> {
    return this._http.post<APIResponse<Project>>(PROJECTS_ENDPOINT, proyecto).pipe(
      tap((response) => {
        this.agregarProyectoAlCache(response.data);
      }),
      catchError((error: HttpErrorResponse) => throwError(() => error.error))
    );
  }

  private agregarProyectoAlCache(proyecto: Project): void {
    const currentCache = this.projectsCache();
    if (!currentCache) {
      return;
    }

    this.projectsCache.set({
      ...currentCache,
      data: {
        content: [proyecto, ...(currentCache?.data.content ?? [])],
        pageableData: {
          ...currentCache?.data.pageableData,
          totalElements: (currentCache?.data.pageableData?.totalElements ?? 0) + 1
        }
      },
    });
  }

  private filtrarPorTitulo(proyectos: Project[], titulo: string): Project[] {
    return proyectos.filter((proyecto) => {
      return proyecto.titulo.toLowerCase().includes(titulo.toLowerCase())
    });
  }

}
