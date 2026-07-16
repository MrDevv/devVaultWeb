import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { catchError, delay, map, Observable, of, tap, throwError } from 'rxjs';

import { APIResponse } from '@shared/interfaces/APIResponse';
import { TechnologySimple } from '@technologies/interfaces/technology-simple';

import { environment } from '@environments/environment';
import { APIResponseWithPageable } from '@shared/interfaces/APIResponseWithPageable';
import { Technology } from '@technologies/interfaces/Technology';
import { NewTechnologyProfesional } from '../interfaces/new-technology';

const BASE_URL = environment.API_URL;

@Injectable({
  providedIn: 'root',
})
export class TechnologyService {

  private _technologiesDeveloperCache = signal<TechnologySimple[] | null>(null);
  private _technologiesCache = signal<APIResponseWithPageable<Technology> | null>(null);

  private _http = inject(HttpClient);

  obterTecnologiasDesarrollador(nombre: string): Observable<TechnologySimple[]> {    

    if (this._technologiesDeveloperCache() && (!nombre || nombre.length < 2)) {
      return of(this._technologiesDeveloperCache()!);
    }

    if (nombre.length >= 2 && this._technologiesDeveloperCache()) {
      const resp = this._technologiesDeveloperCache()!.filter(tech => {        
        return tech.tecnologia.toLowerCase().includes(nombre.toLowerCase())
      });
      
      if (resp.length > 0) {
        return of(resp);
      }
    }    
    
    return this._http.get<APIResponse<TechnologySimple[]>>(`${BASE_URL}/me/tecnologias`, {
      params: {
        ...(nombre ? { nombre } : {})
      }
    }).pipe(      
      tap((resp: APIResponse<TechnologySimple[]>) => {
        if (resp.data.length > 0) {
          this._technologiesDeveloperCache.set(resp.data)
        }
      }),
      map((resp: APIResponse<TechnologySimple[]>) => resp.data),
      catchError((error) => {
        return throwError(() => error.error)
      })
    )
  }

  obtenerTecnologias(nombre: string): Observable<APIResponseWithPageable<Technology>> {
    
    if (this._technologiesCache() && (!nombre || nombre.length < 2)) {
      return of(this._technologiesCache()!);
    }

    if (nombre.length >= 2 && this._technologiesCache()) {
      const resp = this._technologiesCache()!.content.filter(tech => {        
        return tech.tecnologia.toLowerCase().includes(nombre.toLowerCase())
      });
      
      if (resp.length > 0) {
        return of({...this._technologiesCache()!, content: resp});
      }
    }

    return this._http.get<APIResponse<APIResponseWithPageable<Technology>>>(`${BASE_URL}/admin/tecnologias`, {
      params: {
        ...(nombre ? { nombre } : {}) 
      }
    }).pipe(      
      tap((resp: APIResponse<APIResponseWithPageable<Technology>>) => {
        if (resp.data.content.length > 0 && !nombre) {
          this._technologiesCache.set(resp.data)
        }
      }),
      map((resp: APIResponse<APIResponseWithPageable<Technology>>) => resp.data),
      catchError((error) => {
        return throwError(() => error.error)
      })
    )
  }

  registrarNuevaTecnologiaProfesional(newTechnology: NewTechnologyProfesional) {

  }

  
  eliminarTecnologiaProfesional(uuidTechnology: string) {
    
  }

  clearCache() {
    this._technologiesDeveloperCache.set(null);
    this._technologiesCache.set(null);
  }
}