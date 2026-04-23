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

  obtenerTextColor(tipoTag :string){
    return `text-[${colorTags[tipoTag]}]`;
  }

  obtenerBgColor(tipoTag :string){
    return `bg-[${colorTags[tipoTag]}]/45`;
  }
}
