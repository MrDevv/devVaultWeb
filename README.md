# DevVault Web

Frontend de **DevVault**, una plataforma headless que permite a profesionales administrar su información y utilizarla en portafolios o aplicaciones externas mediante una API REST.

La aplicación ofrece un panel para gestionar perfiles profesionales, experiencias, proyectos y tecnologías, además de configurar las credenciales de integración con la API.

**[Visitar DevVault](https://devvaultmrdevv.netlify.app)** · **[Guía de integración](https://devvaultmrdevv.netlify.app/guide)**

## Funcionalidades

- Registro e inicio de sesión.
- Activación de cuenta mediante un enlace enviado por correo electrónico.
- Gestión de información profesional y enlaces de contacto.
- Creación y edición de experiencias.
- Gestión de proyectos vinculados a experiencias.
- Selección de tecnologías y actualización del nivel de dominio.
- Generación y revocación de API Keys.
- Configuración del origen permitido para las consultas externas.
- Guía de integración de la API.
- Interfaz adaptable a dispositivos móviles y escritorio.


## Tecnologías

| Tecnología | Uso |
|---|---|
| Angular 21 | Framework de la aplicación |
| TypeScript | Lenguaje de desarrollo |
| Angular Router | Navegación y protección de rutas |
| Angular HttpClient | Comunicación con el backend |
| Reactive Forms | Formularios y validaciones |
| Angular Signals | Gestión de estado reactivo |
| RxJS | Flujos asíncronos y eventos |
| Tailwind CSS 4 | Estilos y diseño responsive |
| Angular Material / CDK | Diálogos y componentes de interfaz |
| SweetAlert2 | Alertas y confirmaciones |
| Google Analytics 4 | Medición de visitas a páginas públicas |

## Organización de la aplicación

La aplicación utiliza componentes standalone y organiza sus funcionalidades por áreas:

- **Páginas públicas:** presentación de DevVault y documentación de integración.
- **Autenticación:** inicio de sesión, registro y confirmación de cuenta.
- **Panel de gestión:** información profesional, experiencias, proyectos, tecnologías y API.
- **Core:** servicios y configuración transversal, guards, interceptores, SEO y analítica.
- **Shared:** componentes, servicios y utilidades reutilizables.
- **Environments:** configuración de conexión con el backend según el entorno.

## Páginas principales

| Ruta | Propósito |
|---|---|
| `/` | Presentación de DevVault |
| `/guide` | Guía de integración de la API |
| `/auth/login` | Inicio de sesión |
| `/auth/register` | Registro de cuenta |
| `/auth/activate-account` | Aviso de envío del enlace de activación |
| `/auth/confirm-email/:token` | Confirmación del correo electrónico |
| `/auth/suspended-account` | Información sobre una cuenta restringida |
| `/home` | Inicio del panel |
| `/professional-data` | Información profesional |
| `/technologies` | Tecnologías del profesional |
| `/experience` | Experiencias |
| `/projects` | Proyectos |
| `/manage-api` | Gestión de API Key y origen permitido |
| `/terms-of-service` | Términos del servicio |
| `/privacy-policy` | Política de privacidad |


## Requisitos

- Git.
- Una versión de Node.js compatible con Angular 21.
- npm.
- Acceso a una instancia del backend de DevVault.

Consulta `package.json` y `package-lock.json` para conocer las dependencias del proyecto.

## Instalación

Clona este repositorio y, desde su directorio raíz, instala las dependencias:

```bash
npm i
```

Este comando utiliza las versiones registradas en `package-lock.json`.

## Configuración del backend

La aplicación obtiene la URL base de la API desde los archivos de entorno:

| Archivo | Uso |
|---|---|
| `src/environments/environment.ts` | Producción |
| `src/environments/environment.development.ts` | Desarrollo local |

### Desarrollo

Configura `src/environments/environment.development.ts`:

```typescript
export const environment = {
  production: false,
  API_URL: 'http://localhost:8082/api/v1',
};
```

Ajusta el host y el puerto según la ubicación del backend.

Si pruebas desde otro dispositivo, `localhost` corresponde a ese dispositivo. Utiliza una dirección de desarrollo accesible desde él.

## Ejecución local

Inicia el servidor de desarrollo:

```bash
ng serve -o
```

Abre:

```text
http://localhost:4200
```

El servidor utiliza la configuración `development`, que reemplaza `environment.ts` por `environment.development.ts`.

## Scripts disponibles

| Comando | Descripción |
|---|---|
| `ng serve -o` | Inicia el servidor de desarrollo |
| `ng build` | Genera la compilación de producción |

Para indicar explícitamente una compilación de producción:

```bash
ng build --configuration production
```

## Autenticación y acceso

La aplicación se comunica con el backend mediante HTTP y utiliza JWT para las operaciones autenticadas.

Los guards gestionan el acceso a las rutas y el interceptor de autenticación centraliza el tratamiento de las solicitudes según su configuración.

La API Key tiene un propósito diferente: permite consultar la información del profesional desde portafolios o aplicaciones externas.

Una API Key utilizada en un frontend público puede ser inspeccionada por sus visitantes. No debe otorgar permisos de administración o modificación de la cuenta.

## SEO

DevVault se ejecuta como una SPA sin renderizado del lado del servidor.

La configuración SEO administra los metadatos de las páginas públicas, incluyendo títulos, descripciones y URL canónicas.

Las páginas públicas contempladas para indexación son:

- `/`
- `/guide`
- `/terms-of-service`
- `/privacy-policy`

Las páginas de autenticación y del panel se configuran como no indexables. Esta configuración no sustituye los controles de autenticación y autorización.



## Analítica

La aplicación integra Google Analytics 4 mediante un servicio que controla la carga de la etiqueta y el envío manual de visitas.

El seguimiento se limita a las páginas públicas configuradas:

- `/`
- `/guide`
- `/terms-of-service`
- `/privacy-policy`

La integración:

- Se activa automáticamente en el entorno y dominio de producción permitidos.
- Utiliza `send_page_view: false` para gestionar las visitas manualmente.
- Excluye las rutas de autenticación y del panel.
- Construye las URL medidas sin parámetros de consulta ni fragmentos.
- Desactiva Google Signals y la personalización publicitaria.

La Medición mejorada se mantiene desactivada en la propiedad de GA4 para evitar interferencias con el seguimiento manual.

Los bloqueadores de contenido pueden impedir la carga de Analytics y el envío de eventos.


## Autor

**Miguel Angel Vega Perez**

- GitHub: [mrdevv](https://github.com/mrdevv)
- Contacto: miguelvegap10@gmail.com
- Aplicación web: [DevVault](https://devvaultmrdevv.netlify.app)