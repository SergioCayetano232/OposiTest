import { Injectable } from '@angular/core';
import { Pregunta } from '../models/pregunta';
import { PREGUNTAS } from '../data/preguntas';

const CLAVE_VISTAS = 'oposi-test-vistas';

// 'ia' = generada, 'examen' = de examen oficial
export type Fuente = 'ia' | 'examen';

// Datos que la pantalla necesita para montar un simulacro
export interface ConfigSimulacro {
  preguntas: Pregunta[];
  cantidad: number;
  minutos: number;
  penalizacion: number; // lo que resta cada fallo (0 = no resta)
}

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

  // Igual que getPorTema pero acotando también por origen
  getPorTemaYFuente(tema: string, fuente: Fuente): Pregunta[] {
    return PREGUNTAS.filter((p) => p.tema === tema && p.fuente === fuente);
  }

  contarPorTemaYFuente(tema: string, fuente: Fuente): number {
    return this.getPorTemaYFuente(tema, fuente).length;
  }

  // Devuelve preguntas priorizando las no vistas; si quedan pocas, reinicia el ciclo.
  // Si se pasa fuente, filtra por ella y lleva su propio ciclo de "vistas".
  getAleatorias(tema: string, cantidad: number, fuente?: Fuente): Pregunta[] {
    const todas = fuente ? this.getPorTemaYFuente(tema, fuente) : this.getPorTema(tema);

    // clave distinta por sección para no mezclar lo visto de ia y examen
    const clave = fuente ? `${tema}-${fuente}` : tema;
    const vistas = this.getVistas()[clave] ?? [];
    let disponibles = todas.filter((p) => !vistas.includes(p.id));

    // Si no quedan suficientes sin ver, reiniciamos el ciclo
    if (disponibles.length < cantidad) {
      this.reiniciarVistas(clave);
      disponibles = [...todas];
    }

    // Barajamos y elegimos
    const barajadas = [...disponibles].sort(() => Math.random() - 0.5);
    const elegidas = barajadas.slice(0, cantidad);

    // Marcamos como vistas
    this.marcarVistas(
      clave,
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

  // Simulacro de práctica: mezcla de todos los temas, da igual el origen
  getSimulacroPractica(cantidad = 50): ConfigSimulacro {
    return {
      preguntas: this.getSimulacro(cantidad),
      cantidad,
      minutos: 60,
      penalizacion: 1 / 3,
    };
  }

  // Simulacro de examen real: solo preguntas de examen, 100 preguntas y 2 horas
  getSimulacroExamen(): ConfigSimulacro {
    const soloExamen = PREGUNTAS.filter((p) => p.fuente === 'examen');
    const barajadas = [...soloExamen].sort(() => Math.random() - 0.5);
    // cogemos hasta 100; de momento habrá menos hasta que metamos las de examen
    const elegidas = barajadas.slice(0, 100).map((p) => this.barajarOpciones(p));
    return {
      preguntas: elegidas,
      cantidad: 100,
      minutos: 120,
      penalizacion: 1 / 3,
    };
  }
}
