import { Component, OnInit } from '@angular/core';
import { RecipeService, Recipe } from '../../core/services/receta.service';
import { CommonModule } from '@angular/common';
import { CategoriasDestacadasComponent } from 'app/pages/home/components/categorias-destacadas/categorias-destacadas.component'
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, CategoriasDestacadasComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  latestRecipes: Recipe[] = [];
  topLikedRecipes: Recipe[] = [];
  isLoggedIn = false;

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
}
