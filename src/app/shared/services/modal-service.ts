import { inject, Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { ComponentType } from '@angular/cdk/portal';

@Injectable({
  providedIn: 'root',
})
export class ModalService {
    private dialog = inject(MatDialog)
    private router = inject(Router)
    private location = inject(Location)

    closeModal(link: string | null, goBack: boolean = false): void{
        this.dialog.closeAll()

        if(link){
            this.router.navigateByUrl(link)
        }

        if(goBack){
            this.location.back()
        }
    }

    openModal<CT, T>(componentRef: ComponentType<CT>, data?: T, isEditing = false): void{
        const config = { data, isEditing }

        this.dialog.open(componentRef, {
            maxWidth: '100vw',
            panelClass: ['dialogo-borde-redondeado', 'dialogo-sin-fondo'],
            backdropClass: 'backdrop-blur-xs',
            data: config,
            disableClose: true
        });
    }  
}
