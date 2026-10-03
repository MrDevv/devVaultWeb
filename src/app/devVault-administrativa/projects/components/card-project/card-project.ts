import { NgClass } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { Project } from '@devVault-administrativa/projects/interfaces/project.dto';
import { colorTags } from '@devVault-administrativa/projects/utils/color-tags';

@Component({
  selector: 'card-project',
  imports: [NgClass],
  templateUrl: './card-project.html'
})
export class CardProject {
  public project = input<Project>();
  public UUIDProyectoEliminar = output<string>();
  public UUIDProyectoVer = output<string>();

  obtenerColor(tipoTag :string){
    return colorTags[tipoTag];
  }

  emitirUUIDProyectoEliminar(uuid: string) {
    this.UUIDProyectoEliminar.emit(uuid);
  }

  emitirUUIDProyectoVer(uuid: string) {
    this.UUIDProyectoVer.emit(uuid);
  }
}
