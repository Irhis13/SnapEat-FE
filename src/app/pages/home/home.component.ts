import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RecipeService, Recipe } from '../../core/services/receta.service';
import { CategoriasDestacadasComponent } from 'app/pages/home/components/categorias-destacadas/categorias-destacadas.component';
import { Router, NavigationEnd } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { trigger, transition, style, animate } from '@angular/animations';
import { filter } from 'rxjs/operators';
import Hashids from 'hashids';

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
  currentIndex = 0;
  showCarousel = true;
  private hashids = new Hashids('tu_salt_secreta', 8);

  images = [
    { url: 'assets/images/caroussel1.jpg', tipo: 'comida' },
    { url: 'assets/images/caroussel2.jpeg', tipo: 'postre' },
    { url: 'assets/images/caroussel3.JPG', tipo: 'empanada' },
    { url: 'assets/images/caroussel4.avif', tipo: 'vegetariano' }
  ];

  overlayTextMap: { [key: string]: { title: string; subtitle: string } } = {
    comida: {
      title: 'Sabores que reconfortan',
      subtitle: 'Platos clásicos para disfrutar en buena compañía'
    },
    postre: {
      title: 'Momentos dulces',
      subtitle: 'Descubre postres que alegran cada ocasión'
    },
    empanada: {
      title: 'Empanadas irresistibles',
      subtitle: 'Crujientes, rellenas y fáciles de preparar'
    },
    vegetariano: {
      title: 'Placeres vegetarianos',
      subtitle: 'Delicias vegetarianas para todos los gustos'
    }
  };

  constructor(private recipeService: RecipeService, private router: Router) {
    setInterval(() => this.nextImage(), 5000);

    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        const currentRoute = event.urlAfterRedirects.split('?')[0];
        this.showCarousel = currentRoute === '/';
      });
  }

  ngOnInit(): void {
    this.isLoggedIn = !!localStorage.getItem('token');

    this.recipeService.getLatestRecipes().subscribe({
      next: recipes => this.latestRecipes = recipes,
      error: err => console.error('Error cargando recetas', err)
    });

    this.recipeService.getTopLikedRecipes().subscribe({
      next: recipes => this.topLikedRecipes = recipes,
      error: err => console.error('Error cargando top recetas', err)
    });
  }

  crearReceta(): void {
    this.router.navigate(['/recetas/crear']);
  }

  verDetalle(id: number): void {
    const hashedId = this.hashids.encode(id);
    this.router.navigate(['/recetas', hashedId]);
  }

  nextImage(): void {
    this.currentIndex = (this.currentIndex + 1) % this.images.length;
  }

  prevImage(): void {
    this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
  }

  goToTipo(tipo: string): void {
    this.router.navigate(['/recetas'], { queryParams: { categoria: tipo.toLowerCase() } });
  }

  get currentOverlay() {
    const tipo = this.images[this.currentIndex].tipo;
    return this.overlayTextMap[tipo] || {
      title: 'Recetas de cocina fáciles',
      subtitle: 'Descubre sabores caseros con SnapEat'
    };
  }
}