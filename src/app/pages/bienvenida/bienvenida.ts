import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PreguntasService } from '../../services/preguntas.service';
import { BotonTema } from '../../componentes/boton-tema/boton-tema';

@Component({
  selector: 'app-bienvenida',
  imports: [RouterLink, BotonTema],
  templateUrl: './bienvenida.html',
  styleUrl: './bienvenida.css',
})
export class Bienvenida {
  private preguntasService = inject(PreguntasService);

  totalPreguntas = this.preguntasService.getTodas().length;
}
