import { Component, inject } from '@angular/core';
import { TemaService } from '../../services/tema.service';

@Component({
  selector: 'app-boton-tema',
  template: `
    <button
      class="boton-tema"
      (click)="tema.cambiar()"
      [attr.aria-label]="tema.tema() === 'claro' ? 'Activar modo oscuro' : 'Activar modo claro'"
      [title]="tema.tema() === 'claro' ? 'Modo oscuro' : 'Modo claro'"
    >
      {{ tema.tema() === 'claro' ? '🌙' : '☀️' }}
    </button>
  `,
  styles: `
    .boton-tema {
      background: none;
      border: 1px solid var(--borde-fuerte);
      border-radius: 999px;
      width: 36px;
      height: 36px;
      font-size: 15px;
      line-height: 1;
      cursor: pointer;
      transition: border-color var(--transicion), transform var(--transicion);
    }
    .boton-tema:hover {
      border-color: var(--azul);
      transform: scale(1.06);
    }
  `,
})
export class BotonTema {
  tema = inject(TemaService);
}
