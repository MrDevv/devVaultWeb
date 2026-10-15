import { Component, signal, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './auth/services/auth-service';
import { AnalyticsService } from './core/analytics/analytics-service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
  protected readonly title = signal('devVaultWeb');
  authService = inject(AuthService);
  private readonly analyticsService = inject(AnalyticsService);

  ngOnInit(): void {
    this.analyticsService.initialize();
    this.authService.validateToken();
  }
}
