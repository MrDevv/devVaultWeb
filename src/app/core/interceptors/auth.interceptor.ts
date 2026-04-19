import { HttpErrorResponse, HttpHandlerFn, HttpRequest } from "@angular/common/http";
import { inject } from "@angular/core";
import { Router } from "@angular/router";
import { catchError, throwError } from "rxjs";
import Swal from "sweetalert2";

export function authInterceptor(req: HttpRequest<unknown>,next: HttpHandlerFn){

  const router = inject(Router) ;

  const token = localStorage.getItem('token_devVault');

  const newReq = req.clone({
    headers: req.headers.append('Authorization', token ? `Bearer ${token}` : '')
  });

  return next(newReq).pipe(
    catchError((error: HttpErrorResponse) => {

      const esRutaAutenticacion =  error.url?.includes('auth/login');
      
      if (error.status == 401 && esRutaAutenticacion) {
        return throwError(() => error)
      }

      if (error.status == 401) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: error.error.message,
        });
        router.navigateByUrl('/auth/login');
      }
      
      if (error.status == 0) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "El servidor no se encuentra disponible en estos momentos.",
        });
      }

      return throwError(() => error)
    }),
  );
}