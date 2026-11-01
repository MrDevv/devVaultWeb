import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AuthService } from '@auth/services/auth-service';
import { Loading } from '@shared/components/loading/loading';
import { AlertService } from '@shared/services/alert-service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-reset-password',
  imports: [Loading, ReactiveFormsModule, RouterLink],
  templateUrl: './reset-password.html',
})
export class ResetPassword {
  public isLoading = signal(false);
  public isChangePassword = signal(false);
  public currentYear = new Date().getFullYear();

  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly alertService = inject(AlertService);
  private readonly token = inject(ActivatedRoute).snapshot.paramMap.get('token');

  constructor() {
    console.log(this.token);    
  }

  resetPasswordForm = this.fb.group({
    newPassword: ['']
  });

  async resetPassword() {
    if (!this.token) return;
    try {
      this.isLoading.set(true);
      if (!this.validarPassword()) return;
      const { newPassword } = this.resetPasswordForm.value;
      await firstValueFrom(this.authService.resetPassword(this.token, newPassword!));
      this.isChangePassword.set(true);
    } catch (error: any) {
      if (error.code == 404) {
        this.alertService.error('Error', 'Token expirado o inválido');
        return;
      }
      this.alertService.error('Error', 'Ocurrió un error al cambiar la contraseña');
    } finally {
      this.isLoading.set(false);
    }
  }

  validarPassword(): boolean {
    let password = this.resetPasswordForm.value.newPassword;
    password = password?.trim();    
    if (!password) {
      this.alertService.warning('Advertencia', 'Ingresa la nueva contraseña');
      return false;
    }
    return true;
  }
}
