import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RecipeService, Recipe } from '../../core/services/receta.service';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-recetas',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule],
  templateUrl: './recetas.component.html',
  styleUrls: ['./recetas.component.scss']
})
export class RecetasComponent implements OnInit {
  recetas: Recipe[] = [];
  recetasFiltradas: Recipe[] = [];
  filtros = {
    categoria: '',
    titulo: '',
    autor: ''
  };

  constructor(private recipeService: RecipeService) { }

  ngOnInit(): void {
    this.recipeService.getAllRecipes().subscribe({
      next: (data: Recipe[]) => {
        this.recetas = data;
        this.recetasFiltradas = [...data];
      },
      error: (err: any) => console.error('Error al cargar recetas', err)
    });
  }

  filtrar(): void {
    this.recetasFiltradas = this.recetas.filter(receta => {
      return (
        (this.filtros.titulo === '' || receta.title.toLowerCase().includes(this.filtros.titulo.toLowerCase())) &&
        (this.filtros.autor === '' || receta.authorName.toLowerCase().includes(this.filtros.autor.toLowerCase())) &&
        (this.filtros.categoria === '' || receta.tipo === this.filtros.categoria)
      );
    });
  }

  limpiarFiltros(): void {
    this.filtros = { categoria: '', titulo: '', autor: '' };
    this.recetasFiltradas = [...this.recetas];
  }
}