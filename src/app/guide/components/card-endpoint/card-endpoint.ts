import { Component, inject, input } from '@angular/core';
import { SideBarService } from '@guide/services/side-bar-service';


@Component({
  selector: 'card-endpoint',
  imports: [],
  templateUrl: './card-endpoint.html'  
})
export class CardEndpoint {
  public sideBarService = inject(SideBarService);
  public url = input.required<string>();
  public description = input.required<string>();
}
