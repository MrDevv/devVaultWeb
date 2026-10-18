export interface DashboardApiResponse {
  usuarios: UsuariosData;
  contenido: ContenidoData;
}

export interface UsuariosData {
  total: number;
  activos: number;
  pendientes: number;
  inactivos: number;
}

export interface ContenidoData {
  experiencia: number;
  proyectos: number;
}

