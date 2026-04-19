import { Component, effect, inject, signal } from '@angular/core';
import { RouterLink } from "@angular/router";
import { rxResource } from '@angular/core/rxjs-interop';

import { AuthService } from '@auth/services/auth-service';
import { ExperienceService } from '@devVault-administrativa/experience/services/experience-service';
import { NavbarAdministrativo } from '@devVault-administrativa/shared/components/navbar-administrativo/navbar-administrativo';
import { CardExperienceSimple } from "@devVault-administrativa/experience/components/card-experience-simple/card-experience-simple";

@Component({
  selector: 'home-page',  
  imports: [NavbarAdministrativo, CardExperienceSimple, RouterLink],
  templateUrl: './home-page.html'  
})
export class HomePage {
  public authService = inject(AuthService);
  private experienceService = inject(ExperienceService);
  private size = signal(2);
  private page = signal(0);

  constructor() {
    effect(() => {
      console.log(this.experiencesResource.value());
      console.log(this.experiencesResource.error());
    })  
  }
  

  experiencesResource: any = rxResource({
    params: () => ({size: this.size(), page: this.page()}),
    stream: ({params}) =>{
      return this.experienceService.obtenerExperiencias(params.size, params.page);      
    }
  })
  

}
