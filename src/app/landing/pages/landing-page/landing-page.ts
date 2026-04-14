import { Component, signal, computed, AfterViewInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NavBar } from "../../../shared/components/nav-bar/nav-bar";
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/all';
import { Footer } from '../../components/footer/footer';
import { CardLanding } from "../../components/card-landing/card-landing";
import { CardFeature } from '../../components/card-feature/card-feature';
import { NgClass } from '@angular/common';


gsap.registerPlugin(ScrollTrigger);

const optionsArray = [
  {
    nombre: 'Datos de contacto', 
    icon: 'fa-solid fa-at',
    description: 'Email, redes sociales, puesto y links profesionales.',
    bgClass: 'bg-[#c0c1ff1a]',
    textClass: 'text-[#c0c1ff]'
  },
  {
    nombre: 'Tecnologías',
    icon: 'fa-solid fa-terminal',
    description: 'Stack técnico categorizado: Frontend, Backend, DevOps y Herramientas.',
    bgClass: 'bg-[#4edea31a]',
    textClass: 'text-[#4edea3]'
  },
  {
    nombre: 'Experiencia', 
    icon: 'fa-solid fa-briefcase',
    description: 'Historial laboral con fechas, logros y tecnologías aplicadas en cada rol.',
    bgClass: 'bg-[#bdc2ff1a]',
    textClass: 'text-[#bdc2ff]'
  },
  {
    nombre: 'Proyectos', 
    icon: 'fa-regular fa-folder-open',
    description: 'Tus trabajos con links a GitHub, demos en vivo y etiquetas.',
    bgClass: 'bg-[#8083ff1a]',
    textClass: 'text-[#8083ff]'
  },
]

const features = [
  {    
    nombre: 'Seguridad Total',
    descripcion: 'Obten tus datos con una API KEY propia y privada.',
    extra: 'Tus datos están protegidos y solo son accesibles mediante autenticación con tu API KEY.',
    icon: 'fa-shield-halved'
  },
  {
    nombre: 'Centralización',
    descripcion: 'Mantén tu información centralizada en un solo lugar.',
    extra: null,
    icon: null,
  },
  {
    nombre: 'Ahorro de tiempo',
    descripcion: 'Crea y obten tus datos de forma rápida y sencilla.',
    extra: 'Sin configuraciones complejas de bases de datos. Un endpoint, todos tus datos.',
    icon: null
  }
]

@Component({
  selector: 'app-landing-page',
  imports: [RouterLink, NavBar, Footer, CardLanding, CardFeature, NgClass],
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

  getGridClass(index: number): string {
    switch (index) {
      case 0:
        return 'md:col-span-3';
      case 1:
        return 'md:col-span-2';
      case 2:
        return 'md:col-start-2 md:col-end-5';
      default:
        return '';
    }
}

}
