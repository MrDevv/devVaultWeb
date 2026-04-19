import { DatePipe, TitleCasePipe } from '@angular/common';
import { Component, input } from '@angular/core';
import { Experience } from '@devVault-administrativa/experience/interfaces/Experience';

@Component({
  selector: 'card-experience-simple',
  imports: [DatePipe, TitleCasePipe],
  templateUrl: './card-experience-simple.html'  
})
export class CardExperienceSimple {
  experiencia = input<Experience | null>(null);
}
