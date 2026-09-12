import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '@environments/environment';
import { catchError, Observable, of, tap, throwError } from 'rxjs';

import { APIResponse } from '@shared/interfaces/APIResponse';
import { APIResponseWithPageable } from '@shared/interfaces/APIResponseWithPageable';
import {
  CreateExperienceRequest,
  ExperienceDetailResponse,
  ExperienceResponse,
  UpdateExperienceRequest,
} from '@devVault-administrativa/experience/interfaces/experience.dto';

const EXPERIENCES_ENDPOINT = `${environment.API_URL}/me/experiencias`;

type ExperiencePageableResponse = APIResponse<APIResponseWithPageable<ExperienceDetailResponse>>;

@Injectable({
  providedIn: 'root',
})
export class ExperienceService {

  private readonly _http = inject(HttpClient);
  private readonly experienceCache = signal<ExperiencePageableResponse | null>(null);

  public obtenerExperiencias(size: number = 3, page: number = 0, nombreEmpresa: string = ''): Observable<ExperiencePageableResponse> {
    const cached = this.experienceCache();

    if (cached && nombreEmpresa.length < 2) {
      return of(cached);
    }

    if (cached) {
      const content = this.filtrarPorEmpresa(cached.data.content, nombreEmpresa);
      if (content.length > 0) {
        return of({
          ...cached,
          data: {
            ...cached.data,
            content,
          },
        });
      }
    }

    return this._http.get<ExperiencePageableResponse>(EXPERIENCES_ENDPOINT, {
      params: {
        size: size,
        page: page,
        nombre_empresa: nombreEmpresa,
      },
    }).pipe(
      tap((response) => {
        if (response.data.content.length > 0 && !nombreEmpresa) {
          this.experienceCache.set(response);
        }
      }),
      catchError(this.handleHttpError)
    )
  }

  public crearExperiencia(experience: CreateExperienceRequest): Observable<APIResponse<ExperienceResponse>> {
    return this._http.post<APIResponse<ExperienceResponse>>(EXPERIENCES_ENDPOINT, experience).pipe(
      tap((response) => this.addExperienciaEnCache(this.toDetailResponse(response.data))),
      catchError(this.handleHttpError)
    )
  }

  public actualizarExperiencia(experience: UpdateExperienceRequest, experienciaUuid: string): Observable<APIResponse<ExperienceResponse>> {
    return this._http.put<APIResponse<ExperienceResponse>>(`${EXPERIENCES_ENDPOINT}/${experienciaUuid}`, experience).pipe(
      tap((response) => this.updateExperienciaEnCache(experienciaUuid, response.data)),
      catchError(this.handleHttpError)
    )
  }

  public obtenerExperiencia(uuid: string): Observable<APIResponse<ExperienceResponse>> {
    return this._http.get<APIResponse<ExperienceResponse>>(`${EXPERIENCES_ENDPOINT}/${uuid}`).pipe(
      catchError(this.handleHttpError)
    )
  }

  private filtrarPorEmpresa(experiencias: ExperienceDetailResponse[], nombreEmpresa: string): ExperienceDetailResponse[] {
    return experiencias.filter((experiencia) => {
      return experiencia.nombre_empresa.toLowerCase().includes(nombreEmpresa.toLowerCase())
    });
  }

  private toDetailResponse(data: ExperienceResponse): ExperienceDetailResponse {
    return {
      ...data,
      desarrollador: '',
      cantidad_proyectos: 0,
    };
  }

  private addExperienciaEnCache(nuevaExperiencia: ExperienceDetailResponse): void {
    const currentCache = this.experienceCache();
    if (!currentCache) {
      return;
    }

    this.experienceCache.set({
      ...currentCache,
      data: {
        ...currentCache.data,
        content: this.orderExperiencias([nuevaExperiencia, ...currentCache.data.content]),
        pageableData: {
          ...currentCache.data.pageableData,
          totalElements: currentCache.data.pageableData.totalElements + 1,
        },
      },
    });
  }

  private updateExperienciaEnCache(experienciaUuid: string, data: ExperienceResponse): void {
    const currentCache = this.experienceCache();
    if (!currentCache) {
      return;
    }

    const content = currentCache.data.content.map((experiencia) => {
      if (experiencia.experiencia_uuid === experienciaUuid) {
        return {
          ...this.toDetailResponse(data),
          desarrollador: experiencia.desarrollador,
          cantidad_proyectos: experiencia.cantidad_proyectos,
        };
      }
      return experiencia;
    });

    this.experienceCache.set({
      ...currentCache,
      data: {
        ...currentCache.data,
        content: this.orderExperiencias(content),
      },
    });
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

}