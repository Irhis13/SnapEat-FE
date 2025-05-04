import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-receta-card',
  standalone: true,
  templateUrl: './receta-card.component.html',
  styleUrls: ['./receta-card.component.scss']
})
export class RecetaCardComponent {
  @Input() id!: number;
  @Input() titulo!: string;
  @Input() autor!: string;
  @Input() imagenUrl!: string;

  constructor(private router: Router) { }

  verDetalle() {
    this.router.navigate(['/recetas', this.id]);
  }

  isLoggedIn = !!localStorage.getItem('token');
}
