import { Project } from "@devVault-administrativa/projects/interfaces/project.dto";

export interface CreateExperienceRequest {
    titulo: string;
    puesto: string;
    nombreEmpresa: string;
    fechaInicio: string;
    fechaFin: string | null;
    descripcion: string;
}

export interface UpdateExperienceRequest {
    titulo: string;
    puesto: string;
    nombreEmpresa: string;
    fechaInicio: string;
    fechaFin: string | null;
    descripcion: string;
}

export interface ExperienceResponse extends CreateExperienceRequest {
    experienciaUUID: string
}

export interface ExperienceSimple extends Pick<ExperienceResponse, 'experienciaUUID' | 'titulo'> {}

export interface ExperienceDetailResponse extends ExperienceResponse {
    desarrollador: string;
    cantidadProyectos: number;
}

export interface ExperienceWithProjectsResponse extends ExperienceResponse {
    proyectos: Project[];
}