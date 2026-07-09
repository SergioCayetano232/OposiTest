import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

// ¿Ya decidio como usar la app, con cuenta o como invitado?
const yaHaElegido = (auth: AuthService) => auth.haEntrado() || auth.esInvitado();

// Para la bienvenida: si ya eligio, no le hacemos pasar otra vez por ella
export const saltarBienvenida: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  return yaHaElegido(auth) ? router.createUrlTree(['/inicio']) : true;
};

// Para el resto de la app: si llega de nuevas, primero la bienvenida
export const exigirEleccion: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  return yaHaElegido(auth) ? true : router.createUrlTree(['/']);
};
