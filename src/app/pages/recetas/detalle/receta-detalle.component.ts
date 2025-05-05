import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { RecipeService, Recipe } from '../../../core/services/receta.service';
import { HttpClient } from '@angular/common/http';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-receta-detalle',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './receta-detalle.component.html',
  styleUrls: ['./receta-detalle.component.scss']
})
export class DetalleRecetaComponent implements OnInit {
  receta: Recipe | null = null;
  isAuthor = false;
  isLiked = false;
  liked = false;

  constructor(
    private route: ActivatedRoute,
    private recipeService: RecipeService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.recipeService.getById(+id).subscribe({
        next: (data) => {
          this.receta = data;
          this.liked = data.likedByCurrentUser;
          this.isAuthor = data.isOwner;
        },
        error: () => console.error('Error al cargar receta')
      });
    }
  }

  toggleLike(): void {
    if (!this.receta) return;

    if (this.liked) {
      this.recipeService.toggleUnlike(this.receta.id).subscribe(() => {
        this.liked = false;
        this.receta!.likes -= 1;
      });
    } else {
      this.recipeService.toggleLike(this.receta.id).subscribe(() => {
        this.liked = true;
        this.receta!.likes += 1;
      });
    }
  }

  editarReceta(): void {
    this.router.navigate(['/editar', this.receta?.id]);
  }

  eliminarReceta(): void {
    if (!this.receta) return;
    if (confirm('¿Estás seguro de eliminar esta receta?')) {
      this.recipeService.delete(this.receta.id).subscribe(() => this.router.navigate(['/recetas']));
    }
  }

  isFavorited = false;

  toggleFavorite(): void {
    this.isFavorited = !this.isFavorited;
  }
}