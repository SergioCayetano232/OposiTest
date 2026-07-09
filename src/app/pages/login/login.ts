import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService, CODIGO_SIN_VERIFICAR, ErrorAuth } from '../../services/auth.service';
import { BotonTema } from '../../componentes/boton-tema/boton-tema';

@Component({
  selector: 'app-login',
  imports: [FormsModule, RouterLink, BotonTema],
  templateUrl: './login.html',
  styleUrl: '../acceso.css',
})
export class Login {
  // publico porque la plantilla mira si el servidor esta despertando
  auth = inject(AuthService);
  private router = inject(Router);

  email = '';
  password = '';
  error = '';
  enviando = false;

  async entrar() {
    this.error = '';
    this.enviando = true;

    try {
      await this.auth.entrar(this.email, this.password);
      this.router.navigate(['/inicio']);
    } catch (fallo) {
      const error = fallo as ErrorAuth;

      // Si la cuenta existe pero no esta verificada, le llevamos a meter el codigo
      if (error.codigo === CODIGO_SIN_VERIFICAR) {
        this.router.navigate(['/verificar', this.email.trim().toLowerCase()]);
        return;
      }

      this.error = error.message;
    } finally {
      this.enviando = false;
    }
  }
}
