export interface ResponseProfessionalTechnology {
  profesionalTecnologiaUUID: string;
  tecnologia: string;
  logoURL: string;
  tipoTecnologia: string;
  nivel: string;
}

export interface CreateProfessionalTechnology {
  tecnologiaUUID: string;
  nivel?: string | null;
}

export interface UpdateProfessionalTechnology {
  nivel?: string | null;
}