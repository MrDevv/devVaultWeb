import { Component } from '@angular/core';

@Component({
  selector: 'footer-component',
  imports: [],
  templateUrl: './footer.html'  
})
export class Footer {
  public readonly year = new Date().getFullYear();
}
