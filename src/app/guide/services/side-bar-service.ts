import { computed, Injectable, Signal, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SideBarService {
    
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
