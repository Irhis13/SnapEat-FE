import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-categoria-card',
  standalone: true,
  templateUrl: './categoria-card.component.html',
  styleUrls: ['./categoria-card.component.scss']
})
export class CategoriaCardComponent {
  @Input() tipo!: string;
  @Input() imagenUrl!: string;

  constructor(private router: Router) { }

  filtrarPorTipo() {
    this.router.navigate(['/recetas'], { queryParams: { tipo: this.tipo } });
  }
}
