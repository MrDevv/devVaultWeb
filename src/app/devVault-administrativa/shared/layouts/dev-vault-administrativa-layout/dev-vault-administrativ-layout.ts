import { Component, inject, ResourceRef } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { SideBarService } from '@guide/services/side-bar-service';
import { NavBar } from "@shared/components/nav-bar/nav-bar";
import { SideBar } from '@shared/components/side-bar/side-bar';
import { NavbarAdministrativo } from "@devVault-administrativa/shared/components/navbar-administrativo/navbar-administrativo";
import { ProfessionalDataService } from '@devVault-administrativa/professional-data/services/professional-data-service';
import { Developer } from '@devVault-administrativa/professional-data/interfaces/Developer';
import { APIResponse } from '@shared/interfaces/APIResponse';
import { rxResource } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-dev-vault-front-layout',
  imports: [RouterOutlet, NavBar, SideBar, NavbarAdministrativo],
  templateUrl: './dev-vault-administrativa-layout.html'
})
export class DevVaultAdministrativaLayout {
  sideBarService = inject(SideBarService)
  professionalService = inject(ProfessionalDataService);

  get professionalData(): Developer | undefined {
    return this.professionalDataResource.value()?.data?.[0];
  }

  professionalDataResource: ResourceRef<APIResponse<Developer[]> | undefined> = rxResource({
    stream: () =>{
      return this.professionalService.obtenerDatosProfesionales();
    }
  })
  

}
