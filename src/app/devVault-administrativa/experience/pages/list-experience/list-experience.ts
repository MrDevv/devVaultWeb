import { afterNextRender, Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { PageHeader } from "@devVault-administrativa/shared/components/page-header/page-header";
import { LoaderInput } from "@devVault-administrativa/shared/components/loader-input/loader-input";
import { LoadingOverlay } from "@shared/components/loading-overlay/loading-overlay";
import { Experience } from '@devVault-administrativa/experience/interfaces/Experience';
import { catchError, debounceTime, distinctUntilChanged, filter, firstValueFrom, skip, switchMap, tap } from 'rxjs';
import { ExperienceService } from '@devVault-administrativa/experience/services/experience-service';
import { DatePipe, TitleCasePipe } from '@angular/common';
import { toObservable } from '@angular/core/rxjs-interop';

@Component({
  selector: 'list-experience',
  imports: [PageHeader, LoaderInput, LoadingOverlay, RouterLink, DatePipe, TitleCasePipe],
  templateUrl: './list-experience.html'  
})
export class ListExperience {
    public nameCompany = signal<string | null>(null);
    public isLoading = signal(false);
    public experiences = signal<Experience[]>([]);

    private experienceService = inject(ExperienceService);

    constructor() { 
      afterNextRender(() => {
        this.obtenerExperiencias();
      });

      this.buscarExperienciaPorNombre();
    }

    async obtenerExperiencias() {
      this.isLoading.set(true); 

      try {
        const data = await firstValueFrom(this.experienceService.obtenerExperiencias(10, 0, this.nameCompany() ?? ''));
        console.log(data.data);
        this.experiences.set(data.data.content);
      } catch (error) {
        console.error('Error al obtener experiencias:', error);
      } finally {
        this.isLoading.set(false);
      }
    }

    private buscarExperienciaPorNombre() {
      toObservable(this.nameCompany).pipe(
        skip(1),
        debounceTime(400),
        distinctUntilChanged(),
        filter(name => name === null || name.length === 0 || name.length >= 2),
        tap(() => this.isLoading.set(true)),
        switchMap(name => {
          return this.experienceService.obtenerExperiencias(10, 0, name ?? '').pipe(
            catchError((error) => {
              console.error(error);
              return [];
            })
          );
        })
      ).subscribe((data) => {
        this.experiences.set(data.data.content);
        this.isLoading.set(false);
      });
    }
}
