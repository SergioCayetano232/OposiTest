import { Routes } from '@angular/router';
import { Inicio } from './pages/inicio/inicio';
import { Test } from './pages/test/test';
import { Registro } from './pages/registro/registro';
import { Verificar } from './pages/verificar/verificar';
import { Login } from './pages/login/login';

export const routes: Routes = [
  { path: '', component: Inicio },
  // pantallas de acceso: el email viaja en la url hasta la de verificar
  { path: 'registro', component: Registro },
  { path: 'verificar/:email', component: Verificar },
  { path: 'login', component: Login },
  // secciones tema × fuente, p. ej. test/convenio/ia
  { path: 'test/:tema/:fuente', component: Test },
  // ruta de un solo parámetro: simulacros y compatibilidad
  { path: 'test/:tema', component: Test },
  { path: '**', redirectTo: '' },
];
