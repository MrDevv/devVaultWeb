import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { catchError, delay, Observable, of, tap, throwError } from 'rxjs';

import { APIResponse } from '@shared/interfaces/APIResponse';
import { Developer } from '@professional-data/interfaces/Developer'
import { environment } from '@environments/environment';
import { AuthService } from '@auth/services/auth-service';

const BASEURL = environment.API_URL;

@Injectable({
  providedIn: 'root',
})
export class ProfessionalDataService {
  private _http = inject(HttpClient);
  private authService = inject(AuthService);

  private professionalDataCache = signal<APIResponse<Developer[]> | null>(null);  

  public obtenerDatosProfesionales(): Observable<APIResponse<Developer[]>> {
    
    if (this.professionalDataCache()!= null) {
      return of(this.professionalDataCache()!);
    }    
    
    return this._http.get<APIResponse<Developer[]>>(`${BASEURL}/desarrolladores`).pipe(
      tap(resp => this.professionalDataCache.set(resp)),
      catchError((error) => throwError(() => error.error))
    )
  }

  public actualizarDatosProfesionales(developerUpdate: Developer): Observable<APIResponse<Developer>>{
    return this._http.put<APIResponse<Developer>>(`${BASEURL}/desarrolladores`, developerUpdate).pipe(      
      tap((resp) => this.actualizarDatosProfesionalesCache(resp.data)
      ),
      catchError((error: HttpErrorResponse) => throwError(() => error.error))
    )
  }
  
  private actualizarDatosProfesionalesCache(developer: Developer){
    this.authService.updateNamesAndAvatar(developer);

    this.professionalDataCache.update(cache => {
      return {
        ...cache!,
        data: cache!.data.map(() => developer)
      }
    })
  }

  clearCache() {
    this.professionalDataCache.set(null);
  }

}
