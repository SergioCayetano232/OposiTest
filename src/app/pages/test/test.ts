import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Pregunta } from '../../models/pregunta';
import { PreguntasService } from '../../services/preguntas.service';

@Component({
  selector: 'app-test',
  imports: [RouterLink],
  templateUrl: './test.html',
  styleUrl: './test.css',
})
export class Test {
  private ruta = inject(ActivatedRoute);
  private preguntasService = inject(PreguntasService);

  tema = this.ruta.snapshot.paramMap.get('tema') ?? '';

  // hasta 25 preguntas barajadas del tema
  preguntas: Pregunta[] = this.preguntasService.getAleatorias(this.tema, 25);

  indice = 0;

  // opción elegida por pregunta, null = en blanco
  respuestas: (number | null)[] = this.preguntas.map(() => null);

  get preguntaActual(): Pregunta {
    return this.preguntas[this.indice];
  }

  get esUltima(): boolean {
    return this.indice === this.preguntas.length - 1;
  }

  get respondidas(): number {
    return this.respuestas.filter((r) => r !== null).length;
  }

  seleccionar(opcion: number) {
    // repetir clic en la misma opción la desmarca
    this.respuestas[this.indice] =
      this.respuestas[this.indice] === opcion ? null : opcion;
  }

  siguiente() {
    if (!this.esUltima) this.indice++;
  }

  anterior() {
    if (this.indice > 0) this.indice--;
  }

  letra(i: number): string {
    return ['a', 'b', 'c'][i];
  }
}
