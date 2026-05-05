import { TechnologyType } from "@devVault-administrativa/technologies-types/interfaces/technology-type";

export interface Technology {
    tecnologia_uuid: string;
    tecnologia: string;
    logo_url: string;
    tipo_tecnologia: TechnologyType;    
}