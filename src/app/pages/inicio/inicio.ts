import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PreguntasService } from '../../services/preguntas.service';

export interface Tema {
  id: string;
  nombre: string;
  descripcion: string;
  icono: string;
}

@Component({
  selector: 'app-inicio',
  imports: [RouterLink],
  templateUrl: './inicio.html',
  styleUrl: './inicio.css',
})
export class Inicio {
  private preguntasService = inject(PreguntasService);

  temas: Tema[] = [
    { id: 'convenio', nombre: 'Convenio Colectivo', descripcion: 'XI Convenio de la FNMT-RCM', icono: '📜' },
    { id: 'prl', nombre: 'Prevención de Riesgos', descripcion: 'Manual de PRL de la FNMT', icono: '🦺' },
    { id: 'lengua', nombre: 'Lengua', descripcion: 'Gramática, ortografía y comprensión', icono: '✍️' },
    { id: 'mates', nombre: 'Matemáticas', descripcion: 'Cálculo, problemas y razonamiento', icono: '🔢' },
  ];

  numPreguntas(temaId: string): number {
    return this.preguntasService.contarPorTema(temaId);
  }
}
