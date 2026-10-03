import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { catchError, delay, Observable, of, tap, throwError } from 'rxjs';

import { APIResponse } from '@shared/interfaces/APIResponse';
import { APIResponseWithPageable } from '@shared/interfaces/APIResponseWithPageable';
import { CreateProject, Project } from '../interfaces/project.dto';
import { environment } from '@environments/environment';

const PROJECTS_ENDPOINT = `${environment.API_URL}/me/proyectos`;

type projectsResponse = APIResponse<APIResponseWithPageable<Project>>;

interface ProjectsCacheEntry {
  response: projectsResponse;
  expiresAt: number;
}

@Injectable({
  providedIn: 'root',
})
export class ProjectService {

  private readonly http = inject(HttpClient);

  private readonly projectsCache = new Map<string, ProjectsCacheEntry>();
  private readonly cacheDurationMs = 3 * 60 * 1000; // 5 minutes

  private cacheVersion = 0;

  public obtenerProyectos(size: number = 3, page: number = 0, titulo: string = ''): Observable<projectsResponse> {    
    const key = `${size}-${page}-${titulo}`;

    const cached = this.projectsCache.get(key);

    if (cached && cached.expiresAt > Date.now()) {
      return of(cached.response);
    }

    this.projectsCache.delete(key);

    const version = this.cacheVersion;

    return this.http.get<projectsResponse>(PROJECTS_ENDPOINT, {
      params: {
        size,
        page,
        titulo,
      },
    }).pipe(
      tap((response) => {
        if (version === this.cacheVersion) {
          this.projectsCache.set(key, {
            response,
            expiresAt: Date.now() + this.cacheDurationMs,
          });

          console.log(this.projectsCache);
        }
      }),
      catchError((error: HttpErrorResponse) => throwError(() => error.error))
    )
  }

  public crearProyecto(proyecto: CreateProject): Observable<APIResponse<Project>> {
    return this.http.post<APIResponse<Project>>(PROJECTS_ENDPOINT, proyecto).pipe(
      tap(() => this.invalidarCache()),
      catchError((error: HttpErrorResponse) => throwError(() => error.error))
    );
  }

  private invalidarCache(): void {
    this.cacheVersion++;
    this.projectsCache.clear();
  }

}
