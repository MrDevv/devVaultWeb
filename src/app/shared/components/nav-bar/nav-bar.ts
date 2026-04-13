
import { Component, inject, input} from '@angular/core';
import { RouterLink } from "@angular/router";
import { NavBarService } from '../../services/nav-bar-service';
import { SideBarService } from '../../../guide/services/side-bar-service';

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
