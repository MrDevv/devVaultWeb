import { Component, inject, ResourceRef } from '@angular/core';
import { RouterLink } from "@angular/router";
import { rxResource } from '@angular/core/rxjs-interop';

import { APIResponse } from '@shared/interfaces/APIResponse';
import { Developer } from '@devVault-administrativa/professional-data/interfaces/Developer';
import { ProfessionalDataService } from '@devVault-administrativa/professional-data/services/professional-data-service';
import { SocialLinkItem } from "@devVault-administrativa/professional-data/pages/professional-data/components/social-link-item/social-link-item";
import { DataField } from "@devVault-administrativa/professional-data/pages/professional-data/components/data-field/data-field";
import { ProfileAvatarBanner } from "@devVault-administrativa/professional-data/pages/professional-data/components/profile-avatar-banner/profile-avatar-banner";
import { PageHeader } from '@devVault-administrativa/shared/components/page-header/page-header';
import { BiographyCard } from "./components/biography-card/biography-card";
import { LoadingOverlay } from '@shared/components/loading-overlay/loading-overlay';

@Component({
  selector: 'professional-data',
  imports: [RouterLink, SocialLinkItem, DataField, ProfileAvatarBanner, PageHeader, BiographyCard, LoadingOverlay],
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
