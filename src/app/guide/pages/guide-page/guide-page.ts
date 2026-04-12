import { AfterViewInit, Component, ElementRef, signal, ViewChild } from '@angular/core';
import { NavBar } from "../../../shared/components/nav-bar/nav-bar";
import { SideBar } from "../../components/side-bar/side-bar";
import { JsonPipe } from '@angular/common';
import Prism from 'prismjs';

import 'prismjs/components/prism-json'
import 'prismjs/components/prism-javascript';

@Component({
  selector: 'app-guide-page',
  imports: [NavBar, SideBar, JsonPipe],
  templateUrl: './guide-page.html'  
})
export class GuidePage implements AfterViewInit {
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


  ngAfterViewInit(): void {
    Prism.highlightAll();    
  }


}
