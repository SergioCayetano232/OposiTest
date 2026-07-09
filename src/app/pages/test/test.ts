import { Component, OnDestroy, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Pregunta } from '../../models/pregunta';
import { Fuente, PreguntasService } from '../../services/preguntas.service';
import { EstadisticasService } from '../../services/estadisticas.service';
import { CONSTITUCION } from '../../data/constitucion';
import { TEXTOS_LECTURA } from '../../data/textos-lectura';

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
  // fuente puede venir o no (los simulacros no la traen)
  fuente = (this.ruta.snapshot.paramMap.get('fuente') as Fuente | null) ?? null;

  // hay dos simulacros: práctica (mezcla) y examen real (solo preguntas de examen)
  esSimulacro = this.tema === 'simulacro' || this.tema === 'examen';

  // minutos del simulacro (los tests normales no llevan reloj)
  private minutosSimulacro = 60;

  preguntas: Pregunta[] = this.cargarPreguntas();

  // reloj del simulacro
  segundos = this.minutosSimulacro * 60;
  private reloj: ReturnType<typeof setInterval> | null = null;

  constructor() {
    if (this.esSimulacro) this.arrancarReloj();
  }

  // Decide qué preguntas mostrar según la ruta
  private cargarPreguntas(): Pregunta[] {
    if (this.tema === 'examen') {
      const config = this.preguntasService.getSimulacroExamen();
      this.minutosSimulacro = config.minutos;
      return config.preguntas;
    }
    if (this.tema === 'simulacro') {
      const config = this.preguntasService.getSimulacroPractica();
      this.minutosSimulacro = config.minutos;
      return config.preguntas;
    }
    // test normal: por tema, y por fuente si viene en la ruta
    return this.preguntasService.getAleatorias(this.tema, 20, this.fuente ?? undefined);
  }

  // Clave con la que se guardan las estadísticas (distingue cada sección)
  private get claveStats(): string {
    return this.fuente ? `${this.tema}-${this.fuente}` : this.tema;
  }

  indice = 0;

  // opción elegida por pregunta, null = en blanco
  respuestas: (number | null)[] = this.preguntas.map(() => null);

  terminado = false;

  get preguntaActual(): Pregunta {
    return this.preguntas[this.indice];
  }

  // texto de la Constitución para las preguntas de comprensión lectora
  textoConstitucion = CONSTITUCION;
  // panel del texto abierto/cerrado (vale para Constitución y textos de lectura)
  verConstitucion = false;

  // ¿la pregunta actual necesita el texto de la Constitución?
  get esConstitucion(): boolean {
    return this.preguntaActual?.etiqueta === 'constitucion';
  }

  // ¿la pregunta actual es de comprensión lectora con texto adjunto?
  // Se marcan con etiqueta 'lectura:clave' (p. ej. 'lectura:boby').
  get esLectura(): boolean {
    return this.preguntaActual?.etiqueta?.startsWith('lectura:') ?? false;
  }

  // texto de lectura que corresponde a la pregunta actual (o vacío)
  get textoLectura(): string {
    const etiqueta = this.preguntaActual?.etiqueta ?? '';
    if (!etiqueta.startsWith('lectura:')) return '';
    const clave = etiqueta.slice('lectura:'.length);
    return TEXTOS_LECTURA[clave] ?? '';
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
    this.verConstitucion = false; // cerramos el texto al cambiar de pregunta
  }

  anterior() {
    if (this.indice > 0) this.indice--;
    this.verConstitucion = false; // cerramos el texto al cambiar de pregunta
  }

  letra(i: number): string {
    return ['a', 'b', 'c'][i];
  }

  corregir() {
    if (this.terminado) return;
    this.pararReloj();
    this.terminado = true;
    this.estadisticasService.guardar({
      tema: this.claveStats,
      fecha: new Date().toISOString(),
      aciertos: this.aciertos,
      fallos: this.fallos,
      enBlanco: this.enBlanco,
      nota: this.nota,
    });
  }

  // nuevo intento con otras preguntas barajadas
  repetir() {
    this.preguntas = this.cargarPreguntas();
    this.respuestas = this.preguntas.map(() => null);
    this.indice = 0;
    this.terminado = false;
    if (this.esSimulacro) {
      this.segundos = this.minutosSimulacro * 60;
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
