import { NgClass } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'nav-bar',
  imports: [RouterLink, NgClass],
  templateUrl: './nav-bar.html'
})
export class NavBar {

  private _isOpen = signal(false);

  public isOpen = computed(() => this._isOpen());

  toggleMenu():void {
    this._isOpen.set(!this._isOpen());
  }

}
