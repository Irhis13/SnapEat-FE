import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule],
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

  constructor(private router: Router) {
    setInterval(() => this.nextImage(), 5000);
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
