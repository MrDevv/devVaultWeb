import { Component, signal, computed, AfterViewInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NavBar } from "../../../shared/components/nav-bar/nav-bar";
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/all';
import { Footer } from '../../components/footer/footer';
import { CardLanding } from "../../components/card-landing/card-landing";
import { CardFeature } from '../../components/card-feature/card-feature';


gsap.registerPlugin(ScrollTrigger);

const optionsArray = [
  {
    nombre: 'DATOS DE CONTACTO', 
    icon: 'fa-regular fa-address-card',
    svg: null
  },
  {
    nombre: 'TECNOLOGÍAS', 
    icon: null,
    svg: 'tecnologias_icon_landing.svg'
  },
  {
    nombre: 'EXPERIENCIA', 
    icon: 'fa-solid fa-briefcase',
    svg: null
  },
  {
    nombre: 'PROYECTOS', 
    icon: 'fa-solid fa-laptop-code',
    svg: null
  },
]

const features = [
  {
    nombre: 'Seguridad',
    descripcion: 'Obten tus datos con una API KEY propia y privada.',
    icon: 'fa-shield-halved'
  },
  {
    nombre: 'Centralizada',
    descripcion: 'Mantén tu información centralizada en un solo lugar.',
    icon: 'fa-cube'
  },
    {
    nombre: 'Ahorro de tiempo',
    descripcion: 'Crea y obten tus datos de forma rápida y sencilla.',
    icon: 'fa-stopwatch'
  }
]

@Component({
  selector: 'app-landing-page',
  imports: [RouterLink, NavBar, Footer, CardLanding, CardFeature],
  templateUrl: './landing-page.html'  
})
export class LandingPage implements AfterViewInit{

  private readonly _optionsCards = signal(optionsArray);
  private readonly _featuresApp = signal(features);

  public optionsCards = computed(() => this._optionsCards());
  public features = computed(() => this._featuresApp());

  ngAfterViewInit(): void {
    gsap.from('.reveal', {
      scrollTrigger: {
        trigger: '.reveal',
        start: 'top 80%',
      },
      y: 50,
      opacity: 0,
      duration: 0.8,
      stagger: 0.2
    });

    gsap.from('.card', {
      scrollTrigger: {
        trigger: '.card',
        start: 'top 100%',
      },
      y: 80,
      opacity: 0,
      duration: 1,
      stagger: 0.2,
      ease: 'power3.out'
    });

  }

}
