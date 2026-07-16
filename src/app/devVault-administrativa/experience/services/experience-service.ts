import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '@environments/environment';
import { catchError, of, throwError, Observable, tap, delay } from 'rxjs';

import { APIResponse } from '@shared/interfaces/APIResponse';
import { APIResponseWithPageable } from '@shared/interfaces/APIResponseWithPageable';
import { Experience } from '@experience/interfaces/Experience'



const BASEURL = environment.API_URL;

@Injectable({
  providedIn: 'root',
})
export class ExperienceService {
  
  private _http = inject(HttpClient);

  private experienceCache = signal<APIResponse<APIResponseWithPageable<Experience>> | null>(null);

  public obtenerExperiencias(size: number = 3, page: number = 0, nombre_empresa: string = ''): Observable<APIResponse<APIResponseWithPageable<Experience>>> {    

    if (this.experienceCache() && (!nombre_empresa || nombre_empresa.length < 2)) {
      return of(this.experienceCache()!);
    }

    if (nombre_empresa.length >= 2 && this.experienceCache()) {
      const resp = this.experienceCache()!.data.content.filter(exp => {
        return exp.nombre_empresa.toLowerCase().includes(nombre_empresa.toLowerCase())
      });
      
      if (resp.length > 0) {
        return of({...this.experienceCache()!, content: resp});
      }
    }

    return this._http.get<APIResponse<APIResponseWithPageable<Experience>>>(`${BASEURL}/me/experiencias`, {
      params: {
        size: size,
        page: page,
        nombre_empresa: nombre_empresa,
      } 
    }).pipe(
      delay(3000),
      tap((response) => {
        if (response.data.content.length > 0 && !nombre_empresa) {
          this.experienceCache.set(response);
        }
      }),
      catchError((error: HttpErrorResponse) => throwError(() => error.error))
    )
  }

}
