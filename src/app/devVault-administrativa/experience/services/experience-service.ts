import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '@environments/environment';
import { catchError, delay, Observable, of, tap, throwError } from 'rxjs';

import { APIResponse } from '@shared/interfaces/APIResponse';
import { APIResponseWithPageable } from '@shared/interfaces/APIResponseWithPageable';
import {
  CreateExperienceRequest,
  ExperienceDetailResponse,
  ExperienceResponse,
  ExperienceWithProjectsResponse,
  UpdateExperienceRequest,
} from '@devVault-administrativa/experience/interfaces/experience.dto';
import { ExperienceSimple } from '../interfaces/experience-simple';

const EXPERIENCES_ENDPOINT = `${environment.API_URL}/me/experiencias`;

type ExperiencePageableResponse = APIResponse<APIResponseWithPageable<ExperienceDetailResponse>>;

interface ExperienceCache {
  response: ExperiencePageableResponse;
  expiresAt: number;
}

@Injectable({
  providedIn: 'root',
})
export class ExperienceService {

  private readonly _http = inject(HttpClient);

  private readonly experienceCache = new Map<string, ExperienceCache>();

  private readonly cacheDurationMs = 10 * 60 * 1000; // 10 minutes

  private cacheVersion = 0;

  // private readonly experienceCache = signal<ExperiencePageableResponse | null>(null);

  public obtenerExperiencias(size: number = 3, page: number = 0, nombreEmpresa: string = ''): Observable<ExperiencePageableResponse> {
    const key = `${size}-${page}-${nombreEmpresa}`;

    const cached = this.experienceCache.get(key);

    if (cached && cached.expiresAt > Date.now()) {
      return of(cached.response);
    }

    this.experienceCache.delete(key);

    const version = this.cacheVersion;

    return this._http.get<ExperiencePageableResponse>(EXPERIENCES_ENDPOINT, {
      params: {
        size: size,
        page: page,
        nombre_empresa: nombreEmpresa,
      },
    }).pipe(
      tap((response) => {
        if (version === this.cacheVersion) {
          this.experienceCache.set(key, {
            response,
            expiresAt: Date.now() + this.cacheDurationMs,
          });
        }
      }),
      catchError(this.handleHttpError)
    )
  }

  public crearExperiencia(experience: CreateExperienceRequest): Observable<APIResponse<ExperienceResponse>> {
    return this._http.post<APIResponse<ExperienceResponse>>(EXPERIENCES_ENDPOINT, experience).pipe(
      tap(() => this.invalidarCache()),
      catchError(this.handleHttpError)
    )
  }

  public actualizarExperiencia(experience: UpdateExperienceRequest, experienciaUuid: string): Observable<APIResponse<ExperienceResponse>> {
    return this._http.put<APIResponse<ExperienceResponse>>(`${EXPERIENCES_ENDPOINT}/${experienciaUuid}`, experience).pipe(
      tap(() => this.invalidarCache()),
      catchError(this.handleHttpError)
    )
  }

  public obtenerExperiencia(uuid: string): Observable<APIResponse<ExperienceResponse>> {
    return this._http.get<APIResponse<ExperienceResponse>>(`${EXPERIENCES_ENDPOINT}/${uuid}`).pipe(
      catchError(this.handleHttpError)
    )
  }

  public eliminarExperiencia(experienciaUUID: string): Observable<APIResponse<void>> {
    return this._http.delete<APIResponse<void>>(`${EXPERIENCES_ENDPOINT}/${experienciaUUID}`).pipe(
      tap(() => this.invalidarCache()),
      catchError(this.handleHttpError)
    )
  }

  public obtenerExperienciasSimple(): Observable<APIResponse<ExperienceSimple[]>> {
    return this._http.get<APIResponse<ExperienceSimple[]>>(`${EXPERIENCES_ENDPOINT}/simple`).pipe(
      catchError(this.handleHttpError)
    )
  }

  public obtenerExperienciaConProyectos(uuid: string): Observable<APIResponse<ExperienceWithProjectsResponse>> {
    return this._http.get<APIResponse<ExperienceWithProjectsResponse>>(`${EXPERIENCES_ENDPOINT}/${uuid}/proyectos`).pipe(
      catchError(this.handleHttpError)
    )
  }


  private toDetailResponse(data: ExperienceResponse): ExperienceDetailResponse {
    return {
      ...data,
      desarrollador: '',
      cantidad_proyectos: 0,
    };
  }


  private orderExperiencias(experiencias: ExperienceDetailResponse[]): ExperienceDetailResponse[] {
    return [...experiencias].sort((a, b) => {
      if (a.fecha_fin === null) return -1;
      if (b.fecha_fin === null) return 1;
      return new Date(b.fecha_fin).getTime() - new Date(a.fecha_fin).getTime();
    });
  }

  private readonly handleHttpError = (error: HttpErrorResponse): Observable<never> => {
    return throwError(() => error.error)
  }

  public invalidarCache(): void {
    this.cacheVersion++;
    this.experienceCache.clear();
  }

}