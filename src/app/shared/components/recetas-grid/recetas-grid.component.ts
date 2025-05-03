import { Component, Input } from '@angular/core';
import { NgFor } from '@angular/common';
import { RecetaCardComponent } from '../receta-card/receta-card.component';

@Component({
  selector: 'app-recetas-grid',
  standalone: true,
  imports: [NgFor, RecetaCardComponent],
  templateUrl: './recetas-grid.component.html',
  styleUrls: ['./recetas-grid.component.scss']
})
export class RecetasGridComponent {
  @Input() recetas: { id: number; titulo: string; autor: string; imagenUrl: string }[] = [];
}
