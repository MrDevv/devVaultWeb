import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '@auth/services/auth-service';
import { Loading } from '@shared/components/loading/loading';
import { AlertService } from '@shared/services/alert-service';
import { firstValueFrom } from 'rxjs';


@Component({
  selector: 'app-recover-password',
  imports: [ReactiveFormsModule, Loading],
  templateUrl: './recover-password.html'
})
export class RecoverPassword {
  public isLoading = signal(false);
  public isSendEmail = signal(false);
  public currentYear = new Date().getFullYear();

  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly alertService = inject(AlertService);

  recoverPasswordForm = this.fb.group({
    email: ['']
  });

  async recoverPassword() {
    try {
      this.isLoading.set(true);    
      if (!this.validarDatos()) return;
      const { email } = this.recoverPasswordForm.value;
      await firstValueFrom(this.authService.recoverPassword(email!))
      this.isSendEmail.set(true);
    } catch (error) {
      console.error(error);
      this.alertService.error('Error', 'Ocurrió un error al intentar recuperar la contraseña');
    } finally {
      this.isLoading.set(false);
    }    
  }


  validarDatos() { 
    const { email } = this.recoverPasswordForm.value;
    if (!email) {
      this.alertService.warning('Advertencia', 'El campo email es obligatorio');
      return false;
    }
    return true;
  }
}
