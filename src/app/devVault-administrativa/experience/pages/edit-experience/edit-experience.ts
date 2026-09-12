import { Component, inject, signal, effect, ResourceRef } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { catchError, firstValueFrom, of } from 'rxjs';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { rxResource } from '@angular/core/rxjs-interop';

import { AlertService } from '@shared/services/alert-service';
import { ExperienceService } from '@devVault-administrativa/experience/services/experience-service';
import { ExperienceResponse, UpdateExperienceRequest } from '@devVault-administrativa/experience/interfaces/experience.dto';
import { APIResponse } from '@shared/interfaces/APIResponse';
import { SectionCardComponent } from '@devVault-administrativa/shared/components/section-card-component/section-card-component';
import { FormTextAreaField } from '@devVault-administrativa/shared/components/form-text-area-field/form-text-area-field';
import { Loading } from '@shared/components/loading/loading';
import { FormInputField } from '@devVault-administrativa/shared/components/form-input-field/form-input-field';

@Component({
  selector: 'edit-experience',
  imports: [ReactiveFormsModule, SectionCardComponent, FormTextAreaField, Loading, FormInputField],
  templateUrl: './edit-experience.html',
})
export class EditExperience {
  public currentExperience = signal(false);
  public isLoading = signal(false);
  
  private experienceService = inject(ExperienceService);
  private fb = inject(FormBuilder);
  private location = inject(Location);
  private route = inject(ActivatedRoute);
  private alertService = inject(AlertService);

  formExperienceData = this.fb.group({
    title: ['', Validators.required],
    puesto: ['', Validators.required],
    descripcion: ['', Validators.required],
    empresa: ['', Validators.required],
    fechaInicio: ['', Validators.required],
    fechaFin: ['', Validators.required]
  })

  experienciaResource: ResourceRef<APIResponse<ExperienceResponse> | undefined> = rxResource({
    stream: () => this.experienceService.obtenerExperiencia(this.route.snapshot.paramMap.get('uuid')!).pipe(
      catchError((error: any) => {
        if (error?.code === 404) {
          this.alertService.errorAndRedirect("Error", "La experiencia solicitada no existe o fue eliminada.", '/experience');
        }
        return of(undefined);
      })
    )
  });

  constructor() {
    effect(() => {
      const fechaFinControl = this.formExperienceData.get('fechaFin');
      if (this.currentExperience()) {
        fechaFinControl?.disable();
        fechaFinControl?.setValue('');
      } else {
        fechaFinControl?.enable();
      }
    });

    effect(() => {
      const experiencia = this.experienciaResource.value()?.data;
      if (experiencia) {
        this.formExperienceData.patchValue({
          title: experiencia.titulo,
          puesto: experiencia.puesto,
          descripcion: experiencia.descripcion,
          empresa: experiencia.nombre_empresa,
          fechaInicio: experiencia.fecha_inicio,
          fechaFin: experiencia.fecha_fin ?? ''
        });

        this.currentExperience.set(!experiencia.fecha_fin);
      }
    });
  }

  toBack() {
    this.location.back();    
  }

  async actualizarExperiencia() {
    if(!this.validarDatos()) {
      return;
    }

    const { title, puesto, descripcion, empresa, fechaInicio, fechaFin } = this.formExperienceData.value;

    const updateExperience: UpdateExperienceRequest = {
      titulo: title!,
      puesto: puesto!,
      nombre_empresa: empresa!,
      fecha_inicio: fechaInicio!,
      fecha_fin: fechaFin ? fechaFin : null,
      descripcion: descripcion!
    }

    try{
      this.isLoading.set(true);
      await firstValueFrom(this.experienceService.actualizarExperiencia(updateExperience, this.experienciaResource.value()!.data.experiencia_uuid))
      this.alertService.successAndRedirect("Éxito", "Se actualizó la experiencia correctamente.", '/experience');
    }catch(err: any) {
      console.error(err);
      if (err.code == 400) {
        this.alertService.error("Error", "Verifique los datos ingresados e intente nuevamente.");
        return;
      }

      if (err.code == 409) {
        this.alertService.error("Error", "La experiencia con este título ya está registrada.");
        return;
      }
    }

    this.isLoading.set(false);
  }

  validarDatos(): boolean {
    const { fechaInicio, fechaFin } = this.formExperienceData.value

    if (fechaInicio && !fechaFin && !this.currentExperience()) {
      this.alertService.warning("Advertencia", "Si actualmente trabaja en esta empresa marcar la opción correspondiente.");
      return false;
    }

    if (fechaInicio && fechaFin) {
      if (fechaFin < fechaInicio) {
        this.alertService.warning("Advertencia", "Las fechas no son válidas.");
        return false;
      }
    }    

    if (this.formExperienceData.invalid) {
      this.alertService.warning("Advertencia", "Ingrese todos los datos obligatorios.");
      return false;
    }

    return true;
  }

}