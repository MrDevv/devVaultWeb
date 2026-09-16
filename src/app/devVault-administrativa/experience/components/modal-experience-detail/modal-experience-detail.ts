import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TitleCasePipe, DatePipe, I18nPluralPipe } from '@angular/common';

import { ModalService } from '@shared/services/modal-service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-modal-experience-detail',
  imports: [TitleCasePipe, DatePipe, I18nPluralPipe, RouterLink],
  templateUrl: './modal-experience-detail.html'
})
export class ModalExperienceDetail {
  
  public modalService = inject(ModalService);
  public matDialog = inject(MAT_DIALOG_DATA);
  public experienceWithProjects!: any;
  
  constructor() {
    this.experienceWithProjects = this.matDialog.data;
  }

  mapeoProyectos: { [k: string]: string } = {    
    '=1': '1 proyecto',
    'other': '# proyectos' 
  };

  cerrarModal(): void{
      this.modalService.closeModal(null);
  }

}
