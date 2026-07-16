import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { PageHeader } from "@devVault-administrativa/shared/components/page-header/page-header";
import { LoaderInput } from "@devVault-administrativa/shared/components/loader-input/loader-input";
import { LoadingOverlay } from "@shared/components/loading-overlay/loading-overlay";
import { Experience } from '@devVault-administrativa/experience/interfaces/Experience';

@Component({
  selector: 'list-experience',
  imports: [PageHeader, LoaderInput, LoadingOverlay, RouterLink],
  templateUrl: './list-experience.html'  
})
export class ListExperience {
    public nameTech = signal<string | null>(null);
    public isLoading = signal(false);
    public experiences = signal<Experience[]>([]);

    constructor() { 
      console.log(this.experiences.length);
      
    }
}
