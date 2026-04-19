import { Component, inject } from '@angular/core';

import { AuthService } from '@auth/services/auth-service';
import { NavbarAdministrativo } from '@devVault-front/shared/components/navbar-administrativo/navbar-administrativo';

@Component({
  selector: 'home-page',  
  imports: [NavbarAdministrativo],
  templateUrl: './home-page.html',
  styleUrl: './home-page.css',
})
export class HomePage {
  public authService = inject(AuthService);

  

}
