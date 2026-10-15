import { Component, effect, inject, signal } from '@angular/core';
import { Location } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';

import { FormInputField } from "@devVault-administrativa/shared/components/form-input-field/form-input-field";
import { SectionCardComponent } from "@devVault-administrativa/shared/components/section-card-component/section-card-component";
import { PageHeader } from "@devVault-administrativa/shared/components/page-header/page-header";
import { FormTextAreaField } from "@devVault-administrativa/shared/components/form-text-area-field/form-text-area-field";
import { ExperienceService } from '@devVault-administrativa/experience/services/experience-service';
import { CreateExperienceRequest } from '@devVault-administrativa/experience/interfaces/experience.dto';
import { Loading } from "@shared/components/loading/loading";
import { AlertService } from '@shared/services/alert-service';
import { AdsterraBanner } from '@shared/components/adsterra-banner/adsterra-banner';

@Component({
  imports: [FormInputField, ReactiveFormsModule, SectionCardComponent, PageHeader, FormTextAreaField, Loading, AdsterraBanner],
  templateUrl: './new-experience.html'  
})
export class NewExperience {

  currentExperience = signal(false);
  isLoading = signal(false);

  private experienceService = inject(ExperienceService);
  private fb = inject(FormBuilder);
  private location = inject(Location);
  private router = inject(Router);
  private alertService = inject(AlertService);

  formExperienceData = this.fb.group({
    title: ['', Validators.required],
    puesto: ['', Validators.required],
    descripcion: ['', Validators.required],
    empresa: ['', Validators.required],
    fechaInicio: ['', Validators.required],
    fechaFin: ['', Validators.required]
  })

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
  }

  toBack() {
    this.location.back();    
  }

  async guardarExperiencia() {    
    if(!this.validarDatos()) {
      return;
    }

    const { title, puesto, descripcion, empresa, fechaInicio, fechaFin } = this.formExperienceData.value;

    const createExperience: CreateExperienceRequest = {
      titulo: title!,
      puesto: puesto!,
      nombreEmpresa: empresa!,
      fechaInicio: fechaInicio!,
      fechaFin: fechaFin ? fechaFin : null,
      descripcion: descripcion!
    }

    try{
      this.isLoading.set(true);
      await firstValueFrom(this.experienceService.crearExperiencia(createExperience))
      this.router.navigateByUrl('/experience')
    }catch(err: any) {
      console.error(err);
      if (err.code == 400) {
        this.alertService.warning("Advertencia", "Verifique los datos ingresados e intente nuevamente.");        
        return;
      }

      if (err.code == 409) {
        this.alertService.warning("Advertencia", "La experiencia con este título ya está registrada.");
        return;
      }
    } finally {
      this.isLoading.set(false);
    }

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
