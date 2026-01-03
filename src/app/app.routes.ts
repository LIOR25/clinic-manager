import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'providers',
    pathMatch: 'full'
  },
  {
    path: 'providers',
    title: 'Clinic Manager - Providers List',
    loadComponent: () => import('./features/providers/provider-list/provider-list.component').then(m => m.ProviderListComponent),
  },
  {
    path: 'providers/:id',
    title: 'Provider Detail',
    loadComponent: () => import('./features/providers/provider-detail/provider-detail.component').then(m => m.ProviderDetailComponent),
  },
  {
    path: '404',
    title: 'Page Not Found',
    loadComponent: () => import('./shared/components/not-found/not-found.component').then(m => m.NotFoundComponent),
  },
  {
    path: '**',
    redirectTo: '404'
  }
];
