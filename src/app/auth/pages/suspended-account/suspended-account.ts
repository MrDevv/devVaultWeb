import { Component } from '@angular/core';

@Component({
  selector: 'app-suspended-account',
  imports: [],
  templateUrl: './suspended-account.html'
})
export class SuspendedAccount {
  public currentYear = new Date().getFullYear();
}
