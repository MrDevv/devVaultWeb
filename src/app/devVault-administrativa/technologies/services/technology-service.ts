import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '@environments/environment';
import { APIResponse } from '@shared/interfaces/APIResponse';
import { catchError, Observable, of, tap, throwError } from 'rxjs';
import { Technology } from '../interfaces/Technology';


const BASE_URL = environment.API_URL;

@Injectable({
  providedIn: 'root',
})
export class TechnologyService {

  private _technologiesCache = signal<APIResponse<Technology[]> | null>(null);

  private _http = inject(HttpClient);

  obterTecnologiasDesarrollador(): Observable<APIResponse<Technology[]>> {

    if (this._technologiesCache()) {
      return of(this._technologiesCache()!);
    }    
    
    return this._http.get<APIResponse<Technology[]>>(`${BASE_URL}/tecnologias/me`).pipe(      
      tap(resp => this._technologiesCache.set(resp)),
      catchError((error) => {
        return throwError(() => error.error)
      })
    )
  }

}