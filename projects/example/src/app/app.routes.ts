import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home.component'),
  },
  {
    path: 'seedkit',
    loadComponent: () => import('./pages/seedkit.component'),
  },
];
