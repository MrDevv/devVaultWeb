import { computed, inject, Injectable, Signal, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@auth/services/auth-service';

@Injectable({
  providedIn: 'root',
})
export class SideBarService {
  
  private router = inject(Router);
  public authService = inject(AuthService);

  private statusSidebar = signal<boolean>(false);


  isSideBarVisible: Signal<boolean> = computed(()=> this.statusSidebar());


  public open():void {
    this.statusSidebar.set(true);
  }
  
  public close():void {
    this.statusSidebar.set(false);    
  }

  public changeValue():void {
    this.statusSidebar.set(!this.isSideBarVisible())
  }

  toDirectLanding(){
    this.router.navigate(["/"])
  }

  logout() {
    this.authService.clearData();
    this.close();
    this.router.navigateByUrl('/auth/login');
  }

  goTo(fragment: string) {
    const el = document.getElementById(fragment);
    const container = document.querySelector('main')?.parentElement?.parentElement;    
    
    if (el && container) {
      container.scrollTo({
        top: el.offsetTop - 100,
        behavior: 'smooth'
      });
    }

    this.close();
  } 
}
