import { Routes } from '@angular/router';
import { Bienvenida } from './pages/bienvenida/bienvenida';
import { Inicio } from './pages/inicio/inicio';
import { Test } from './pages/test/test';
import { Registro } from './pages/registro/registro';
import { Verificar } from './pages/verificar/verificar';
import { Login } from './pages/login/login';
import { exigirEleccion, saltarBienvenida } from './services/acceso.guard';

export const routes: Routes = [
  // lo primero que se ve al llegar, salvo que ya haya entrado o sea invitado
  { path: '', component: Bienvenida, canActivate: [saltarBienvenida] },

  // pantallas de acceso: el email viaja en la url hasta la de verificar
  { path: 'registro', component: Registro },
  { path: 'verificar/:email', component: Verificar },
  { path: 'login', component: Login },

  // la app en si: hay que haber elegido cuenta o invitado para llegar aqui
  { path: 'inicio', component: Inicio, canActivate: [exigirEleccion] },
  // secciones tema × fuente, p. ej. test/convenio/ia
  { path: 'test/:tema/:fuente', component: Test, canActivate: [exigirEleccion] },
  // ruta de un solo parámetro: simulacros y compatibilidad
  { path: 'test/:tema', component: Test, canActivate: [exigirEleccion] },

  { path: '**', redirectTo: '' },
];
