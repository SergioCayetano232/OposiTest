import { Routes } from '@angular/router';
import { Bienvenida } from './pages/bienvenida/bienvenida';
import { Inicio } from './pages/inicio/inicio';
import { Test } from './pages/test/test';
import { Registro } from './pages/registro/registro';
import { Verificar } from './pages/verificar/verificar';
import { Login } from './pages/login/login';
import { exigirSesion, saltarBienvenida } from './services/acceso.guard';

export const routes: Routes = [
  // lo primero que se ve al llegar, salvo que ya tenga la sesion abierta
  { path: '', component: Bienvenida, canActivate: [saltarBienvenida] },

  // pantallas de acceso: quien ya ha entrado no pinta nada aqui
  { path: 'registro', component: Registro, canActivate: [saltarBienvenida] },
  { path: 'verificar/:email', component: Verificar, canActivate: [saltarBienvenida] },
  { path: 'login', component: Login, canActivate: [saltarBienvenida] },

  // la app en si: hace falta haber iniciado sesion
  { path: 'inicio', component: Inicio, canActivate: [exigirSesion] },
  // secciones tema × fuente, p. ej. test/convenio/ia
  { path: 'test/:tema/:fuente', component: Test, canActivate: [exigirSesion] },
  // ruta de un solo parámetro: simulacros y compatibilidad
  { path: 'test/:tema', component: Test, canActivate: [exigirSesion] },

  { path: '**', redirectTo: '' },
];
