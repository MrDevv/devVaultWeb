import { NgClass } from '@angular/common';
import { Component, input } from '@angular/core';
import { Project } from '@devVault-administrativa/projects/interfaces/project';
import { colorTags } from '@devVault-administrativa/projects/utils/color-tags';

@Component({
  selector: 'card-project',
  imports: [NgClass],
  templateUrl: './card-project.html'
})
export class CardProject {
  public project = input<Project>();

  obtenerColor(tipoTag :string){
    return colorTags[tipoTag];
  }
}
