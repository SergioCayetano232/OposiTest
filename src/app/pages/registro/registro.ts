import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { BotonTema } from '../../componentes/boton-tema/boton-tema';

@Component({
  selector: 'app-registro',
  imports: [FormsModule, RouterLink, BotonTema],
  templateUrl: './registro.html',
  styleUrl: '../acceso.css',
})
export class Registro {
  private auth = inject(AuthService);
  private router = inject(Router);

  email = '';
  password = '';
  error = '';
  enviando = false;

  async registrar() {
    this.error = '';
    this.enviando = true;

    try {
      await this.auth.registrar(this.email, this.password);
      // El email viaja en la url para no perderlo si recarga la pagina
      this.router.navigate(['/verificar', this.email.trim().toLowerCase()]);
    } catch (fallo) {
      this.error = (fallo as Error).message;
    } finally {
      this.enviando = false;
    }
  }
}
