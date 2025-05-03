import { Component, OnInit } from '@angular/core';
import { RecipeService, Recipe } from '../../core/services/receta.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  latestRecipes: Recipe[] = [];

  constructor(private recipeService: RecipeService) { }

  ngOnInit(): void {
    this.recipeService.getLatestRecipes().subscribe({
      next: (recipes) => (this.latestRecipes = recipes),
      error: (err) => console.error('Error cargando recetas', err)
    });
  }
}
