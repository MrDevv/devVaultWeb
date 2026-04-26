import { Component, effect, inject, OnInit, ResourceRef } from '@angular/core';
import { Developer } from '@devVault-administrativa/professional-data/interfaces/Developer';
import { APIResponse } from '@shared/interfaces/APIResponse';
import { rxResource } from '@angular/core/rxjs-interop';
import { ProfessionalDataService } from '@devVault-administrativa/professional-data/services/professional-data-service';
import { FormBuilder, ReactiveFormsModule, Validators, ɵInternalFormsSharedModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'edit-professional-data',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './edit-professional-data.html'  
})
export class EditProfessionalData {
  public professionalDataService = inject(ProfessionalDataService)
  private _fb = inject(FormBuilder);

  formProfessionalData = this._fb.group({
    nombres: ['', Validators.required],
    apellidos: ['', Validators.required],
    puesto: [''],
    biografia: ['', Validators.maxLength(4000)],
    logo_url: [''],
    github_url: [''],
    linkedin_url: [''],
    prefijo_telefono: ['', Validators.pattern('^[0-9]+$')],
    telefono: ['', Validators.pattern('^[0-9]+$')]

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

  editarDatos() {
    console.log(this.formProfessionalData.value);
    
  }

}
