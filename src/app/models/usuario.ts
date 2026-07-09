// Los datos del usuario que guardamos en la sesion
export interface Usuario {
  email: string;
}

// Forma de las respuestas que devuelve el backend
export interface RespuestaAuth {
  codigo: number;
  mensaje: string;
  token?: string;
  usuario?: Usuario;
}
