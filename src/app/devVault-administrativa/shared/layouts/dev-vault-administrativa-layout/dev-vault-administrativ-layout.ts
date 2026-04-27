import { Component, inject, ResourceRef } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { SideBarService } from '@guide/services/side-bar-service';
import { NavBar } from "@shared/components/nav-bar/nav-bar";
import { SideBar } from '@shared/components/side-bar/side-bar';
import { NavbarAdministrativo } from "@devVault-administrativa/shared/components/navbar-administrativo/navbar-administrativo";

@Component({
  selector: 'app-dev-vault-front-layout',
  imports: [RouterOutlet, NavBar, SideBar, NavbarAdministrativo],
  templateUrl: './dev-vault-administrativa-layout.html'
})
export class DevVaultAdministrativaLayout {
  sideBarService = inject(SideBarService)  
}
