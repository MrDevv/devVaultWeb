import { TitleCasePipe } from '@angular/common';
import { Component, effect, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { catchError, firstValueFrom, of } from 'rxjs';

import { UpdateProfessionalTechnology } from '@devVault-administrativa/professional-technologies/interfaces/professional-technology.dto';
import { ProfessionalTechnologyService } from '@devVault-administrativa/professional-technologies/services/professional-technology-service';
import { Loading } from '@shared/components/loading/loading';
import { AlertService } from '@shared/services/alert-service';
import { LoadingOverlay } from '@shared/components/loading-overlay/loading-overlay';


type Nivel = 'básico' | 'intermedio' | 'avanzado';

@Component({
  selector: 'app-edit-professional-technology',
  imports: [Loading, LoadingOverlay, RouterLink, TitleCasePipe],
  templateUrl: './edit-professional-technology.html',
})
export class EditProfessionalTechnology {

  // Estado de carga inicial o de busqueda
  public isLoading = signal(false);

  public nivelSelected = signal<Nivel | null>(null);

  private professionalTechnologyService = inject(ProfessionalTechnologyService);
  private alertService = inject(AlertService)
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);

  constructor() {
    effect(() => {
      const nivel = this.professionalTechnologyResource.value()?.data?.nivel;
      if (nivel) {
        this.nivelSelected.set(nivel as Nivel);
      }
    });
  }

  professionalTechnologyResource = rxResource({
    stream: () => this.professionalTechnologyService.obtenerTecnologiaDesarrolladorPorUUID(this.activatedRoute.snapshot.paramMap.get('uuid')!).pipe(
      catchError((error) => {
        console.error(error);
        if (error?.code === 404) {
          this.alertService.errorAndRedirect("Error", "La tecnología del profesional no existe o fue eliminada.", '/technologies');
        }
        return of(undefined);
      })
    )
  })

  seleccionarNivel(nivel: Nivel) {
    if (this.nivelSelected() === nivel) {
      this.nivelSelected.set(null);
      return;
    }

    this.nivelSelected.set(nivel);
  }

  async actualizarTecnologiaDesarrollador() {

    const updateTechnology: UpdateProfessionalTechnology = {
      nivel: this.nivelSelected()?.toLowerCase()
    };

    try {
      this.isLoading.set(true);
      await firstValueFrom(this.professionalTechnologyService.actualizarTecnologiaProfesional(this.professionalTechnologyResource.value()!.data.profesionalTecnologiaUUID, updateTechnology));
      this.router.navigateByUrl('technologies');
    } catch (error: any) {
      console.error('Error al actualizar la tecnología profesional:', error);

      if (error.code == 400) {
        this.alertService.warning('Error', 'Verifique los datos ingresados e intente nuevamente.');
        return;
      }

      this.alertService.error('Error', 'Ocurrió un error al actualizar la tecnología.');
    } finally {
      this.isLoading.set(false);
    }
    
  }
}
