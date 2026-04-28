import { Component, effect, inject, ResourceRef, signal } from '@angular/core';
import { Developer } from '@devVault-administrativa/professional-data/interfaces/Developer';
import { APIResponse } from '@shared/interfaces/APIResponse';
import { rxResource } from '@angular/core/rxjs-interop';
import { ProfessionalDataService } from '@devVault-administrativa/professional-data/services/professional-data-service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import Swal from 'sweetalert2';
import { firstValueFrom } from 'rxjs';
import { Loader } from "@shared/components/loader/loader";

@Component({
  selector: 'edit-professional-data',
  imports: [ReactiveFormsModule, RouterLink, Loader],
  templateUrl: './edit-professional-data.html'  
})
export class EditProfessionalData {
  public professionalDataService = inject(ProfessionalDataService)
  private _fb = inject(FormBuilder);
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
      const developer: Developer | undefined = this.professionalData();
      this.formProfessionalData.patchValue(developer!)
    })    
  }


  professionalData(): Developer | undefined {
    return this.professionalDataResource.value()?.data?.[0];
  }

  professionalDataResource: ResourceRef<APIResponse<Developer[]> | undefined> = rxResource({
    stream: () =>{
      return this.professionalDataService.obtenerDatosProfesionales();
    }
  })

  async editarDatos() {
    this.isLoading.set(true);
    const developerUpdate:Developer = {
      ...(this.formProfessionalData.value as any)
    };

    try {
      await firstValueFrom(this.professionalDataService.actualizarDatosProfesionales(developerUpdate));
      Swal.fire({
        icon: "success",
        title: "Éxito",
        text: "Se actualizarón tus datos correctamente."
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
