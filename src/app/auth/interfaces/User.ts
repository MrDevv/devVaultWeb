import { Rol } from "./Rol";

export interface User {
    usuario_uuid: string;
    email: string;
    nombres: string;
    apellidos: string;
    puesto: string;
    rol: Rol;
    estado: string;
    token: string;
    api_key: string | null;
}