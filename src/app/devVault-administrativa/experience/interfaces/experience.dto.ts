export interface CreateExperienceRequest {
    titulo: string;
    puesto: string;
    nombre_empresa: string;
    fecha_inicio: string;
    fecha_fin: string | null;
    descripcion: string;
}

export interface UpdateExperienceRequest {
    titulo: string;
    puesto: string;
    nombre_empresa: string;
    fecha_inicio: string;
    fecha_fin: string | null;
    descripcion: string;
}

export interface ExperienceResponse extends CreateExperienceRequest {
    experiencia_uuid: string
}

export interface ExperienceSimple extends Pick<ExperienceResponse, 'experiencia_uuid' | 'titulo'> {}

export interface ExperienceDetailResponse extends ExperienceResponse {
    desarrollador: string;
    cantidad_proyectos: number;
}