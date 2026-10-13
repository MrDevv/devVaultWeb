import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AuthService } from '@auth/services/auth-service';
import { firstValueFrom } from 'rxjs';
import { LoadingOverlay } from '@shared/components/loading-overlay/loading-overlay';

@Component({
  selector: 'app-confirm-email',
  imports: [RouterLink, LoadingOverlay],
  templateUrl: './confirm-email.html',
})
export class ConfirmEmail {
  public statusCode = signal<number | null>(500);
  public currentYear = new Date().getFullYear();

  private activatedRouter = inject(ActivatedRoute);
  public authService = inject(AuthService);

  private token = this.activatedRouter.snapshot.paramMap.get('token');

  constructor() {
    console.log(this.token);
    
    if (this.token) {
      this.activarCuenta();
    }
  }

  private async activarCuenta() {
    try {
      await firstValueFrom(this.authService.activarCuenta(this.token!));
      this.statusCode.set(200);
    } catch (error: any) {
      if (error.code == 400) {
        this.statusCode.set(400);
      } else if (error.code == 404) {
        this.statusCode.set(404);
      } else {
        this.statusCode.set(500);
      } 
    }
  }
}
