import { Component, inject, ResourceRef } from '@angular/core';
import { RouterLink } from "@angular/router";
import { rxResource } from '@angular/core/rxjs-interop';

import { APIResponse } from '@shared/interfaces/APIResponse';
import { ProfessionalDataService } from '@devVault-administrativa/professional-data/services/professional-data-service';
import { SocialLinkItem } from "@devVault-administrativa/professional-data/pages/professional-data/components/social-link-item/social-link-item";
import { DataField } from "@devVault-administrativa/professional-data/pages/professional-data/components/data-field/data-field";
import { ProfileAvatarBanner } from "@devVault-administrativa/professional-data/pages/professional-data/components/profile-avatar-banner/profile-avatar-banner";
import { PageHeader } from '@devVault-administrativa/shared/components/page-header/page-header';
import { BiographyCard } from "./components/biography-card/biography-card";
import { LoadingOverlay } from '@shared/components/loading-overlay/loading-overlay';
import { Professional } from '@devVault-administrativa/professional-data/interfaces/Professional';

@Component({
  selector: 'professional-data',
  imports: [RouterLink, SocialLinkItem, DataField, ProfileAvatarBanner, PageHeader, BiographyCard, LoadingOverlay],
  templateUrl: './professional-data.html'  
})
export class ProfessionalData {
  private professionalService = inject(ProfessionalDataService);

  get professionalData(): Professional | undefined {
    return this.professionalDataResource.value()?.data;
  }

  get telefonoCompleto(): string | null {
    const prefijo = this.professionalData?.prefijo_telefono;
    const telefono = this.professionalData?.telefono;

    if (!prefijo || !telefono) {
      return null;
    }

    return `+${prefijo} ${telefono}`;
  }

  professionalDataResource: ResourceRef<APIResponse<Professional> | undefined> = rxResource({
    stream: () =>{
      return this.professionalService.obtenerDatosProfesionales();
    }
  })
}
