import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-verificar',
  imports: [FormsModule],
  templateUrl: './verificar.html',
  styleUrl: '../acceso.css',
})
export class Verificar {
  private auth = inject(AuthService);
  private router = inject(Router);
  private ruta = inject(ActivatedRoute);

  // El email llega en la url desde la pantalla de registro
  email = this.ruta.snapshot.paramMap.get('email') ?? '';

  codigo = '';
  error = '';
  enviando = false;

  // Al escribir el sexto digito enviamos solo, sin tocar el boton
  alEscribir() {
    if (this.codigo.length === 6) this.verificar();
  }

  async verificar() {
    if (this.enviando) return;
    this.error = '';
    this.enviando = true;

    try {
      await this.auth.verificar(this.email, this.codigo);
      this.router.navigate(['/']);
    } catch (fallo) {
      this.error = (fallo as Error).message;
      this.codigo = '';
    } finally {
      this.enviando = false;
    }
  }
}
