import { Injectable } from '@angular/core';
import { Pregunta } from '../models/pregunta';
import { PREGUNTAS } from '../data/preguntas';

const CLAVE_VISTAS = 'oposi-test-vistas';

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

  // Lee del navegador los ids ya vistos, agrupados por tema
  private getVistas(): Record<string, number[]> {
    try {
      const guardado = localStorage.getItem(CLAVE_VISTAS);
      return guardado ? JSON.parse(guardado) : {};
    } catch {
      return {};
    }
  }

  private guardarVistas(vistas: Record<string, number[]>) {
    localStorage.setItem(CLAVE_VISTAS, JSON.stringify(vistas));
  }

  // Marca como vistas las preguntas de este tema
  private marcarVistas(tema: string, ids: number[]) {
    const vistas = this.getVistas();
    const previas = vistas[tema] ?? [];
    vistas[tema] = [...previas, ...ids];
    this.guardarVistas(vistas);
  }

  // Reinicia el ciclo de un tema (olvida lo visto)
  reiniciarVistas(tema: string) {
    const vistas = this.getVistas();
    vistas[tema] = [];
    this.guardarVistas(vistas);
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

  // Devuelve preguntas priorizando las no vistas; si quedan pocas, reinicia el ciclo
  getAleatorias(tema: string, cantidad: number): Pregunta[] {
    const todas = this.getPorTema(tema);
    const vistas = this.getVistas()[tema] ?? [];
    let disponibles = todas.filter((p) => !vistas.includes(p.id));

    // Si no quedan suficientes sin ver, reiniciamos el ciclo
    if (disponibles.length < cantidad) {
      this.reiniciarVistas(tema);
      disponibles = [...todas];
    }

    // Barajamos y elegimos
    const barajadas = [...disponibles].sort(() => Math.random() - 0.5);
    const elegidas = barajadas.slice(0, cantidad);

    // Marcamos como vistas
    this.marcarVistas(
      tema,
      elegidas.map((p) => p.id)
    );

    return elegidas.map((p) => this.barajarOpciones(p));
  }

  // baraja todo el banco y devuelve "cantidad" preguntas
  getSimulacro(cantidad: number): Pregunta[] {
    const copia = [...PREGUNTAS];
    copia.sort(() => Math.random() - 0.5);
    return copia.slice(0, cantidad).map((p) => this.barajarOpciones(p));
  }
}
