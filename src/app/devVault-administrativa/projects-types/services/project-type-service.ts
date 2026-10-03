import { Injectable, inject, signal } from '@angular/core';
import { tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';
import { APIResponse } from '@shared/interfaces/APIResponse';
import { ProjectType } from '../interfaces/project-type';


const PROJECT_TYPES_API_URL = `${environment.API_URL}/admin/tipos-proyectos`;

@Injectable({
  providedIn: 'root',
})
export class ProjectTypeService {

  public projectTypesCache = signal<APIResponse<ProjectType[]> | null>(null);

  private http = inject(HttpClient);

  public obtenerTiposProyectos() {
    return this.http.get<APIResponse<ProjectType[]>>(PROJECT_TYPES_API_URL).pipe(
      tap(response => this.projectTypesCache.set(response))
    );
  }

}
