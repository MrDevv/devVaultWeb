import { TechnologyType } from "@devVault-administrativa/technologies-types/interfaces/technology-type";

export interface ResponseTechnology {
  tecnologiaUUID: string;
  tecnologia: string;
  logoURL: string;
  tipoTecnologia: TechnologyType;
}