import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-categorias-destacadas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './categorias-destacadas.component.html',
  styleUrls: ['./categorias-destacadas.component.scss']
})
export class CategoriasDestacadasComponent {
  categorias = [
    { nombre: 'Comidas', tipo: 'comida', icon: 'restaurant' },
    { nombre: 'Postres', tipo: 'postre', icon: 'cake' },
    { nombre: 'Empanadas', tipo: 'empanada', icon: 'local_pizza' },
    { nombre: 'Vegetariano', tipo: 'vegetariano', icon: 'eco' }
  ];

  constructor(private router: Router) { }

  irAFiltro(tipo: string) {
    this.router.navigate(['/recetas'], { queryParams: { categoria: tipo } });
  }
}
