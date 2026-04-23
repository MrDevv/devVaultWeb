import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { APIResponse } from '@shared/interfaces/APIResponse';
import { APIResponseWithPageable } from '@shared/interfaces/APIResponseWithPageable';
import { catchError, throwError } from 'rxjs';
import { Project } from '../interfaces/project';

const BASEURL = environment.API_URL;

@Injectable({
  providedIn: 'root',
})
export class ProjectService {

  private _http = inject(HttpClient);

  public obtenerProyectos() {
    return this._http.get<APIResponse<APIResponseWithPageable<Project>>>(`${BASEURL}/proyectos`).pipe(
      catchError((error: HttpErrorResponse) => throwError(() => error.error))
    )
  }

}
