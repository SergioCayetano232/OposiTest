import { Injectable } from '@angular/core';
import { Pregunta } from '../models/pregunta';
import { PREGUNTAS } from '../data/preguntas';

@Injectable({ providedIn: 'root' })
export class PreguntasService {
  // Devuelve una copia de la pregunta con las 3 opciones desordenadas
  // y el índice de la correcta recalculado a su nueva posición.
  private barajarOpciones(pregunta: Pregunta): Pregunta {
    // Emparejamos cada opción con si era o no la correcta
    const opcionesConMarca = pregunta.opciones.map((texto, i) => ({
      texto,
      esCorrecta: i === pregunta.correcta,
    }));

    // Barajamos ese array
    opcionesConMarca.sort(() => Math.random() - 0.5);

    // Reconstruimos la pregunta con el nuevo orden
    return {
      ...pregunta,
      opciones: opcionesConMarca.map((o) => o.texto),
      correcta: opcionesConMarca.findIndex((o) => o.esCorrecta),
    };
  }

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
    return copia.slice(0, cantidad).map((p) => this.barajarOpciones(p));
  }

  // baraja todo el banco y devuelve "cantidad" preguntas
  getSimulacro(cantidad: number): Pregunta[] {
    const copia = [...PREGUNTAS];
    copia.sort(() => Math.random() - 0.5);
    return copia.slice(0, cantidad).map((p) => this.barajarOpciones(p));
  }
}
