import { DatePipe, TitleCasePipe } from '@angular/common';
import { Component, input } from '@angular/core';
import { ExperienceDetailResponse } from '@devVault-administrativa/experience/interfaces/experience.dto';

@Component({
  selector: 'card-experience-simple',
  imports: [DatePipe, TitleCasePipe],
  templateUrl: './card-experience-simple.html'  
})
export class CardExperienceSimple {
  experiencia = input<ExperienceDetailResponse | null>(null);
}
