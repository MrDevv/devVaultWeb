import { Component, inject } from '@angular/core';

import { SideBarService } from '../../services/side-bar-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-side-bar',
  imports: [],
  templateUrl: './side-bar.html'  
})
export class SideBar {

  sideBarService = inject(SideBarService);



}
