import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import type { DashboardApiResponse } from '../interfaces/dashboard.dto';
import { catchError, delay, tap } from 'rxjs/operators';
import { APIResponse } from '@shared/interfaces/APIResponse';
import { throwError, of } from 'rxjs';
import { environment } from '@environments/environment';

const DASHBOARD_API_URL = `${environment.API_URL}/admin/dashboard`;

@Injectable({
  providedIn: 'root',
})
export class DashboardService {

  private http = inject(HttpClient);
  private dashboardDataCache = signal<null | APIResponse<DashboardApiResponse>>(null);

  public obtenerDashboardData(reload: boolean = false) {

    if (this.dashboardDataCache() && !reload) {
      return of(this.dashboardDataCache());
    }

    return this.http.get<APIResponse<DashboardApiResponse>>(DASHBOARD_API_URL).pipe(
      tap(data => this.dashboardDataCache.set(data)),
      catchError(error => throwError(() => error))
    );
  }

}
