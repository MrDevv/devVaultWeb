import { Component, effect, inject, input } from '@angular/core';
import { AuthService } from '@auth/services/auth-service';
import { Developer } from '@devVault-administrativa/professional-data/interfaces/Developer';

@Component({
  selector: 'navbar-administrativo',  
  imports: [],
  templateUrl: './navbar-administrativo.html'
})
export class NavbarAdministrativo {  
  authService = inject(AuthService);    

  get obtenerNombresCompletos() {
    const nombres = this.authService.user()?.nombres.split(' ')[0];
    const apellidos = this.authService.user()?.apellidos.split(' ')[0];
    return nombres + ' ' + apellidos;
  }
}
