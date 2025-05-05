import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RecipeService, Recipe } from '../../core/services/receta.service';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router } from '@angular/router';

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
    autor: '',
    ingrediente: ''
  };

  constructor(
    private recipeService: RecipeService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const cat = params['categoria'];
      if (cat) {
        this.filtros.categoria = cat;
      }

      this.recipeService.getAllRecipes().subscribe({
        next: (data: Recipe[]) => {
          this.recetas = data;
          this.recetasFiltradas = [...data];
          this.filtrar();
        },
        error: (err: any) => console.error('Error al cargar recetas', err)
      });

      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: {},
        replaceUrl: true
      });
    });
  }

  categorias = [
    { label: 'Comidas', valor: 'comida' },
    { label: 'Postres', valor: 'postre' },
    { label: 'Empanadas', valor: 'empanada' },
    { label: 'Vegetariano', valor: 'vegetariano' }
  ];

  toggleCategoria(valor: string): void {
    this.filtros.categoria = this.filtros.categoria === valor ? '' : valor;
    this.filtrar();
  }

  filtrar(): void {
    this.recetasFiltradas = this.recetas.filter(receta => {
      return (
        (this.filtros.titulo === '' || receta.title.toLowerCase().includes(this.filtros.titulo.toLowerCase())) &&
        (this.filtros.autor === '' || receta.authorName.toLowerCase().includes(this.filtros.autor.toLowerCase())) &&
        (this.filtros.categoria === '' || receta.category === this.filtros.categoria.toUpperCase()) &&
        (this.filtros.ingrediente === '' || receta.ingredients.toLowerCase().includes(this.filtros.ingrediente.toLowerCase()))
      );
    });
  }

  limpiarFiltros(): void {
    this.filtros = { categoria: '', titulo: '', autor: '', ingrediente: '' };
    this.recetasFiltradas = [...this.recetas];
  }

  verDetalle(id: number): void {
    this.router.navigate(['/recetas', id]);
  }
}