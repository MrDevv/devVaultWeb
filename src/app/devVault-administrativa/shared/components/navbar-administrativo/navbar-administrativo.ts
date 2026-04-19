import { Component, inject } from '@angular/core';
import { AuthService } from '@auth/services/auth-service';

@Component({
  selector: 'navbar-administrativo',  
  imports: [],
  templateUrl: './navbar-administrativo.html'
})
export class NavbarAdministrativo {
  authService = inject(AuthService);
}
