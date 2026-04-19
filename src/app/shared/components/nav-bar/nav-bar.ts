
import { Component, inject, input} from '@angular/core';
import { RouterLink } from "@angular/router";

import { SideBarService } from '@guide/services/side-bar-service';
import { NavBarService } from '@shared/services/nav-bar-service';

@Component({
  selector: 'nav-bar',
  imports: [RouterLink],
  templateUrl: './nav-bar.html'
})
export class NavBar {

  navBarService = inject(NavBarService);
  sideBarService = inject(SideBarService);

  pageName = input<string>('landing-page');


  isLadingPage(): boolean {
    return this.pageName() == 'landing-page';
  }

}
