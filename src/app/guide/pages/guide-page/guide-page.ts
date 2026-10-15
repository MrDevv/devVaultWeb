import { Component, inject, signal } from '@angular/core';
import { JsonPipe } from '@angular/common';

import { NavBar } from '@shared/components/nav-bar/nav-bar';
import { SideBar } from '@shared/components/side-bar/side-bar';
import { CodeBlock } from '@guide/components/code-block/code-block';
import { CardEndpoint } from '@guide/components/card-endpoint/card-endpoint';
import { SideBarService } from '@guide/services/side-bar-service';
import { Footer } from '@landing/components/footer/footer';


const dataEndpoints = [
  {
    url: "/dev/me/datos",
    description: "Obten tus datos profesionales como nombres, correo, github url, linkedin url y más."
  },
  {
    url: "/dev/me/tecnologias",
    description: "Obten tus datos profesionales como nombres, correo, github url, linkedin url y más."
  },
  {
    url: "/dev/me/experiencia",
    description: "Obten tus datos profesionales como nombres, correo, github url, linkedin url y más."
  },
  {
    url: "/dev/me/proyectos",
    description: "Obten tus datos profesionales como nombres, correo, github url, linkedin url y más."
  }
]

@Component({
  selector: 'app-guide-page',
  imports: [NavBar, SideBar, JsonPipe, CodeBlock, Footer, CardEndpoint],
  templateUrl: './guide-page.html'  
})
export class GuidePage {
  sideBarService = inject(SideBarService);

  public dataEndpoints = signal(dataEndpoints);

  codigo =`const API_KEY = "TU_API_KEY";

fetch("https://servermrdevv2.duckdns.org/devvault/api/v1/dev/me/datos", {
  headers: {
    "Authorization": \`Bearer \${\API_KEY\}\`
  }
})
.then(res => res.json())
.then(data => console.log(data));`;

  codigo_tecnologias =`const API_KEY = "TU_API_KEY";

fetch("https://servermrdevv2.duckdns.org/devvault/api/v1/dev/me/tecnologias", {
  headers: {
    "Authorization": \`Bearer \${\API_KEY\}\`
  }
})
.then(res => res.json())
.then(data => console.log(data));`;

  codigo_experiencias =`const API_KEY = "TU_API_KEY";

fetch("https://servermrdevv2.duckdns.org/devvault/api/v1/dev/me/experiencias", {
  headers: {
    "Authorization": \`Bearer \${\API_KEY\}\`
  }
})
.then(res => res.json())
.then(data => console.log(data));`;

  codigo_proyectos =`const API_KEY = "TU_API_KEY";

fetch("https://servermrdevv2.duckdns.org/devvault/api/v1/dev/me/proyectos", {
  headers: {
    "Authorization": \`Bearer \${\API_KEY\}\`
  }
})
.then(res => res.json())
.then(data => console.log(data));`;

  data_desarrollador = {    
    "status": "OK",
    "message": "Se obtuvo los datos del desarrollador correctamente",
    "data": {
      "profesional_uuid": "550e8400-e29b-41d4-a716-446655440000",
      "nombres": "Tom",
      "apellidos": "Rojas Paredes",
      "correo_contacto": "tom2026@gmail.com",
      "github_url": "https://github.com/tom203",
      "linkedin_url": "www.linkedin.com/in/tomrojas",
      "cv_url": "https://example_url.com",
      "logo_url": "https://example_logo.png",
      "prefijo_telefono": "51",
      "telefono": "999999999",
      "biografia": "Egresado de la carrera de Ingeniería de software con pasión por crear aplicaciones fullstack.",
      "puesto": "Desarrollador Fullstack"
    }
  }

  data_tecnologias = {
    "status": "OK",
    "message": "Se obtuvieron las tecnologías correctamente",
    "data": [
        {
            "profesionalTecnologiaUUID": "1ea0bf1e-ad9d-4457-b115-192b3a167873",
            "tecnologia": "Java",
            "logoURL": "https://res.cloudinary.com/dlkdwlkma/image/upload/v1776895987/java_lltcwe.png",
            "tipoTecnologia": "lenguajes",
            "nivel": null
        },
        {
            "profesionalTecnologiaUUID": "d8558689-f809-42ce-9d35-b5f7b14e4adc",
            "tecnologia": "TypeScript",
            "logoURL": "https://res.cloudinary.com/dlkdwlkma/image/upload/v1776896050/typescript_boavbe.png",
            "tipoTecnologia": "lenguajes",
            "nivel": "básico"
        },
        {
            "profesionalTecnologiaUUID": "6ec95c4a-5424-4257-8031-6fb67ce87be2",
            "tecnologia": "JavaScript",
            "logoURL": "https://res.cloudinary.com/dlkdwlkma/image/upload/v1776896119/javascript_vcicyj.png",
            "tipoTecnologia": "lenguajes",
            "nivel": null
        },
        {
            "profesionalTecnologiaUUID": "d65e9e7c-9788-42c5-a8f7-2803f490525d",
            "tecnologia": "Python",
            "logoURL": "https://res.cloudinary.com/dlkdwlkma/image/upload/v1776896154/python_kibnse.png",
            "tipoTecnologia": "lenguajes",
            "nivel": "avanzado"
        }
    ]
  }


  data_experiencias = {
    "status": "OK",
    "message": "Se obtuvieron las experiencias correctamente",
    "data": {
        "content": [
            {
                "experienciaUUID": "585d70a5-9db3-41fb-a899-e4b37016223b",
                "titulo": "Sistema Seguimiento Documentos",
                "descripcion": "Participé en el desarrollo del sistema web para la gestión de documentos mejorando la trazabilidad y eficiencia del proceso. Implementé funcionalidades clave para la el seguimiento de documentos y la generación de reportes.",
                "fechaInicio": "2024-04-01",
                "fechaFin": "2024-07-30",
                "nombreEmpresa": "MuniGroup",
                "puesto": "Web Developer",
                "profesional": "Tom Ramirez",
                "cantidadProyectos": 2
            }
        ],
        "pageableData": {
            "numberPage": 0,
            "lastPage": true,
            "firstPage": true,
            "totalPages": 1,
            "totalElements": 1,
            "numberOfElements": 1,
            "offset": 0
        }
    }
}

data_proyectos = {
    "status": "OK",
    "message": "Se obtuvieron los proyectos correctamente",
    "data": {
        "content": [
            {
                "proyecto_uuid": "0635a54d-6362-4106-8c46-b1f98a269e40",
                "titulo": "SeguiWeb",
                "descripcion": "Aplicación web desarrollada en angular para gestionar lo usuarios, documentos, áreas y flujo de seguimiento de forma intuitiva",
                "url_produccion": "http://seguimiento-demo.com",
                "url_repositorio": "https://github.com/username/seguiweb",
                "url_imagen_presentacion": "https://storage.image.com",
                "estado": "activo",
                "experiencia": {
                    "experiencia_uuid": "585d70a5-9db3-41fb-a899-e4b37016223b",
                    "titulo": "Sistema Seguimiento Documentos"
                },
                "tipo_proyecto": {
                    "tipo_proyecto_uuid": "2703f1b3-5c84-4744-b8d0-934dfa06d091",
                    "descripcion": "aplicación web"
                },
                "etiquetas": [
                    {
                        "etiqueta_uuid": "cad5bfe9-12e9-4c1a-b926-c7d1c6dcdf9b",
                        "descripcion": "Angular"
                    },
                    {
                        "etiqueta_uuid": "e2619fee-d2ed-4b90-ba26-294609e54604",
                        "descripcion": "Tailwind"
                    },
                    {
                        "etiqueta_uuid": "837103c4-c93c-49a1-a28b-0682cff207f6",
                        "descripcion": "Clean Architecture"
                    }
                ]
            },
            {
                "proyecto_uuid": "18c36447-5398-437a-aa4f-78521d79ef1d",
                "titulo": "SeguiAPI",
                "descripcion": "API Rest para gestionar el seguimiento de documentos,  áreas, usuarios. Construido con Spring Boot",
                "url_produccion": null,
                "url_repositorio": "https://github.com/username/seguimientorepo",
                "url_imagen_presentacion": null,
                "estado": "activo",
                "experiencia": {
                    "experiencia_uuid": "585d70a5-9db3-41fb-a899-e4b37016223b",
                    "titulo": "Sistema Seguimiento Documentos"
                },
                "tipo_proyecto": {
                    "tipo_proyecto_uuid": "50fac612-58c1-408a-8aed-f2247d65386d",
                    "descripcion": "backend"
                },
                "etiquetas": [
                    {
                        "etiqueta_uuid": "c81fd03d-80f4-42dc-a448-f5673313a0b2",
                        "descripcion": "Spring Boot"
                    },
                    {
                        "etiqueta_uuid": "40877212-b13e-4917-bb76-b4576189d4e4",
                        "descripcion": "JWT"
                    },
                    {
                        "etiqueta_uuid": "df6fd911-108f-46ed-a756-230694d3ed9b",
                        "descripcion": "Spring Data JPA"
                    }
                ]
            }
        ],
        "pageableData": {
            "numberPage": 0,
            "lastPage": true,
            "firstPage": true,
            "totalPages": 1,
            "totalElements": 2,
            "numberOfElements": 2,
            "offset": 0
        }
    }
}




}
