import { HttpErrorResponse, HttpHandlerFn, HttpRequest } from "@angular/common/http";
import { catchError, throwError } from "rxjs";
import Swal from "sweetalert2";

export function authInterceptor(req: HttpRequest<unknown>,next: HttpHandlerFn){

    const newReq = req.clone({

    })
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {      
      const esRutaAutenticacion =  error.url?.includes('auth/login');
      
      if (error.status == 401 && esRutaAutenticacion) {
        return throwError(() => error)
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