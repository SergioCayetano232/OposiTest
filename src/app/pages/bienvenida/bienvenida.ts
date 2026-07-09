import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PreguntasService } from '../../services/preguntas.service';

@Component({
  selector: 'app-bienvenida',
  imports: [RouterLink],
  templateUrl: './bienvenida.html',
  styleUrl: './bienvenida.css',
})
export class Bienvenida {
  private preguntasService = inject(PreguntasService);

  totalPreguntas = this.preguntasService.getTodas().length;
}
