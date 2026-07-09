import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PreguntasService } from '../../services/preguntas.service';
import { EstadisticasService } from '../../services/estadisticas.service';
import { AuthService } from '../../services/auth.service';

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
  private estadisticasService = inject(EstadisticasService);
  // publico porque la plantilla lee el usuario de la sesion
  auth = inject(AuthService);

  temas: Tema[] = [
    { id: 'convenio', nombre: 'Convenio Colectivo', descripcion: 'XI Convenio de la FNMT-RCM', icono: '📜' },
    { id: 'prl', nombre: 'Prevención de Riesgos', descripcion: 'Manual de PRL de la FNMT', icono: '🦺' },
    { id: 'lengua', nombre: 'Lengua', descripcion: 'Gramática, ortografía y comprensión', icono: '✍️' },
    { id: 'mates', nombre: 'Matemáticas', descripcion: 'Cálculo, problemas y razonamiento', icono: '🔢' },
  ];

  // Cuántas preguntas hay de un tema y origen (para el contador de cada botón)
  numPorFuente(temaId: string, fuente: 'ia' | 'examen'): number {
    return this.preguntasService.contarPorTemaYFuente(temaId, fuente);
  }

  // Total de preguntas de examen (contador del simulacro real)
  numExamen(): number {
    return this.preguntasService.getTodas().filter((p) => p.fuente === 'examen').length;
  }

  intentos(temaId: string): number {
    return this.estadisticasService.numIntentos(temaId);
  }

  mejorNota(temaId: string): number | null {
    return this.estadisticasService.mejorNota(temaId);
  }
}
