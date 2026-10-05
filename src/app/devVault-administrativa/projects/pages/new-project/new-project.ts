import { Component, computed, effect, ElementRef, inject, signal, viewChild } from '@angular/core';
import { Location, TitleCasePipe } from '@angular/common';
import { catchError, debounceTime, distinctUntilChanged, firstValueFrom, map, of, startWith, switchMap, tap } from 'rxjs';
import { rxResource, toObservable, toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { Tag } from '@devVault-administrativa/tags/interfaces/tag';
import { ProjectTypeService } from '@devVault-administrativa/projects-types/services/project-type-service';
import { ExperienceService } from '@devVault-administrativa/experience/services/experience-service';
import { AlertService } from '@shared/services/alert-service';
import { TagService } from '@devVault-administrativa/tags/services/tag-service';
import { PageHeader } from '@devVault-administrativa/shared/components/page-header/page-header';
import { FormInputField } from '@devVault-administrativa/shared/components/form-input-field/form-input-field';
import { SectionCardComponent } from '@devVault-administrativa/shared/components/section-card-component/section-card-component';
import { LogoPreviewComponent } from '@devVault-administrativa/shared/components/logo-preview-component/logo-preview-component';
import { FormTextAreaField } from '@devVault-administrativa/shared/components/form-text-area-field/form-text-area-field';
import { FormIconInputField } from '@devVault-administrativa/shared/components/form-icon-input-field/form-icon-input-field';
import { ProjectService } from '@devVault-administrativa/projects/services/project-service';
import { LoaderInput } from '@devVault-administrativa/shared/components/loader-input/loader-input';
import { Loading } from '@shared/components/loading/loading';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'new-project',
  imports: [PageHeader, FormInputField, ReactiveFormsModule, SectionCardComponent, FormTextAreaField, FormIconInputField, LogoPreviewComponent, TitleCasePipe, LoaderInput, Loading],
  templateUrl: './new-project.html'  
})
export class NewProject {
  
  etiquetaTitle = signal<string>('');
  isLoading = signal(false);
  isDropdownOpen = signal(false);
  teclaBorradoPresionada = signal(false);

  private etiquetas = signal<Tag[]>([]);
  private tagSearchInput = viewChild<ElementRef<HTMLInputElement>>('tagSearchInput');

  private fb = inject(FormBuilder);
  private experienceService = inject(ExperienceService);
  private projectTypeService = inject(ProjectTypeService);
  private tagService = inject(TagService);
  private location = inject(Location);
  private alertService = inject(AlertService);
  private projectService = inject(ProjectService);
  private activeRoute = inject(ActivatedRoute);
  private router = inject(Router);
  
  private experienciaUUIDParam = this.activeRoute.snapshot.queryParamMap.get('experience');


  formProyectoData = this.fb.group({
    titulo: ['', Validators.required],
    descripcion: ['', Validators.required],
    urlProduccion: [''],
    urlRepositorio: [''],
    urlImagenPresentacion: [''],
    experienciaUUID: [null as string | null, Validators.required],
    tipoProyectoUUID: [null, Validators.required],
    etiquetas: [[] as Tag[]]
  })

  resourceExperienciasSimple = rxResource({
    stream: () => this.experienceService.obtenerExperienciasSimple()
  });

  resourceTiposProyectos = rxResource({
    stream: () => this.projectTypeService.obtenerTiposProyectos()
  });

  private etiquetasControl = this.formProyectoData.controls.etiquetas;

  etiquetasSeleccionadas = toSignal(
    this.etiquetasControl.valueChanges.pipe(
      startWith(this.etiquetasControl.value),
      map((value) => value ?? [])
    ),
    { initialValue: []}
  );

  etiquetasDisponibles = computed(() => {
    const seleccionadas: string[] = this.etiquetasSeleccionadas().map(tag => tag.etiqueta_uuid);
    return this.etiquetas().filter((tag) => !seleccionadas.some((s) => s === tag.etiqueta_uuid));
  });

  constructor() {
    this.buscarEtiquetaPorNombre();
    
    effect(() => {
      const experiencias = this.resourceExperienciasSimple.value();
      const experienciaControl = this.formProyectoData.get('experienciaUUID');

      if (experiencias && this.experienciaUUIDParam) {
        const experiencia = experiencias.data.find(experience => experience.experiencia_uuid === this.experienciaUUIDParam);

        if (experiencia) {
          experienciaControl?.setValue(experiencia.experiencia_uuid);
          experienciaControl?.disable();
        } else {
          this.router.navigateByUrl('experience');
        }
      }
    });
  }

  public onSearchInput(value: string): void {
    if (this.teclaBorradoPresionada()) return;
    this.aplicarBusqueda(value);
  }

  public seleccionarEtiqueta(tag: Tag): void {
    const actuales = this.etiquetasControl.value ?? [];

    if (actuales.some((etiqueta) => etiqueta.etiqueta_uuid === tag.etiqueta_uuid)) {
      return;
    }

    this.etiquetasControl.setValue([...actuales, tag]);
    this.etiquetaTitle.set('');
    this.isDropdownOpen.set(false);
    this.tagSearchInput()?.nativeElement.focus();
  }

  public onSearchKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Backspace' || event.key === 'Delete') {
      this.teclaBorradoPresionada.set(true);
    }
  }

  public onSearchKeyUp(event: KeyboardEvent): void {
    if (event.key === 'Backspace' || event.key === 'Delete') {
      this.teclaBorradoPresionada.set(false);
      this.aplicarBusqueda((event.target as HTMLInputElement).value);
    }
  }

  public eliminarEtiqueta(etiquetaUUID: string): void {
    const actuales = this.etiquetasControl.value ?? [];
    this.etiquetasControl.setValue(actuales.filter((etiqueta) => etiqueta.etiqueta_uuid !== etiquetaUUID));
  }

  private aplicarBusqueda(value: string): void {
    this.etiquetaTitle.set(value);
    this.isDropdownOpen.set(value.trim().length >= 2);
  }

  private buscarEtiquetaPorNombre() {
    toObservable(this.etiquetaTitle).pipe(
      startWith(''),
      debounceTime(400),
      distinctUntilChanged(),
      tap(() => this.isLoading.set(true)),
      switchMap(nombre => this.tagService.obtenerTags(100, 0, nombre.trim()).pipe(
        catchError(error => {
          console.error(error);
          return of(null);
        })
      ))
    ).subscribe(response => {
      if (response) {
        this.etiquetas.set(response.data.content);
      }
      this.isLoading.set(false);
    });
  }

  async guardarProyecto() {
    if (!this.validarDatosProyecto()) return;

    const { titulo, descripcion, experienciaUUID, tipoProyectoUUID, urlProduccion, urlRepositorio, urlImagenPresentacion, etiquetas } = this.formProyectoData.getRawValue();

    const etiquetasUUID = etiquetas?.map((etiqueta: Tag) => etiqueta.etiqueta_uuid);

    const createProjectDto = {
      titulo: titulo!,
      descripcion: descripcion!,
      urlProduccion: urlProduccion ? urlProduccion : null,
      urlRepositorio: urlRepositorio ? urlRepositorio : null,
      urlImagenPresentacion: urlImagenPresentacion ? urlImagenPresentacion : null,
      experienciaUUID: experienciaUUID!,
      tipoProyectoUUID: tipoProyectoUUID!,
      etiquetas: etiquetasUUID ? etiquetasUUID : []
    };

    try {
      this.isLoading.set(true);
      await firstValueFrom(this.projectService.crearProyecto(createProjectDto));
      this.alertService.success('Proyecto creado', 'El proyecto se ha creado correctamente.');
      this.toBack();
    } catch (error: any) {
      console.error(error);

      if (error.code == 400) {
        this.alertService.error('Error', 'Verifique los datos ingresados e intente nuevamente.');
        return;
      }

      if (error.code == 409) {
        this.alertService.error('Error', 'La experiencia con este título ya está registrada.');
        return;
      }

      this.alertService.error('Error', 'Ocurrió un error al crear el proyecto.');
    } finally {
      this.isLoading.set(false);
    }

  }

  validarDatosProyecto() {
    const { titulo, descripcion, experienciaUUID, tipoProyectoUUID } = this.formProyectoData.getRawValue();
    
    if (!experienciaUUID) {
      this.alertService.warning('Advertencia', 'Debes seleccionar una experiencia.');
      return false;
    }

    if (!titulo) {
      this.alertService.warning('Advertencia', 'El campo "Título" es obligatorio.');
      return false;
    }

    if (!descripcion) {
      this.alertService.warning('Advertencia', 'El campo "Descripción" es obligatorio.');
      return false;
    }

    if (!tipoProyectoUUID) {
      this.alertService.warning('Advertencia', 'Debes seleccionar un tipo de proyecto.');
      return false;
    }

    if (this.formProyectoData.invalid) {
      this.alertService.warning('Advertencia', 'Por favor completa todos los campos requeridos.');
      return false;
    }

    return true;
  }

  toBack() {
    this.location.back();
  }

}