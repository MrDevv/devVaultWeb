import { Component, inject } from '@angular/core';
import { AuthService } from '@auth/services/auth-service';

@Component({
  selector: 'app-home-page',
  imports: [],
  templateUrl: './home-page.html',
  styleUrl: './home-page.css',
})
export class HomePage {
  public authService = inject(AuthService);

  

}
