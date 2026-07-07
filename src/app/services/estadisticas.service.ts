import { Injectable } from '@angular/core';
import { Intento } from '../models/intento';

const CLAVE = 'oposi-test-intentos';

@Injectable({ providedIn: 'root' })
export class EstadisticasService {
  guardar(intento: Intento) {
    const todos = this.getTodos();
    todos.push(intento);
    localStorage.setItem(CLAVE, JSON.stringify(todos));
  }

  getTodos(): Intento[] {
    try {
      const guardado = localStorage.getItem(CLAVE);
      return guardado ? JSON.parse(guardado) : [];
    } catch {
      return [];
    }
  }

  getPorTema(tema: string): Intento[] {
    return this.getTodos().filter((i) => i.tema === tema);
  }

  numIntentos(tema: string): number {
    return this.getPorTema(tema).length;
  }

  mejorNota(tema: string): number | null {
    const notas = this.getPorTema(tema).map((i) => i.nota);
    return notas.length ? Math.max(...notas) : null;
  }
}
