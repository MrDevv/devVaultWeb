import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { AuthService } from '@auth/services/auth-service';
import { environment } from '@environments/environment';
import { catchError, delay, tap, throwError } from 'rxjs';
import { UpdateOrigen } from '../interfaces/public-api.dto';

const ENDPOINT_API = `${environment.API_URL}/me`;

@Injectable({
  providedIn: 'root',
})
export class PublicAPIService {
  private authService = inject(AuthService);
  private readonly http = inject(HttpClient)

  generarAPIKey() {
    return this.http.post<{ data: { apiKey: string } }>(`${ENDPOINT_API}/api-key`, {}).pipe(
      tap((response) => this.authService.updateApiKey(response.data.apiKey))
    );
  }

  eliminarAPIKey() {
    return this.http.delete(`${ENDPOINT_API}/api-key`).pipe(
      tap(() => this.authService.updateApiKey(null))
    );
  }

  actualizarDominio(origen: UpdateOrigen) {
    return this.http.patch(`${ENDPOINT_API}/origen-permitido`, origen).pipe(
      tap(() => this.authService.updateOrigen(origen)),
      catchError((error) => throwError(() => error))
    );
  }
}