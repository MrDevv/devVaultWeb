import { NgClass } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { AuthService } from '@auth/services/auth-service';
import { AlertService } from '@shared/services/alert-service';
import { PublicAPIService } from '@devVault-administrativa/public-api/services/public-apiservice';
import { PageHeader } from '@devVault-administrativa/shared/components/page-header/page-header';
import { ClipboardService } from '@shared/services/clipboard-service';
import { firstValueFrom } from 'rxjs';
import { Loading } from '@shared/components/loading/loading';


@Component({
  selector: 'app-manage-api',
  imports: [PageHeader, NgClass, Loading],
  templateUrl: './manage-api.html',
})
export class ManageAPI {
  private readonly publicAPIService = inject(PublicAPIService);
  private readonly alertService = inject(AlertService);
  public readonly authService = inject(AuthService);
  public readonly clipboardService = inject(ClipboardService);
  
  public isLoading = signal(false);

  public showAPIKEY = signal(false);

  async generarAPIKey() {
    this.isLoading.set(true);
    try {
      await firstValueFrom(this.publicAPIService.generarAPIKey());
    } catch (error) {
      console.error('Error al generar la API Key:', error);
      this.alertService.error('Error al generar la API Key');
    } finally {
      this.isLoading.set(false);
    }
  }

  async eliminarAPIKey() {
    const confirmed = await this.alertService.question('Confirmar', '¿Estás seguro de que deseas eliminar tu API Key?');

    if (!confirmed) return

    this.isLoading.set(true);
    try {
      await firstValueFrom(this.publicAPIService.eliminarAPIKey());
    } catch (error) {
      console.error('Error al eliminar la API Key:', error);
      this.alertService.error('Error al eliminar la API Key');
    } finally {
      this.isLoading.set(false);
    }
  }
}
