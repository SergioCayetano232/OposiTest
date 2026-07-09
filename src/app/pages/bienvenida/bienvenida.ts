import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { PreguntasService } from '../../services/preguntas.service';

@Component({
  selector: 'app-bienvenida',
  imports: [RouterLink],
  templateUrl: './bienvenida.html',
  styleUrl: './bienvenida.css',
})
export class Bienvenida {
  private auth = inject(AuthService);
  private router = inject(Router);
  private preguntasService = inject(PreguntasService);

  totalPreguntas = this.preguntasService.getTodas().length;

  seguirComoInvitado() {
    this.auth.entrarComoInvitado();
    this.router.navigate(['/inicio']);
  }
}
