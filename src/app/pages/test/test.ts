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

  terminado = false;

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

  corregir() {
    this.terminado = true;
  }

  // nuevo intento con otras preguntas barajadas
  repetir() {
    this.preguntas = this.preguntasService.getAleatorias(this.tema, 25);
    this.respuestas = this.preguntas.map(() => null);
    this.indice = 0;
    this.terminado = false;
  }

  get aciertos(): number {
    return this.preguntas.filter((p, i) => this.respuestas[i] === p.correcta).length;
  }

  get fallos(): number {
    return this.preguntas.filter(
      (p, i) => this.respuestas[i] !== null && this.respuestas[i] !== p.correcta
    ).length;
  }

  get enBlanco(): number {
    return this.respuestas.filter((r) => r === null).length;
  }

  // como en el examen: acierto 1, fallo -1/3, blanco 0
  get puntos(): number {
    const brutos = this.aciertos - this.fallos / 3;
    return Math.round(brutos * 100) / 100;
  }

  get nota(): number {
    const sobre10 = (this.puntos / this.preguntas.length) * 10;
    return Math.max(0, Math.round(sobre10 * 100) / 100);
  }
}
