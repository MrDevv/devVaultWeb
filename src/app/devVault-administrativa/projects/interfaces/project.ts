import { ExperienceSimple } from "@devVault-administrativa/experience/interfaces/experience-simple";
import { ProjectType } from "@devVault-administrativa/projects-types/interfaces/project-type";
import { Tag } from "@devVault-administrativa/tags/interfaces/tag";

export interface Project {
    proyecto_uuid: string;
    titulo: string;
    descripcion: string;
    url_produccion: string | null;
    url_repositorio: string | null;
    url_imagen_presentacion: string | null;
    estado: string;
    experiencia: ExperienceSimple,
    tipo_proyecto: ProjectType,
    etiquetas: Tag[]
}
