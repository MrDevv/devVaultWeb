import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from "@angular/router";

import { AuthService } from '@auth/services/auth-service';
import { ErrorAPIResponse } from '@shared/interfaces/ErrorAPIResponse';

import Swal from 'sweetalert2';

@Component({
  selector: 'login-page',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './login-page.html',
  styleUrl: './login-page.css',
})
export class LoginPage {

  router = inject(Router);
  fb = inject(FormBuilder);
  authService = inject(AuthService);

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]]
  })

  login(): void {
    const { email, password } = this.loginForm.value

    if (email?.length == 0 || password?.length == 0) {
      Swal.fire({
            icon: "warning",
            title: "Advertencia",
            text: "Complete todos los datos."
          });

      return;
    }    

    if (this.loginForm.controls.email.errors){
      Swal.fire({
            icon: "warning",
            title: "Advertencia",
            text: "El email ingresado no es válido."
          });

      return;
    }
        
    this.authService.login(email!, password!).subscribe({
      next: () => {        
        this.router.navigateByUrl("/home")
      },
      error(err: ErrorAPIResponse) {
        if (err.code == 401) {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: err.message
          });
        }
      },
    })
    
  }

}
