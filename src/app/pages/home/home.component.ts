import { Component, OnInit } from '@angular/core';
import { RecipeService, Recipe } from '../../core/services/receta.service';
import { CommonModule } from '@angular/common';
import { CategoriasDestacadasComponent } from 'app/pages/home/components/categorias-destacadas/categorias-destacadas.component'
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, CategoriasDestacadasComponent, MatIconModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({ opacity: 0, transform: 'translateY(20px)' }))
      ])
    ])
  ]
})
export class HomeComponent implements OnInit {
  latestRecipes: Recipe[] = [];
  topLikedRecipes: Recipe[] = [];
  isLoggedIn = false;
  mostrarCTA = false;

  constructor(private recipeService: RecipeService, private router: Router) { }

  ngOnInit(): void {
    this.recipeService.getLatestRecipes().subscribe({
      next: (recipes) => (this.latestRecipes = recipes),
      error: (err) => console.error('Error cargando recetas', err)
    });

    this.recipeService.getTopLikedRecipes().subscribe({
      next: (recipes) => (this.topLikedRecipes = recipes),
      error: (err) => console.error('Error cargando top recetas', err)
    });

    this.isLoggedIn = !!localStorage.getItem('token'); 
  }

  crearReceta(): void {
    this.router.navigate(['/recetas/crear']);
  }

  verDetalle(id: number): void {
    this.router.navigate(['/recetas', id]);
  }
}
