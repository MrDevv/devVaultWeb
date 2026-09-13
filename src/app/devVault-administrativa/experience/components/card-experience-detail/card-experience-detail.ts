import { DatePipe, TitleCasePipe } from '@angular/common';
import { Component, input, output } from '@angular/core';

import { RouterLink } from '@angular/router';
import { ExperienceDetailResponse } from '@devVault-administrativa/experience/interfaces/experience.dto';

@Component({
  selector: 'card-experience-detail',
  imports: [DatePipe, RouterLink, TitleCasePipe],
  templateUrl: './card-experience-detail.html',
})
export class CardExperienceDetail {
  experience = input.required<ExperienceDetailResponse>();
  eliminar = output<string>();
}
