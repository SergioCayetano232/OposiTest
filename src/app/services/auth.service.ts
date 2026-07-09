import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';
import { RespuestaAuth, Usuario } from '../models/usuario';

const CLAVE_TOKEN = 'oposi-test-token';
const CLAVE_USUARIO = 'oposi-test-usuario';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private url = `${environment.urlApi}/auth`;

  // El usuario de la sesion; al cambiar, las pantallas se refrescan solas
  usuario = signal<Usuario | null>(this.leerUsuarioGuardado());
  haEntrado = computed(() => this.usuario() !== null);

  private leerUsuarioGuardado(): Usuario | null {
    try {
      const guardado = localStorage.getItem(CLAVE_USUARIO);
      return guardado ? JSON.parse(guardado) : null;
    } catch {
      return null;
    }
  }

  getToken(): string | null {
    return localStorage.getItem(CLAVE_TOKEN);
  }

  private guardarSesion(token: string, usuario: Usuario) {
    localStorage.setItem(CLAVE_TOKEN, token);
    localStorage.setItem(CLAVE_USUARIO, JSON.stringify(usuario));
    this.usuario.set(usuario);
  }

  cerrarSesion() {
    localStorage.removeItem(CLAVE_TOKEN);
    localStorage.removeItem(CLAVE_USUARIO);
    this.usuario.set(null);
  }

  // Manda la peticion y saca el mensaje del backend si algo falla
  private async llamar(ruta: string, datos: object): Promise<RespuestaAuth> {
    try {
      return await firstValueFrom(this.http.post<RespuestaAuth>(`${this.url}/${ruta}`, datos));
    } catch (error) {
      const fallo = error as HttpErrorResponse;
      // status 0 = no hubo respuesta, casi siempre el servidor esta apagado o dormido
      const mensaje =
        fallo.status === 0
          ? 'no hemos podido conectar con el servidor, intentalo de nuevo'
          : fallo.error?.mensaje ?? 'ha ocurrido un error inesperado';
      throw new Error(mensaje);
    }
  }

  // Crea la cuenta. Todavia no da acceso: hay que verificar el codigo del email.
  async registrar(email: string, password: string): Promise<string> {
    const respuesta = await this.llamar('Registro', { email, password });
    return respuesta.mensaje;
  }

  // Comprueba el codigo del email y deja la sesion iniciada
  async verificar(email: string, codigo: string): Promise<void> {
    const respuesta = await this.llamar('Verificar', { email, codigo });
    this.guardarSesion(respuesta.token!, respuesta.usuario!);
  }

  // Entra un usuario que ya verifico su cuenta
  async entrar(email: string, password: string): Promise<void> {
    const respuesta = await this.llamar('Login', { email, password });
    this.guardarSesion(respuesta.token!, respuesta.usuario!);
  }
}
