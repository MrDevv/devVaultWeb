import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class AlertService {

  private router = inject(Router);


  warning(title: string = '', message: string = '') {    
    
    if (message.length == 0) {
      Swal.fire({
        title: title,
        icon: 'warning',
        confirmButtonText: 'Aceptar',
      });

      return;
    }

    Swal.fire({
      title: title,
      text: message,
      icon: 'warning',
      confirmButtonText: 'Aceptar',
    });
  }

  success(title: string = '', message: string = ''){
    Swal.fire({
      title,
      text: message,
      icon: 'success',
      confirmButtonText: 'Aceptar',
    })
  }

  successAndRedirect(title: string = '', message: string = '', url: string){
    Swal.fire({
      title,
      text: message,
      icon: 'success',
      confirmButtonText: 'Aceptar',
    }).then(() => {
      this.router.navigateByUrl(url)
    });
  }

  info(title: string = '', message: string = ''){
    Swal.fire({
      title: title,
      text: message,
      icon: 'info',
      confirmButtonText: 'Aceptar',
    })
  }

  error(title: string = '', message: string = ''){
    Swal.fire({
      title: title,
      text: message,
      icon: 'error',
      confirmButtonText: 'Aceptar',
    })
  }

    errorAndRedirect(title: string = '', message: string = '', url: string){
    Swal.fire({
      title: title,
      text: message,
      icon: 'error',
      confirmButtonText: 'Aceptar',
    }).then(() => {
      this.router.navigateByUrl(url)
    });
  }
}
