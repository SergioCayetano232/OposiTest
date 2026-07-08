import { Routes } from '@angular/router';
import { Inicio } from './pages/inicio/inicio';
import { Test } from './pages/test/test';

export const routes: Routes = [
  { path: '', component: Inicio },
  // secciones tema × fuente, p. ej. test/convenio/ia
  { path: 'test/:tema/:fuente', component: Test },
  // ruta de un solo parámetro: simulacros y compatibilidad
  { path: 'test/:tema', component: Test },
  { path: '**', redirectTo: '' },
];
