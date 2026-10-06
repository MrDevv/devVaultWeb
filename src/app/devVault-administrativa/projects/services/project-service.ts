import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, Observable, of, tap, throwError } from 'rxjs';

import { APIResponse } from '@shared/interfaces/APIResponse';
import { APIResponseWithPageable } from '@shared/interfaces/APIResponseWithPageable';
import { CreateProject, Project } from '../interfaces/project.dto';
import { environment } from '@environments/environment';

const PROJECTS_ENDPOINT = `${environment.API_URL}/me/proyectos`;

type projectsResponse = APIResponse<APIResponseWithPageable<Project>>;

// Respuesta cacheada de los proyectos obtenidos del servidor y su fecha de expiración
interface ProjectsCacheEntry {
  response: projectsResponse;
  expiresAt: number;
}

@Injectable({
  providedIn: 'root',
})
export class ProjectService {

  private readonly http = inject(HttpClient);

  // Cache de proyectos obtenidos del servidor
  // la key utiliza el tamaño, la página y el título para identificar de manera única cada solicitud de proyectos
  private readonly projectsCache = new Map<string, ProjectsCacheEntry>();

  // Tiempo de vigencia de cada respuesta
  private readonly cacheDurationMs = 5 * 60 * 1000; // 5 minutes

  // Versión de la cache para impedir cachear respuestas antiguas después de invalidar la cache
  private cacheVersion = 0;


  public obtenerProyectos(size: number = 3, page: number = 0, titulo: string = ''): Observable<projectsResponse> {    
    // genera la key única para esta solicitud de proyectos basada en el tamaño, la página y el título
    const key = `${size}-${page}-${titulo}`;

    // intenta obtener la respuesta cacheada para esta key
    const cached = this.projectsCache.get(key);

    // si existe una respuesta cacheada y no ha expirado, se devuelve inmediatamente
    if (cached && cached.expiresAt > Date.now()) {
      return of(cached.response);
    }

    // si no hay respuesta cacheada o ha expirado, se elimina la entrada de la cache para esta key
    this.projectsCache.delete(key);

    // guarda la versión actual de la cache para esta solicitud
    const version = this.cacheVersion;

    return this.http.get<projectsResponse>(PROJECTS_ENDPOINT, {
      params: {
        size,
        page,
        titulo,
      },
    }).pipe(
      tap((response) => {
        // solo guarda la respuesta en la cache si la versión de la cache no ha cambiado
        if (version === this.cacheVersion) {
          this.projectsCache.set(key, {
            response,
            expiresAt: Date.now() + this.cacheDurationMs,
          });
        }
      }),
      catchError((error: HttpErrorResponse) => throwError(() => error.error))
    )
  }

  public crearProyecto(proyecto: CreateProject): Observable<APIResponse<Project>> {
    return this.http.post<APIResponse<Project>>(PROJECTS_ENDPOINT, proyecto).pipe(
      // invalida la cache después de crear un nuevo proyecto
      tap(() => this.invalidarCache()),
      catchError((error: HttpErrorResponse) => throwError(() => error.error))
    );
  }

  // Invalida la cache de proyectos aumentando la versión y limpiando la cache actual
  public invalidarCache(): void {
    this.cacheVersion++;
    this.projectsCache.clear();
  }

}
