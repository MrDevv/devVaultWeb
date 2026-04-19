import { Component, inject, input } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

import { SideBarService } from '@guide/services/side-bar-service';

@Component({
  selector: 'side-bar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './side-bar.html'  
})
export class SideBar {

  sideBarService = inject(SideBarService);

  public page = input<null | string>(null);



}
