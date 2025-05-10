import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { AuthGuard } from './core/guards/auth.guard';

export const routes: Routes = [
    {
        path: '',
        component: HomeComponent,
    },
    {
        path: 'login',
        loadComponent: () => import('./auth/login/login.component').then(m => m.LoginComponent)
    },
    {
        path: 'register',
        loadComponent: () => import('./auth/register/register.component').then(m => m.RegisterComponent)
    },
    {
        path: 'recetas',
        loadComponent: () => import('./pages/recetas/recetas.component').then(m => m.RecetasComponent)
    },
    {
        path: 'recetas/crear',
        loadComponent: () => import('./pages/recetas/crear-receta/crear-receta.component').then(m => m.CrearRecetaComponent),
        canActivate: [AuthGuard]
    },
    {
        path: 'recetas/:id',
        loadComponent: () => import('./pages/recetas/detalle/receta-detalle.component').then(m => m.DetalleRecetaComponent),
        canActivate: [AuthGuard]
    },
    {
        path: '**',
        redirectTo: ''
    }
];
