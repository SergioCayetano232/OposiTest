import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

// Para la bienvenida: si ya tiene sesion, no le hacemos pasar otra vez por ella
export const saltarBienvenida: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  return auth.haEntrado() ? router.createUrlTree(['/inicio']) : true;
};

// Para el resto de la app: sin sesion no se entra
export const exigirSesion: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  return auth.haEntrado() ? true : router.createUrlTree(['/']);
};
