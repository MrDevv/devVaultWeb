import { Component, effect, inject, ResourceRef, signal } from '@angular/core';
import { RouterLink } from "@angular/router";
import { rxResource } from '@angular/core/rxjs-interop';

import { AuthService } from '@auth/services/auth-service';
import { ExperienceService } from '@devVault-administrativa/experience/services/experience-service';
import { NavbarAdministrativo } from '@devVault-administrativa/shared/components/navbar-administrativo/navbar-administrativo';
import { CardExperienceSimple } from "@devVault-administrativa/experience/components/card-experience-simple/card-experience-simple";
import { ProfessionalDataService } from '@devVault-administrativa/professional-data/services/professional-data-service';
import { APIResponseWithPageable } from '@shared/interfaces/APIResponseWithPageable';
import { APIResponse } from '@shared/interfaces/APIResponse';
import { Experience } from '@devVault-administrativa/experience/interfaces/Experience';
import { Developer } from '@devVault-administrativa/professional-data/interfaces/Developer';
import { ClipboardService } from '@shared/services/clipboard-service';
import { NgClass } from '@angular/common';


@Component({
  selector: 'home-page',  
  imports: [NavbarAdministrativo, CardExperienceSimple, RouterLink, NgClass],
  templateUrl: './home-page.html'  
})
export class HomePage {
  public authService = inject(AuthService);
  private experienceService = inject(ExperienceService);
  private professionalService = inject(ProfessionalDataService);
  public porcentageProfile = signal(0);
  public clipboardService = inject(ClipboardService);

  public showAPIKEY = signal(false);

  private size = signal(2);
  private page = signal(0);

  constructor() {
    effect(() => {
      this.obtenerPorcentajePerfil();
    })
  }

  experiencesResource: ResourceRef<APIResponse<APIResponseWithPageable<Experience>> | undefined> = rxResource({
    params: () => ({size: this.size(), page: this.page()}),
    stream: ({params}) =>{
      return this.experienceService.obtenerExperiencias(params.size, params.page);
    }
  })

  get professionalData(): Developer | undefined {
    return this.professionalDataResource.value()?.data?.[0];
  }


  professionalDataResource: ResourceRef<APIResponse<Developer[]> | undefined> = rxResource({
    stream: () =>{
      return this.professionalService.obtenerDatosProfesionales();
    }
  })

  obtenerPorcentajePerfil(): void {
    const data = this.professionalDataResource.value()?.data?.[0]
    if (data!= null) {
      const values =  Object.values(data);
      const completed = values.filter((v) => v!==null && v != undefined && v != '');
      this.porcentageProfile.set(Math.round((completed.length / values.length) * 100));
    }
  }
  

}
