import { Component, OnDestroy, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Pregunta } from '../../models/pregunta';
import { PreguntasService } from '../../services/preguntas.service';
import { EstadisticasService } from '../../services/estadisticas.service';

@Component({
  selector: 'app-test',
  imports: [RouterLink],
  templateUrl: './test.html',
  styleUrl: './test.css',
})
export class Test implements OnDestroy {
  private ruta = inject(ActivatedRoute);
  private preguntasService = inject(PreguntasService);
  private estadisticasService = inject(EstadisticasService);

  tema = this.ruta.snapshot.paramMap.get('tema') ?? '';

  esSimulacro = this.tema === 'simulacro';

  preguntas: Pregunta[] = this.esSimulacro
    ? this.preguntasService.getSimulacro(50)
    : this.preguntasService.getAleatorias(this.tema, 20);

  // reloj del simulacro: 60 minutos
  segundos = 60 * 60;
  private reloj: ReturnType<typeof setInterval> | null = null;

  constructor() {
    if (this.esSimulacro) this.arrancarReloj();
  }

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
    if (this.terminado) return;
    this.pararReloj();
    this.terminado = true;
    this.estadisticasService.guardar({
      tema: this.tema,
      fecha: new Date().toISOString(),
      aciertos: this.aciertos,
      fallos: this.fallos,
      enBlanco: this.enBlanco,
      nota: this.nota,
    });
  }

  // nuevo intento con otras preguntas barajadas
  repetir() {
    this.preguntas = this.esSimulacro
      ? this.preguntasService.getSimulacro(50)
      : this.preguntasService.getAleatorias(this.tema, 20);
    this.respuestas = this.preguntas.map(() => null);
    this.indice = 0;
    this.terminado = false;
    if (this.esSimulacro) {
      this.segundos = 60 * 60;
      this.arrancarReloj();
    }
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

  // preguntas falladas junto a lo que se marcó
  get falladas(): { pregunta: Pregunta; marcada: number }[] {
    return this.preguntas
      .map((pregunta, i) => ({ pregunta, marcada: this.respuestas[i] }))
      .filter((f) => f.marcada !== null && f.marcada !== f.pregunta.correcta)
      .map((f) => ({ pregunta: f.pregunta, marcada: f.marcada as number }));
  }

  private arrancarReloj() {
    this.reloj = setInterval(() => {
      this.segundos--;
      if (this.segundos <= 0) this.corregir();
    }, 1000);
  }

  private pararReloj() {
    if (this.reloj) {
      clearInterval(this.reloj);
      this.reloj = null;
    }
  }

  // se ejecuta al salir de la pantalla
  ngOnDestroy() {
    this.pararReloj();
  }

  get tiempo(): string {
    const m = Math.floor(this.segundos / 60);
    const s = this.segundos % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  }
}
