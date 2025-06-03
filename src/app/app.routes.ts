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
        path: 'registro',
        loadComponent: () => import('./auth/register/register.component').then(m => m.RegisterComponent)
    },
    {
        path: 'recetas',
        children: [
            {
                path: '',
                loadComponent: () => import('./pages/recetas/recetas.component').then(m => m.RecetasComponent)
            },
            {
                path: 'crear',
                loadComponent: () => import('./pages/recetas/crear-receta/crear-receta.component').then(m => m.CrearRecetaComponent),
                canActivate: [AuthGuard]
            },
            {
                path: 'crear/:id',
                loadComponent: () => import('./pages/recetas/crear-receta/crear-receta.component').then(m => m.CrearRecetaComponent),
                canActivate: [AuthGuard]
            },
            {
                path: ':id',
                loadComponent: () => import('./pages/recetas/detalle/receta-detalle.component').then(m => m.DetalleRecetaComponent),
                canActivate: [AuthGuard]
            }
        ]
    },
    {
        path: 'favoritos',
        loadComponent: () => import('./pages/favorites/favorites.component').then(m => m.FavoritesComponent),
        canActivate: [AuthGuard]
    },
    {
        path: 'perfil',
        loadComponent: () => import('./pages/profile/profile.component').then(m => m.ProfileComponent),
        canActivate: [AuthGuard]
    },
    {
        path: '**',
        redirectTo: ''
    }
];
