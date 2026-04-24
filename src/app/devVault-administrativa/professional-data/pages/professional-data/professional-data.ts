import { Component, inject, ResourceRef } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { Developer } from '@devVault-administrativa/professional-data/interfaces/Developer';
import { ProfessionalDataService } from '@devVault-administrativa/professional-data/services/professional-data-service';
import { NavbarAdministrativo } from "@devVault-administrativa/shared/components/navbar-administrativo/navbar-administrativo";
import { APIResponse } from '@shared/interfaces/APIResponse';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'professional-data',
  imports: [NavbarAdministrativo, RouterLink],
  templateUrl: './professional-data.html'  
})
export class ProfessionalData {
  private professionalService = inject(ProfessionalDataService);

  get professionalData(): Developer | undefined {
    return this.professionalDataResource.value()?.data?.[0];
  }

  professionalDataResource: ResourceRef<APIResponse<Developer[]> | undefined> = rxResource({
    stream: () =>{
      return this.professionalService.obtenerDatosProfesionales();
    }
  })
}
