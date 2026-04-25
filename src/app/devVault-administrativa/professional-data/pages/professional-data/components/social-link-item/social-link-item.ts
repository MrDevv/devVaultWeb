import { NgClass } from '@angular/common';
import { Component, input } from '@angular/core';


@Component({
  selector: 'social-link-item',
  imports: [NgClass],
  templateUrl: './social-link-item.html',
})
export class SocialLinkItem {
  public title = input.required<string>();
  public url = input.required<string | null | undefined>();
  public bgColor = input.required<string>();
  public icon = input.required<string>();
}
