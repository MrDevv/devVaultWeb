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

  public nuevoDominio = signal<string | null>(this.authService.user()?.origen_permitido ?? null);
  public isEditDominio = signal(false);

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

  async registrarEstadoOrigen() {
    if (!this.nuevoDominio()) {
      this.alertService.warning('Advertencia', 'Debes ingresar un dominio válido');
      return;
    }

    this.isLoading.set(true);
    try {
      if (this.nuevoDominio()) {
        await firstValueFrom(this.publicAPIService.actualizarDominio({ origenPermitido: this.nuevoDominio()!, estado: true }));
      }
    } catch (error) {
      console.error('Error al registrar el dominio:', error);
      this.alertService.error('Error al registrar el dominio');
    } finally {
      this.isLoading.set(false);
    }
  }

  async cambiarEstadoOrigen(nuevoEstado: boolean) {
    this.isLoading.set(true);
    try {    
      await firstValueFrom(this.publicAPIService.actualizarDominio(
        { 
          origenPermitido: this.authService.user()!.origen_permitido, 
          estado: nuevoEstado 
        }
      ));
    } catch (error) {
      console.error('Error al cambiar el estado del dominio:', error);
      this.alertService.error('Error al cambiar el estado del dominio');
    } finally {
      this.isLoading.set(false);
    }
  }

  editarOrigen() {    
    this.isEditDominio.set(true);
  }

  async actualizarOrigen() {
    if (!this.nuevoDominio()) {
      this.alertService.warning('Advertencia', 'Debes ingresar un dominio válido');
      return;
    }

    this.isLoading.set(true);
    try {
      if (this.nuevoDominio()) {
        await firstValueFrom(this.publicAPIService.actualizarDominio(
          { 
            origenPermitido: this.nuevoDominio()!, 
            estado: this.authService.user()!.estado_origen == 'activo' ? true : false 
          }
        ));
      }
    } catch (error) {
      console.error('Error al registrar el dominio:', error);
      this.alertService.error('Error al registrar el dominio');
    } finally {
      this.isLoading.set(false);
      this.isEditDominio.set(false);
    }    
  }

  async eliminarOrigen() {
    const confirmed = await this.alertService.question('Confirmar', '¿Estás seguro de que deseas eliminar el origen permitido?');

    if (!confirmed) return;

    this.isLoading.set(true);
    try {
      await firstValueFrom(this.publicAPIService.actualizarDominio({ origenPermitido: null, estado: false }));
    } catch (error) {
      console.error('Error al eliminar el dominio:', error);
      this.alertService.error('Error al eliminar el dominio');
    } finally {
      this.isLoading.set(false);
      this.nuevoDominio.set(null)
    }
  }
}