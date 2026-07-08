// Forma que tiene toda pregunta del banco
export interface Pregunta {
  id: number;
  tema: string; // convenio | prl | lengua | mates
  fuente: 'ia' | 'examen'; // origen: 'ia' (generada) o 'examen' (examen oficial)
  enunciado: string;
  opciones: string[];
  correcta: number; // índice de la opción correcta (0, 1 o 2)
  explicacion: string;
}
