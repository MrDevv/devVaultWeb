import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { APIResponse } from '@shared/interfaces/APIResponse';
import { APIResponseWithPageable } from '@shared/interfaces/APIResponseWithPageable';
import { ResponseTechnology } from '../interfaces/technology.dto';
import { environment } from '@environments/environment';
import { catchError, Observable, of, tap, throwError } from 'rxjs';

const TECHNOLOGIES_ENDPOINT = `${environment.API_URL}/admin/tecnologias`;

type technologiesResponse = APIResponse<APIResponseWithPageable<ResponseTechnology>>;

interface TechnologyCacheEntry {
  response: technologiesResponse;
  expiresAt: number;
}

@Injectable({
  providedIn: 'root',
})
export class TechnologyService {
  
  private readonly http = inject(HttpClient);

  private readonly technologiesCache = new Map<string, TechnologyCacheEntry>();

  private readonly cacheDurationMs = 10 * 60 * 1000; // 10 minutos

  private cacheVersion = 0;

  obtenerTecnologias(size: number = 20, page: number = 0, nombre: string = ''): Observable<technologiesResponse> {

    nombre = nombre.trim();

    const key = `${size}-${page}-${nombre}`;

    const cached = this.technologiesCache.get(key);

    if (cached && cached.expiresAt > Date.now()) {
      return of(cached.response);
    }

    this.technologiesCache.delete(key);

    const version = this.cacheVersion;

    return this.http.get<technologiesResponse>(TECHNOLOGIES_ENDPOINT, {
      params: {        
        size,
        page,
        ...(nombre ? { nombre: nombre } : {}),
      }
    }).pipe(
      tap(response => {
        if (version === this.cacheVersion) {
          this.technologiesCache.set(key, {
            response,
            expiresAt: Date.now() + this.cacheDurationMs
          });
        }
      }),
      catchError((error) => {
        return throwError(() => error.error)
      })
    )
  }


}
