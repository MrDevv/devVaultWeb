import { Component, input } from '@angular/core';

@Component({
  selector: 'profile-avatar-banner',
  imports: [],
  templateUrl: './profile-avatar-banner.html',
})
export class ProfileAvatarBanner {
  public logoUrl = input<string | null | undefined>();
}
