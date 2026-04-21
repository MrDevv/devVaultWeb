import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { APIResponse } from '@shared/interfaces/APIResponse';
import { Developer } from '@professional-data/interfaces/Developer'
import { catchError, throwError } from 'rxjs';

const BASEURL = environment.API_URL;

@Injectable({
  providedIn: 'root',
})
export class ProfessionalDataService {
  private _http = inject(HttpClient)

  public obtenerDatosProfesionales() {
    return this._http.get<APIResponse<Developer[]>>(`${BASEURL}/desarrolladores`).pipe(
      catchError((error) => throwError(() => error.error))
    )
  }

}
