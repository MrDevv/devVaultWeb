import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { catchError, Observable, of, tap, throwError } from 'rxjs';

import { APIResponse } from '@shared/interfaces/APIResponse';
import { Developer } from '@professional-data/interfaces/Developer'
import { environment } from '@environments/environment';

const BASEURL = environment.API_URL;

@Injectable({
  providedIn: 'root',
})
export class ProfessionalDataService {
  private _http = inject(HttpClient)

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

}
