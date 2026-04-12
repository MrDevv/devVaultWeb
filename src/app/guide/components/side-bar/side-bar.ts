import { Component, inject } from '@angular/core';

import { SideBarService } from '../../services/side-bar-service';

@Component({
  selector: 'app-side-bar',
  imports: [],
  templateUrl: './side-bar.html'  
})
export class SideBar {

  sideBarService = inject(SideBarService);
 
  goTo(fragment: string) {
    const el = document.getElementById(fragment);
    const container = document.querySelector('main');
    if (el && container) {
      container.scrollTo({
        top: el.offsetTop - 100,
        behavior: 'smooth'
      });
    }
  } 

}
