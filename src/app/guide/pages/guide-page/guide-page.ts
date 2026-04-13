import { Component, inject, signal } from '@angular/core';
import { NavBar } from "../../../shared/components/nav-bar/nav-bar";
import { SideBar } from "../../components/side-bar/side-bar";
import { JsonPipe } from '@angular/common';

import { SideBarService } from '../../services/side-bar-service';
import { CodeBlock } from "../../components/code-block/code-block";
import { Footer } from "../../../landing/components/footer/footer";
import { CardEndpoint } from "../../components/card-endpoint/card-endpoint";

const dataEndpoints = [
  {
    url: "/desarrolladores/me/datos",
    description: "Obten tus datos profesionales como nombres, correo, github url, linkedin url y más."
  },
  {
    url: "/desarrolladores/me/tecnologias",
    description: "Obten tus datos profesionales como nombres, correo, github url, linkedin url y más."
  },
  {
    url: "/desarrolladores/me/experiencia",
    description: "Obten tus datos profesionales como nombres, correo, github url, linkedin url y más."
  },
  {
    url: "/desarrolladores/me/proyectos",
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

fetch("https://servermrdevv2.duckdns.org/portfolio/api/v1/desarrolladores/me/datos", {
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
      "desarrollador_uuid": "550e8400-e29b-41d4-a716-446655440000",
      "nombres": "Tom",
      "apellidos": "Rojas Paredes",
      "correo": "tom2026@gmail.com",
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




}
