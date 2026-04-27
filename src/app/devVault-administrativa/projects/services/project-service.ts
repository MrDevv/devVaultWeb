import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { catchError, Observable, of, throwError } from 'rxjs';

import { APIResponse } from '@shared/interfaces/APIResponse';
import { APIResponseWithPageable } from '@shared/interfaces/APIResponseWithPageable';
import { Project } from '../interfaces/project';
import { environment } from '@environments/environment';

const BASEURL = environment.API_URL;

@Injectable({
  providedIn: 'root',
})
export class ProjectService {

  private _http = inject(HttpClient);

  private projectsCache = signal<APIResponse<APIResponseWithPageable<Project>> | null>(null);

  public obtenerProyectos(): Observable<APIResponse<APIResponseWithPageable<Project>>> {        

    if (this.projectsCache != null) {
      return of(this.projectsCache()!);
    }

    return this._http.get<APIResponse<APIResponseWithPageable<Project>>>(`${BASEURL}/proyectos`).pipe(
      catchError((error: HttpErrorResponse) => throwError(() => error.error))
    )
  }

}
