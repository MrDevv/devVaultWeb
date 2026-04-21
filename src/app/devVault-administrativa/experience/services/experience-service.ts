import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { catchError, throwError } from 'rxjs';

import { APIResponse } from '@shared/interfaces/APIResponse';
import { APIResponseWithPageable } from '@shared/interfaces/APIResponseWithPageable';
import { Experience } from '@experience/interfaces/Experience'



const BASEURL = environment.API_URL;

@Injectable({
  providedIn: 'root',
})
export class ExperienceService {

  private _http = inject(HttpClient);

  public obtenerExperiencias(size: number = 3, page: number = 0) {
    return this._http.get<APIResponse<APIResponseWithPageable<Experience>>>(`${BASEURL}/experiencias?size=${size}&page=${page}`).pipe(
      catchError((error: HttpErrorResponse) => throwError(() => error.error))
    )
  }

}
