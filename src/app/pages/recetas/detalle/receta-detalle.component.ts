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
  liked = false;
  isFavorited = false;

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

          this.recipeService.isFavorited(data.id).subscribe({
            next: (isFav) => {
              this.isFavorited = isFav;
            },
            error: () => console.warn('No se pudo comprobar si es favorita')
          });
        },
        error: () => console.error('Error al cargar receta')
      });
    }
  }

  toggleLike(): void {
    if (!this.receta) return;

    const likeAction = this.liked
      ? this.recipeService.toggleUnlike(this.receta.id)
      : this.recipeService.toggleLike(this.receta.id);

    likeAction.subscribe(() => {
      this.liked = !this.liked;
      this.receta!.likes += this.liked ? 1 : -1;
    });
  }

  toggleFavorite(): void {
    if (!this.receta) return;

    const favAction = this.isFavorited
      ? this.recipeService.toggleUnfavorite(this.receta.id)
      : this.recipeService.toggleFavorite(this.receta.id);

    favAction.subscribe(() => {
      this.isFavorited = !this.isFavorited;
    });
  }

  editarReceta(): void {
    this.router.navigate(['/editar', this.receta?.id]);
  }

  eliminarReceta(): void {
    if (this.receta && confirm('¿Estás seguro de eliminar esta receta?')) {
      this.recipeService.delete(this.receta.id).subscribe(() => this.router.navigate(['/recetas']));
    }
  }
}