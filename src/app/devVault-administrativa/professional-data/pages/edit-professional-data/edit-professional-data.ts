import { Component, effect, inject, ResourceRef, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { rxResource } from '@angular/core/rxjs-interop';

import { Professional } from '@devVault-administrativa/professional-data/interfaces/Developer';
import { APIResponse } from '@shared/interfaces/APIResponse';
import { ProfessionalDataService } from '@devVault-administrativa/professional-data/services/professional-data-service';
import { FormInputField } from "@devVault-administrativa/shared/components/form-input-field/form-input-field";
import { FormTextAreaField } from "@devVault-administrativa/shared/components/form-text-area-field/form-text-area-field";
import { FormIconInputField } from '@devVault-administrativa/shared/components/form-icon-input-field/form-icon-input-field';
import { SectionCardComponent } from "@devVault-administrativa/shared/components/section-card-component/section-card-component";
import { Loading } from "@shared/components/loading/loading";

import Swal from 'sweetalert2';
import { LogoPreviewComponent } from "@devVault-administrativa/shared/components/logo-preview-component/logo-preview-component";

@Component({
  selector: 'edit-professional-data',
  imports: [ReactiveFormsModule, RouterLink, FormInputField, FormTextAreaField, FormIconInputField, SectionCardComponent, Loading, LogoPreviewComponent],
  templateUrl: './edit-professional-data.html'  
})
export class EditProfessionalData {
  public professionalDataService = inject(ProfessionalDataService)
  private _fb = inject(FormBuilder);
  private _router = inject(Router);

  public isLoading = signal(false);

  formProfessionalData = this._fb.group({
    nombres: ['', Validators.required],
    apellidos: ['', Validators.required],
    puesto: [''],
    biografia: ['', Validators.maxLength(4000)],
    logo_url: [''],
    github_url: [''],
    linkedin_url: [''],
    cv_url: [''],
    prefijo_telefono: ['', Validators.pattern('^[0-9]+$')],
    telefono: ['', Validators.pattern('^[0-9]+$')],
    correo_contacto: ['', Validators.email]
  })

  constructor(){
    effect(() => {
      const developer: Professional | undefined = this.professionalData();
      this.formProfessionalData.patchValue(developer!)
    })    
  }


  professionalData(): Professional | undefined {
    return this.professionalDataResource.value()?.data;
  }

  professionalDataResource: ResourceRef<APIResponse<Professional> | undefined> = rxResource({
    stream: () =>{
      return this.professionalDataService.obtenerDatosProfesionales();
    }
  })

  async editarDatos() {
    this.isLoading.set(true);
    const developerUpdate:Professional = {
      ...(this.formProfessionalData.value as any)
    };

    try {
      await firstValueFrom(this.professionalDataService.actualizarDatosProfesionales(developerUpdate));
      Swal.fire({
        icon: "success",
        title: "Éxito",
        text: "Se actualizarón tus datos correctamente."
      }).then(() => {
        this._router.navigateByUrl('/professional-data')
      });
    } catch (error: any) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message
      });
    }
    this.isLoading.set(false);
  }

}
