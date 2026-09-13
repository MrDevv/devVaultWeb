import { afterNextRender, Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { catchError, debounceTime, distinctUntilChanged, filter, firstValueFrom, skip, switchMap, tap } from 'rxjs';
import { toObservable } from '@angular/core/rxjs-interop';

import { PageHeader } from "@devVault-administrativa/shared/components/page-header/page-header";
import { LoaderInput } from "@devVault-administrativa/shared/components/loader-input/loader-input";
import { LoadingOverlay } from "@shared/components/loading-overlay/loading-overlay";
import { ExperienceService } from '@devVault-administrativa/experience/services/experience-service';
import { ExperienceDetailResponse } from '@devVault-administrativa/experience/interfaces/experience.dto';
import { CardExperienceDetail } from '@devVault-administrativa/experience/components/card-experience-detail/card-experience-detail';
import { AlertService } from '@shared/services/alert-service';
import { Loading } from '@shared/components/loading/loading';

@Component({
  selector: 'list-experience',
  imports: [PageHeader, LoaderInput, LoadingOverlay, RouterLink, CardExperienceDetail, Loading],
  templateUrl: './list-experience.html'  
})
export class ListExperience {
    public nameCompany = signal<string | null>(null);
    public isLoading = signal(false);
    public experiences = signal<ExperienceDetailResponse[]>([]);
    isLoadingDelated = signal(false);

    private experienceService = inject(ExperienceService);
    private alertService = inject(AlertService);

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
        this.experiences.set(data.data.content);
      } catch (error: any) {
        if (error.code == 500) {
          this.alertService.error('Ocurrió un error al momento de obtener las experiencias. Por favor, inténtalo de nuevo más tarde.');          
        }
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

    async eliminarExperiencia(uuid: string) {
      const confirmed = await this.alertService.question(
        '¿Está seguro de eliminar esta experiencia?',
        'Al eliminar la experiencia también se borrarán los proyectos vinculados.'
      );

      if (!confirmed) {
        return;
      }

      this.isLoadingDelated.set(true);

      try {
        await firstValueFrom(this.experienceService.eliminarExperiencia(uuid));
        this.experiences.update((items) => items.filter((exp) => exp.experiencia_uuid !== uuid));
        this.alertService.info('Experiencia eliminada', 'La experiencia ha sido eliminada correctamente.');
      } catch (error) {
        this.alertService.error('Error', 'Ocurrió un error al intentar eliminar la experiencia.');
      } finally {
        this.isLoadingDelated.set(false);
      }
    }
}
