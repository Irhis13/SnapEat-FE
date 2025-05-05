import { Component } from '@angular/core';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs/operators'; 

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  images = [
    { url: 'assets/images/caroussel1.jpg', tipo: 'comida' },
    { url: 'assets/images/caroussel2.jpeg', tipo: 'postre' },
    { url: 'assets/images/caroussel3.JPG', tipo: 'empanada' },
    { url: 'assets/images/caroussel4.avif', tipo: 'vegetariano'}
  ];

  currentIndex = 0;
  showCarousel = true;

  constructor(private router: Router) {
    setInterval(() => this.nextImage(), 5000);

    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        const currentRoute = event.urlAfterRedirects.split('?')[0];
        this.showCarousel = currentRoute === '/';
      });
  }

  goToTipo(tipo: string): void {
    this.router.navigate(['/recetas'], { queryParams: { categoria: tipo.toLowerCase() } });
  }

  nextImage(): void {
    this.currentIndex = (this.currentIndex + 1) % this.images.length;
  }

  prevImage(): void {
    this.currentIndex =
      (this.currentIndex - 1 + this.images.length) % this.images.length;
  }

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

  get currentOverlay() {
    const tipo = this.images[this.currentIndex].tipo;
    return this.overlayTextMap[tipo] || {
      title: 'Recetas de cocina fáciles',
      subtitle: 'Descubre sabores caseros con SnapEat'
    };
  }
}