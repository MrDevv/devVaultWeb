import { Component, effect, input } from '@angular/core';
import { Developer } from '@devVault-administrativa/professional-data/interfaces/Developer';

@Component({
  selector: 'navbar-administrativo',  
  imports: [],
  templateUrl: './navbar-administrativo.html'
})
export class NavbarAdministrativo {  
  dataDeveloper = input<Developer | undefined>(undefined);

  get obtenerNombresCompletos() {
    const nombres = this.dataDeveloper()?.nombres.split(' ')[0];
    const apellidos = this.dataDeveloper()?.apellidos.split(' ')[0];
    return nombres + ' ' + apellidos;
  }
}
