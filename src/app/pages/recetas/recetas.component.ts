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
  ordenSeleccionado = '';
  showScrollTop = false;
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

    window.addEventListener('scroll', this.handleScroll, true);
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

  ordenar(): void {
    if (!this.ordenSeleccionado) return;

    this.recetasFiltradas.sort((a, b) => {
      switch (this.ordenSeleccionado) {
        case 'titulo-asc':
          return a.title.localeCompare(b.title);
        case 'titulo-desc':
          return b.title.localeCompare(a.title);
        case 'fecha-reciente':
          return b.id - a.id;
        case 'fecha-antigua':
          return a.id - b.id;
        case 'likes':
          return b.likes - a.likes;
        default:
          return 0;
      }
    });
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
    this.ordenar();
  }

  limpiarFiltros(): void {
    this.filtros = { categoria: '', titulo: '', autor: '', ingrediente: '' };
    this.ordenSeleccionado = '';
    this.recetasFiltradas = [...this.recetas];
  }

  verDetalle(id: number): void {
    this.router.navigate(['/recetas', id]);
  }

  ngOnDestroy(): void {
    window.removeEventListener('scroll', this.handleScroll, true);
  }

  handleScroll = (): void => {
    this.showScrollTop = window.pageYOffset > 300;
  };

  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}