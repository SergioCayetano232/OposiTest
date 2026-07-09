import { Injectable, effect, signal } from '@angular/core';

const CLAVE_TEMA = 'oposi-test-tema';

export type Tema = 'claro' | 'oscuro';

@Injectable({ providedIn: 'root' })
export class TemaService {
  tema = signal<Tema>(this.temaInicial());

  constructor() {
    // Cada vez que cambia el tema, lo pintamos y lo guardamos
    effect(() => {
      const tema = this.tema();
      document.documentElement.dataset['tema'] = tema;
      localStorage.setItem(CLAVE_TEMA, tema);
    });
  }

  // Si nunca eligio, respetamos lo que tenga puesto su sistema operativo
  private temaInicial(): Tema {
    const guardado = localStorage.getItem(CLAVE_TEMA);
    if (guardado === 'claro' || guardado === 'oscuro') return guardado;

    const prefiereOscuro = window.matchMedia('(prefers-color-scheme: dark)').matches;
    return prefiereOscuro ? 'oscuro' : 'claro';
  }

  cambiar() {
    this.tema.update((actual) => (actual === 'claro' ? 'oscuro' : 'claro'));
  }
}
