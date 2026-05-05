import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { catchError, map, Observable, of, tap, throwError } from 'rxjs';

import { APIResponse } from '@shared/interfaces/APIResponse';
import { Technology } from '@devVault-administrativa/technologies/interfaces/Technology';
import { environment } from '@environments/environment';

const BASE_URL = environment.API_URL;

@Injectable({
  providedIn: 'root',
})
export class TechnologyService {

  private _technologiesCache = signal<Technology[] | null>(null);

  private _http = inject(HttpClient);

  obterTecnologiasDesarrollador(nombre: string): Observable<Technology[]> {    

    if (this._technologiesCache() && (!nombre || nombre.length < 3)) {
      return of(this._technologiesCache()!);
    }

    if (nombre.length >= 3 && this._technologiesCache()) {
      const resp = this._technologiesCache()!.filter(tech => {        
        return tech.tecnologia.toLowerCase().includes(nombre.toLowerCase())
      });
      
      if (resp.length > 0) {
        return of(resp);
      }
    }    
    
    return this._http.get<APIResponse<Technology[]>>(`${BASE_URL}/tecnologias/me`, {
      params: {
        ...(nombre ? { nombre } : {})
      }
    }).pipe(      
      tap((resp: APIResponse<Technology[]>) => {
        if (resp.data.length > 0) {
          this._technologiesCache.set(resp.data)
        }
      }),
      map((resp: APIResponse<Technology[]>) => resp.data),
      catchError((error) => {
        return throwError(() => error.error)
      })
    )
  }
}