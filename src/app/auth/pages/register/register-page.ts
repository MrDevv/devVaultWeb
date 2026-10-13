import { Component, inject } from '@angular/core';
import { RouterLink, Router } from '@angular/router';

import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '@auth/services/auth-service';
import { AlertService } from '@shared/services/alert-service';
import { firstValueFrom } from 'rxjs';
import { Loading } from '@shared/components/loading/loading';

@Component({
  selector: 'app-register-page',
  imports: [RouterLink, ReactiveFormsModule, Loading],  
  templateUrl: './register-page.html',
  styleUrl: './register-page.css',
})
export class RegisterPage {
  public currentYear = new Date().getFullYear();
  private fb = inject(FormBuilder);
  public authService = inject(AuthService);
  private router = inject(Router); 
  private alertService = inject(AlertService);

  public registerForm = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
    confirmPassword: ['', Validators.required],
    acceptTerms: [false, Validators.requiredTrue],
  });


  public async registrarUsuario() {
    if (!this.validarCampos()) return;
    if (!this.validarPassword()) return;

    const { firstName, lastName, email, password, confirmPassword } = this.registerForm.value;

    const newUser = {
      nombres: firstName!,
      apellidos: lastName!,
      email: email!,
      password: password!,
      confirmarPassword: confirmPassword!
    };

    try {
      await firstValueFrom(this.authService.register(newUser));
      this.router.navigate(['/auth/activate-account'], { state: { fromRegister: true } });
    } catch (error: any) {
      console.error(error);
      if (error.code === 409) {
        this.alertService.warning('Advertencia', 'El usuario ya está registrado');
        return;
      }
      this.alertService.error('Error', 'No se pudo registrar el usuario');
    }    
  }

  private validarCampos() {

    if (this.registerForm.get('firstName')?.invalid){
      this.alertService.warning('Advertencia', 'El campo nombre es obligatorio');
      return false;
    }

    if (this.registerForm.get('lastName')?.invalid){
      this.alertService.warning('Advertencia', 'El campo apellido es obligatorio');
      return false;
    }

    if (this.registerForm.get('email')?.invalid){
      this.alertService.warning('Advertencia', 'El campo email es obligatorio y debe ser válido');
      return false;
    }

    if (this.registerForm.get('password')?.invalid){
      this.alertService.warning('Advertencia', 'El campo contraseña es obligatorio');
      return false;
    }

    if (this.registerForm.get('confirmPassword')?.invalid){
      this.alertService.warning('Advertencia', 'El campo confirmar contraseña es obligatorio');
      return false;
    }

    if (this.registerForm.get('acceptTerms')?.invalid){
      this.alertService.warning('Advertencia', 'Debe aceptar los términos y condiciones');
      return false;
    }

    return true;  
  }

  private validarPassword() {
    const { password, confirmPassword } = this.registerForm.value;
    if (password !== confirmPassword) {
      this.alertService.warning('Advertencia', 'Las contraseñas no coinciden');
      return false;
    }
    return true;
  }
}
