import { computed, Injectable, Signal, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class NavBarService {
  private statusNavbar = signal<boolean>(false);

  isNavBarVisible: Signal<boolean> = computed(()=> this.statusNavbar());


  public open():void {
    this.statusNavbar.set(true);
  }
  
  public close():void {
    this.statusNavbar.set(false);    
  }

  public changeVale(): void{
    this.statusNavbar.set(!this.statusNavbar())
  }
}
