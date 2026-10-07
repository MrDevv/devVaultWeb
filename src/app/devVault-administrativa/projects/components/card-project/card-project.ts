import { NgClass } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { Project } from '@devVault-administrativa/projects/interfaces/project.dto';
import { colorTags } from '@devVault-administrativa/projects/utils/color-tags';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'card-project',
  imports: [NgClass, RouterLink],
  templateUrl: './card-project.html'
})
export class CardProject {
  public project = input<Project>();
  public UUIDProyectoEliminar = output<string>();
  public UUIDProyectoVer = output<string>();
  public UUIDExperienciaVer = output<string>();

  obtenerColor(tipoTag :string){
    return colorTags[tipoTag];
  }

  emitirUUIDProyectoEliminar() {
    this.UUIDProyectoEliminar.emit(this.project()!.proyecto_uuid);
  }

  emitirVerExperiencia() {
    this.UUIDExperienciaVer.emit(this.project()!.experiencia!.experiencia_uuid);
  }

  emitirUUIDProyectoVer() {
    this.UUIDProyectoVer.emit(this.project()!.proyecto_uuid);
  }
}
