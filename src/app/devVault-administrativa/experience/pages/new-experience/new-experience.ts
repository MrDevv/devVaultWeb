import { Component, effect, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormInputField } from "@devVault-administrativa/shared/components/form-input-field/form-input-field";
import { SectionCardComponent } from "@devVault-administrativa/shared/components/section-card-component/section-card-component";
import { PageHeader } from "@devVault-administrativa/shared/components/page-header/page-header";
import { FormTextAreaField } from "@devVault-administrativa/shared/components/form-text-area-field/form-text-area-field";
import { Location } from '@angular/common';
import { ExperienceService } from '@devVault-administrativa/experience/services/experience-service';
import Swal from 'sweetalert2';
import { CreateExperienceRequest } from '@devVault-administrativa/experience/interfaces/experience.dto';
import { firstValueFrom } from 'rxjs';
import { Router } from '@angular/router';
import { Loading } from "@shared/components/loading/loading";

@Component({
  selector: 'app-new-experience',
  imports: [FormInputField, ReactiveFormsModule, SectionCardComponent, PageHeader, FormTextAreaField, Loading],
  templateUrl: './new-experience.html'  
})
export class NewExperience {

  currentExperience = signal(false);
  isLoading = signal(false);

  private experienceService = inject(ExperienceService);
  private fb = inject(FormBuilder);
  private location = inject(Location);
  private router = inject(Router);

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
    console.log(this.formExperienceData.value);
    if(!this.validarDatos()) {
      return;
    }

    const { title, puesto, descripcion, empresa, fechaInicio, fechaFin } = this.formExperienceData.value;

    const createExperience: CreateExperienceRequest = {
      titulo: title!,
      puesto: puesto!,
      nombre_empresa: empresa!,
      fecha_inicio: fechaInicio!,
      fecha_fin: fechaFin ? fechaFin : null,
      descripcion: descripcion!
    }

    try{
      this.isLoading.set(true);
      await firstValueFrom(this.experienceService.crearExperiencia(createExperience))
      this.router.navigateByUrl('/experience')
    }catch(err: any) {
      console.error(err);
      if (err.code == 400) {
        Swal.fire({
                icon: "error",
                title: "Error",
                text: "Verifique los datos ingresados e intente nuevamente."
        });

        return;
      }

      if (err.code == 409) {
        Swal.fire({
                icon: "error",
                title: "Error",
                text: "La experiencia con este título ya está registrada."
        });

        return;
      }
    }

    this.isLoading.set(false);
  }

  validarDatos(): boolean {
    const { fechaInicio, fechaFin } = this.formExperienceData.value


    if (fechaInicio && !fechaFin && !this.currentExperience()) {
      Swal.fire({
              icon: "warning",
              title: "Advertencia",
              text: "Si actualmente trabaja en esta empresa marcar la opción correspondiente."
            });
      ;

      return false;
    }

    if (fechaInicio && fechaFin) {
      if (fechaFin < fechaInicio) {
        Swal.fire({
              icon: "warning",
              title: "Advertencia",
              text: "Las fechas no son válidas."
            });
  
        return false;
      }
    }    

    if (this.formExperienceData.invalid) {
      Swal.fire({
              icon: "warning",
              title: "Advertencia",
              text: "Ingrese todos los datos obligatorios."
            });
      ;

      return false;
    }

    return true;
  }
}
