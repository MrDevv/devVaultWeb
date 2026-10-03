import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '@environments/environment';
import { APIResponseWithPageable } from '@shared/interfaces/APIResponseWithPageable';
import { Tag } from '../interfaces/tag';
import { catchError, Observable, of, tap, throwError } from 'rxjs';
import { APIResponse } from '../../../shared/interfaces/APIResponse';


const TAG_API_URL = `${environment.API_URL}/admin/etiquetas`;

@Injectable({
  providedIn: 'root',
})
export class TagService {

  private tagsCache =  signal<APIResponse<APIResponseWithPageable<Tag>> | null>(null);

  private http = inject(HttpClient);

  public obtenerTags(size: number = 30, page: number = 0, nombre: string = ''): Observable<APIResponse<APIResponseWithPageable<Tag>>> {

    const cached = this.tagsCache();

    if (cached && nombre.length < 2) {
      return of(cached);
    }

    if (cached) {
      console.log('hay data en caché');
      
      const content = this.filtrarPorNombre(cached.data.content, nombre);
      if (content.length > 0) {
        return of({
          ...cached,
          data: {
            ...cached.data,
            content,
          },
        });
      }
    }

    console.log('llamando al endpoint');
    

    return this.http.get<APIResponse<APIResponseWithPageable<Tag>>>(TAG_API_URL, {
      params: {
        size: size,
        page: page,
        nombre
      }
    }).pipe(
      tap(response => {
        if (response.data && response.data.content.length > 0) {
          this.tagsCache.set(response)
        }
      }),
      catchError(error => throwError(() => error))
    );
  }

   private filtrarPorNombre(etiquetas: Tag[], nombre: string): Tag[] {
    console.log('buscando en caché: ', nombre);
      return etiquetas.filter((etiqueta) => {
        return etiqueta.descripcion.toLowerCase().includes(nombre.toLowerCase())
      });
    }

}
