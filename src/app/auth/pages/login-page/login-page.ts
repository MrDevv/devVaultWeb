import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from "@angular/router";

import { AuthService } from '@auth/services/auth-service';
import { Loading } from "@shared/components/loading/loading";

import { firstValueFrom } from 'rxjs';
import { AlertService } from '@shared/services/alert-service';


@Component({
  selector: 'login-page',
  imports: [RouterLink, ReactiveFormsModule, Loading],
  templateUrl: './login-page.html',
  styleUrl: './login-page.css',
})
export class LoginPage {

  router = inject(Router);
  fb = inject(FormBuilder);
  authService = inject(AuthService);
  private alertService = inject(AlertService);

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]]
  })

  async login() {
    const { email, password } = this.loginForm.value

    if (email?.length == 0 || password?.length == 0) {
      this.alertService.warning("Advertencia", "Complete todos los datos.");
      return;
    }    

    if (this.loginForm.controls.email.errors){
      this.alertService.warning("Advertencia", "El email ingresado no es válido.");
      return;
    }

    try {

      await firstValueFrom(this.authService.login(email!, password!));
      this.router.navigateByUrl("/home")
    
    } catch (error: any) {
      if (error.code === 401) {
        this.alertService.warning("Advertencia", "Usuario o contraseña incorrectos.");      
        return;
      }

      if (error.code == 403) {
        if (error.message.toLowerCase().includes("inactiva")) {
          this.router.navigate(['/auth/suspended-account'], { state: { fromLogin: true } });
          return;
        }

        if (error.message.includes("verificado")) {
          this.router.navigate(['/auth/activate-account'], { state: { fromLogin: true } });
          return;
        }
        
      }

      this.alertService.error("Error", "Ocurrió un error inesperado.");
    }
  }

}
