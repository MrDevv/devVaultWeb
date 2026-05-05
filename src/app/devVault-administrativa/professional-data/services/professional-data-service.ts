import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { catchError, delay, Observable, of, tap, throwError } from 'rxjs';

import { APIResponse } from '@shared/interfaces/APIResponse';
import { Professional } from '@professional-data/interfaces/Developer'
import { environment } from '@environments/environment';
import { AuthService } from '@auth/services/auth-service';

const BASEURL = environment.API_URL;

@Injectable({
  providedIn: 'root',
})
export class ProfessionalDataService {
  private _http = inject(HttpClient);
  private authService = inject(AuthService);

  private professionalDataCache = signal<APIResponse<Professional> | null>(null);  

  public obtenerDatosProfesionales(): Observable<APIResponse<Professional>> {
    
    if (this.professionalDataCache()!= null) {
      return of(this.professionalDataCache()!);
    }    
    
    return this._http.get<APIResponse<Professional>>(`${BASEURL}/me/datos`).pipe(
      tap(resp => this.professionalDataCache.set(resp)),
      catchError((error) => throwError(() => error.error))
    )
  }

  public actualizarDatosProfesionales(professionalUpdate: Professional): Observable<APIResponse<Professional>>{    
    return this._http.put<APIResponse<Professional>>(`${BASEURL}/me/datos`, professionalUpdate).pipe(      
      tap((resp) => this.actualizarDatosProfesionalesCache(resp.data)
      ),
      catchError((error: HttpErrorResponse) => throwError(() => error.error))
    )
  }
  
  private actualizarDatosProfesionalesCache(professional: Professional){
    this.authService.updateNamesAndAvatar(professional);

    this.professionalDataCache.update(cache => {
      return {
        ...cache!,
        data: professional
      }
    })
  }

  clearCache() {
    this.professionalDataCache.set(null);
  }

}
