import { DatePipe, I18nPluralPipe, TitleCasePipe } from '@angular/common';
import { Component, input, output } from '@angular/core';

import { RouterLink } from '@angular/router';
import { ExperienceDetailResponse } from '@devVault-administrativa/experience/interfaces/experience.dto';

@Component({
  selector: 'card-experience-detail',
  imports: [DatePipe, RouterLink, TitleCasePipe, I18nPluralPipe],
  templateUrl: './card-experience-detail.html',
})
export class CardExperienceDetail {
  experience = input.required<ExperienceDetailResponse>();
  UUIDExperienciaEliminar = output<string>();
  UUIDExperienciaVer = output<string>();

  mapeoProyectos: { [k: string]: string } = {
    '=0': 'No hay proyectos vinculados',
    '=1': '1 proyecto vinculado',
    'other': '# proyectos vinculados'
  };

  emitirUUIDExperienciaEliminar() {
    this.UUIDExperienciaEliminar.emit(this.experience().experiencia_uuid);
  }
  emitirUUIDExperienciaVer() {
    this.UUIDExperienciaVer.emit(this.experience().experiencia_uuid);
  }

}