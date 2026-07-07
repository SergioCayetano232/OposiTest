import { Component, inject } from '@angular/core';
import { PreguntasService } from './services/preguntas.service';

// Un tema del examen
export interface Tema {
  id: string;
  nombre: string;
  descripcion: string;
  icono: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  private preguntasService = inject(PreguntasService);

  numPreguntas(temaId: string): number {
    return this.preguntasService.contarPorTema(temaId);
  }

  temas: Tema[] = [
    {
      id: 'convenio',
      nombre: 'Convenio Colectivo',
      descripcion: 'XI Convenio de la FNMT-RCM',
      icono: '📜',
    },
    {
      id: 'prl',
      nombre: 'Prevención de Riesgos',
      descripcion: 'Manual de PRL de la FNMT',
      icono: '🦺',
    },
    {
      id: 'lengua',
      nombre: 'Lengua',
      descripcion: 'Gramática, ortografía y comprensión',
      icono: '✍️',
    },
    {
      id: 'mates',
      nombre: 'Matemáticas',
      descripcion: 'Cálculo, problemas y razonamiento',
      icono: '🔢',
    },
  ];
}
