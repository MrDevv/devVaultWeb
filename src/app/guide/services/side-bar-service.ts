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
}
