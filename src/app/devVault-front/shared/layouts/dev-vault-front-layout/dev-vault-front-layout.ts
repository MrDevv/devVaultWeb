import { Component, inject } from '@angular/core';
import { RouterOutlet, RouterLinkActive, RouterLinkWithHref } from '@angular/router';
import { SideBarService } from '../../../../guide/services/side-bar-service';
import { NavBar } from "@shared/components/nav-bar/nav-bar";

@Component({
  selector: 'app-dev-vault-front-layout',
  imports: [RouterOutlet, RouterLinkActive, RouterLinkWithHref, NavBar],
  templateUrl: './dev-vault-front-layout.html',
  styleUrl: './dev-vault-front-layout.css',
})
export class DevVaultFrontLayout {
  sideBarService = inject(SideBarService)
}
