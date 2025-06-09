import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { Router } from '@angular/router';
import { RecipeService, Recipe } from '../../core/services/receta.service';
import { BreadcrumbService } from 'app/core/services/breadcrumb.service';
import { BreadcrumbComponent } from 'app/shared/breadcrumb/breadcrumb.component';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatExpansionModule, BreadcrumbComponent],
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.scss']
})
export class FavoritesComponent implements OnInit {

  favoritos: Recipe[] = [];
  favoritosPorCategoria: {
    categoria: string;
    categoriaNombre: string;
    recetas: Recipe[];
  }[] = [];

  showScrollTop = false;

  categoriasMap: Record<string, string> = {
    comida: 'Comidas',
    postre: 'Postres',
    empanada: 'Empanadas',
    vegetariano: 'Vegetariano'
  };

  categoriaIconos: Record<string, string> = {
    comida: 'restaurant',
    postre: 'cake',
    empanada: 'local_pizza',
    vegetariano: 'eco'
  };

  constructor(
    private recipeService: RecipeService,
    private breadcrumbService: BreadcrumbService,
    private router: Router
  ) { }

  ngOnInit(): void {
    setTimeout(() => {
      this.breadcrumbService.setBreadcrumbs([
        { label: 'Favoritos', url: '/favoritos' }
      ]);
    });

    this.recipeService.getFavoritosUsuario().subscribe({
      next: (data: Recipe[]) => {
        this.favoritos = data;
        this.agruparPorCategoria();
      },
      error: (err: any) => console.error('Error cargando favoritos', err)
    });

    window.addEventListener('scroll', this.handleScroll, true);
  }

  ngOnDestroy(): void {
    window.removeEventListener('scroll', this.handleScroll, true);
  }

  agruparPorCategoria(): void {
    const agrupados: Record<string, Recipe[]> = {};

    this.favoritos.forEach(receta => {
      const cat = receta.category?.toLowerCase();
      if (!agrupados[cat]) agrupados[cat] = [];
      agrupados[cat].push(receta);
    });

    this.favoritosPorCategoria = Object.entries(agrupados).map(([categoria, recetas]) => ({
      categoria,
      categoriaNombre: this.categoriasMap[categoria] || categoria,
      recetas
    }));
  }

  handleScroll = (): void => {
    this.showScrollTop = window.pageYOffset > 300;
  };

  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  verDetalle(hashedId: string): void {
    this.router.navigate(['/recetas', hashedId], {
      queryParams: { from: 'favoritos' }
    });
  }
}