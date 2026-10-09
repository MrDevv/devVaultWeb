import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { catchError, delay, map, Observable, of, tap, throwError } from 'rxjs';

import { APIResponse } from '@shared/interfaces/APIResponse';

import { environment } from '@environments/environment';
import { CreateProfessionalTechnology, ResponseProfessionalTechnology } from '../interfaces/professional-technology.dto';

const BASE_URL = `${environment.API_URL}/me/tecnologias`;

type professionalTechnologyResponse = APIResponse<ResponseProfessionalTechnology[]>;

interface ProfessionalTechnologyEntry {
  response: professionalTechnologyResponse;
  expiresAt: number;
}

@Injectable({
  providedIn: 'root',
})
export class ProfessionalTechnologyService {
  
  private http = inject(HttpClient);

  // Cache de tecnologías del profesional obtenidos del servidor 
  // La key utiliza el tamaño, la página y el nombre de búsqueda, para identificar de manera única cada solicitud de proyectos
  private readonly professionalTechnologyCache = new Map<string, ProfessionalTechnologyEntry>();

  
  // tiempo de vigencia de cada respuesta
  private readonly cacheExpirationMs = 10 * 60 * 1000; // 10 minutos

  // version de la cache para impedir cachear respuestas antiguas despues ed invalidar la cache
  private cacheVersion = 0;


  obterTecnologiasDesarrollador(nombre: string): Observable<professionalTechnologyResponse> {    
    // crea la llave para esta solicitud basada en el nombre de búsqueda
    const key = `${nombre}`;

    // obtiene la respuesta en caché
    const cached = this.professionalTechnologyCache.get(key);

    // si la respuesta en caché es válida, se devuelve inmediatamente
    if (cached && cached.expiresAt > Date.now()) {
      return of(cached.response);
    }

    // elimina la respuesta en caché si es inválida
    this.professionalTechnologyCache.delete(key);

    // guarda la versión actual de la caché para esta solicitud
    const version = this.cacheVersion;

    return this.http.get<APIResponse<ResponseProfessionalTechnology[]>>(`${BASE_URL}`, {
      params: {
        ...(nombre ? { nombre } : {})
      }
    }).pipe(
      tap((resp: APIResponse<ResponseProfessionalTechnology[]>) => {
        if (version === this.cacheVersion) {
          this.professionalTechnologyCache.set(key, {
            response: resp,
            expiresAt: Date.now() + this.cacheExpirationMs
          });
        }
      }),
      catchError((error) => throwError(() => error.error))
    )
  }

  registrarNuevaTecnologiaProfesional(newTechnology: CreateProfessionalTechnology) {
    return this.http.post<APIResponse<ResponseProfessionalTechnology>>(`${BASE_URL}`, newTechnology).pipe(
      tap(() => this.invalidarCache()),
      catchError((error) => throwError(() => error.error))
    );
  }

  eliminarTecnologiaProfesional(uuidTechnology: string) {
    return this.http.delete<APIResponse<ResponseProfessionalTechnology>>(`${BASE_URL}/${uuidTechnology}`).pipe(
      tap(() => this.invalidarCache()),
      catchError((error) => throwError(() => error.error))
    );
  }

  invalidarCache() {
    this.cacheVersion++;
    this.professionalTechnologyCache.clear();
  }
}