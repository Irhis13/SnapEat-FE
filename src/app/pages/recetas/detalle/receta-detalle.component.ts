import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { RecipeService, Recipe } from '../../../core/services/receta.service';
import { MatIconModule } from '@angular/material/icon';
import Hashids from 'hashids';
import { BreadcrumbService } from 'app/core/services/breadcrumb.service';
import { BreadcrumbComponent } from 'app/shared/breadcrumb/breadcrumb.component';

@Component({
  selector: 'app-receta-detalle',
  standalone: true,
  imports: [CommonModule, MatIconModule, BreadcrumbComponent],
  templateUrl: './receta-detalle.component.html',
  styleUrls: ['./receta-detalle.component.scss']
})
export class DetalleRecetaComponent implements OnInit {
  receta: Recipe | null = null;
  isAuthor = false;
  liked = false;
  isFavorited = false;
  private hashids = new Hashids('tu_salt_secreta', 8);

  constructor(
    private route: ActivatedRoute,
    private recipeService: RecipeService,
    private authService: AuthService,
    private breadcrumbService: BreadcrumbService,
    private router: Router
  ) { }

  ngOnInit(): void {
    const hashedId = this.route.snapshot.paramMap.get('id');
    if (!hashedId) return;

    setTimeout(() => {
      this.breadcrumbService.setBreadcrumbs([
        { label: 'Recetas', url: '/recetas' },
        { label: 'Detalle', url: this.router.url }
      ]);
    });

    this.recipeService.getById(hashedId).subscribe({
      next: data => {
        this.receta = data;
        this.liked = data.likedByCurrentUser;
        this.isAuthor = data.owner;

        this.recipeService.isFavorited(hashedId).subscribe({
          next: fav => this.isFavorited = fav,
          error: () => console.warn('No se pudo comprobar si es favorita')
        });
      },
      error: () => console.error('Error al cargar receta')
    });
  }

  toggleLike(): void {
    if (!this.receta) return;

    const likeAction = this.liked
      ? this.recipeService.toggleUnlike(this.receta.hashedId)
      : this.recipeService.toggleLike(this.receta.hashedId);

    likeAction.subscribe(() => {
      this.liked = !this.liked;
      this.receta!.likes += this.liked ? 1 : -1;
    });
  }

  toggleFavorite(): void {
    if (!this.receta) return;

    const favAction = this.isFavorited
      ? this.recipeService.toggleUnfavorite(this.receta.hashedId)
      : this.recipeService.toggleFavorite(this.receta.hashedId);

    favAction.subscribe(() => {
      this.isFavorited = !this.isFavorited;
    });
  }

  editarReceta(): void {
    if (this.receta) {
      this.router.navigate(['/recetas/crear', this.receta.hashedId]);
    }
  }

  eliminarReceta(): void {
    if (this.receta && confirm('¿Estás seguro de eliminar esta receta?')) {
      this.recipeService.delete(this.receta.hashedId).subscribe(() => this.router.navigate(['/recetas']));
    }
  }
}