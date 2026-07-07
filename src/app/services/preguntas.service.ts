import { Injectable } from '@angular/core';
import { Pregunta } from '../models/pregunta';
import { PREGUNTAS } from '../data/preguntas';

@Injectable({ providedIn: 'root' })
export class PreguntasService {
  getTodas(): Pregunta[] {
    return PREGUNTAS;
  }

  getPorTema(tema: string): Pregunta[] {
    return PREGUNTAS.filter((p) => p.tema === tema);
  }

  contarPorTema(tema: string): number {
    return this.getPorTema(tema).length;
  }

  // Baraja las preguntas del tema y devuelve las primeras "cantidad"
  getAleatorias(tema: string, cantidad: number): Pregunta[] {
    const copia = [...this.getPorTema(tema)];
    copia.sort(() => Math.random() - 0.5);
    return copia.slice(0, cantidad);
  }

  // baraja todo el banco y devuelve "cantidad" preguntas
  getSimulacro(cantidad: number): Pregunta[] {
    const copia = [...PREGUNTAS];
    copia.sort(() => Math.random() - 0.5);
    return copia.slice(0, cantidad);
  }
}
