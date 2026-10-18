import { Component, inject, signal, OnInit } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { DashboardApiResponse } from '@devVault-administrativa/dashboard/interfaces/dashboard.dto';
import { DashboardService } from '@devVault-administrativa/dashboard/services/dashboard-service';
import { PageHeader } from '@devVault-administrativa/shared/components/page-header/page-header';
import { AlertService } from '@shared/services/alert-service';
import { firstValueFrom } from 'rxjs';
import { LoadingOverlay } from '@shared/components/loading-overlay/loading-overlay';
import { Loading } from '@shared/components/loading/loading';

@Component({
  selector: 'app-dashboard',
  imports: [PageHeader, LoadingOverlay, Loading],
  templateUrl: './dashboard.html',
})
export class Dashboard implements OnInit{

  public dashboardData = signal<DashboardApiResponse | null>(null);
  public isLoading = signal(false);
  public isLoadingTransparente = signal(false);

  private dashboardService = inject(DashboardService);
  private alertService = inject(AlertService);

  ngOnInit(): void {
    this.obtenerDashboardData();
  }

  async obtenerDashboardData(refresh = false) {

    if (refresh) {
      this.isLoadingTransparente.set(true);
    } else {
      this.isLoading.set(true);
    }

    try {
      const response = await firstValueFrom(this.dashboardService.obtenerDashboardData(refresh));      
      this.dashboardData.set(response!.data);
    } catch (error) {
      console.error(error);
      this.alertService.error('Error', 'Error al cargar los datos del dashboard.');
    } finally {
      this.isLoading.set(false);
      this.isLoadingTransparente.set(false);
    }

  }

  refreshDashboardData() {
    this.obtenerDashboardData(true);
  }

}
