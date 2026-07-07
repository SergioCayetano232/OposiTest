import { Routes } from '@angular/router';
import { Inicio } from './pages/inicio/inicio';
import { Test } from './pages/test/test';

export const routes: Routes = [
  { path: '', component: Inicio },
  { path: 'test/:tema', component: Test },
  { path: '**', redirectTo: '' },
];
