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
    this.router.navigate(['/recetas'], { queryParams: { tipo } });
  }

  nextImage(): void {
    this.currentIndex = (this.currentIndex + 1) % this.images.length;
  }

  prevImage(): void {
    this.currentIndex =
      (this.currentIndex - 1 + this.images.length) % this.images.length;
  }
}