import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router } from '@angular/router';
import { RecipeService, Recipe } from 'app/core/services/receta.service';

@Component({
  selector: 'app-crear-receta',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MatIconModule],
  templateUrl: './crear-receta.component.html',
  styleUrls: ['./crear-receta.component.scss']
})
export class CrearRecetaComponent implements OnInit {
  receta: Omit<Recipe, 'id' | 'hashedId' | 'authorName' | 'authorId' | 'likes' | 'likedByCurrentUser' | 'favoritedByCurrentUser' | 'owner'> = {
    title: '',
    description: '',
    category: 'COMIDA',
    ingredients: '',
    imageUrl: '',
    steps: []
  };

  isEditMode = false;
  hashedId: string | null = null;

  nuevoIngrediente = '';
  ingredientes: string[] = [];
  nuevoPaso = '';
  imagenPreview: string | null = null;
  categorias: ('COMIDA' | 'POSTRE' | 'EMPANADA' | 'VEGETARIANO')[] = ['COMIDA', 'POSTRE', 'EMPANADA', 'VEGETARIANO'];

  constructor(
    private recetaService: RecipeService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.hashedId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.hashedId;

    if (this.isEditMode && this.hashedId) {
      this.recetaService.getById(this.hashedId).subscribe((data: Recipe) => {
        this.receta = {
          title: data.title,
          description: data.description,
          category: data.category,
          ingredients: data.ingredients,
          imageUrl: data.imageUrl,
          steps: [...data.steps]
        };

        this.ingredientes = (data.ingredients || '').split(',').map(i => i.trim());
        this.imagenPreview = data.imageUrl;
      });
    }
  }

  onImageChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.imagenPreview = reader.result as string;
        this.receta.imageUrl = this.imagenPreview;
      };
      reader.readAsDataURL(file);
    }
  }

  capitalize(text: string): string {
    return text.charAt(0).toUpperCase() + text.slice(1);
  }

  agregarIngrediente() {
    const ingrediente = this.capitalize(this.nuevoIngrediente.trim());
    if (ingrediente) {
      this.ingredientes.push(ingrediente);
      this.nuevoIngrediente = '';
      this.receta.ingredients = this.ingredientes.join(', ');
    }
  }

  eliminarIngrediente(index: number) {
    this.ingredientes.splice(index, 1);
    this.receta.ingredients = this.ingredientes.join(', ');
  }

  agregarPaso() {
    const paso = this.capitalize(this.nuevoPaso.trim());
    if (paso) {
      this.receta.steps.push(paso);
      this.nuevoPaso = '';
    }
  }

  eliminarPaso(index: number) {
    this.receta.steps.splice(index, 1);
  }

  guardarReceta(): void {
    // Validación básica
    if (!this.receta.title || !this.receta.description || !this.receta.category || this.ingredientes.length === 0 || this.receta.steps.length === 0) {
      alert('Por favor, completa todos los campos obligatorios.');
      return;
    }

    const formData = new FormData();
    const recetaSinImagen = {
      ...this.receta,
      category: this.receta.category
    };

    const imagenBlob = this.imagenPreview ? this.dataURLtoBlob(this.imagenPreview) : null;

    formData.append('receta', new Blob([JSON.stringify(recetaSinImagen)], { type: 'application/json' }));
    if (imagenBlob) {
      formData.append('imagen', imagenBlob, 'imagen.png');
    }

    if (this.isEditMode && this.hashedId) {
      this.recetaService.editRecipe(this.hashedId, recetaSinImagen).subscribe({
        next: () => this.router.navigate(['/recetas', this.hashedId]),
        error: (err) => {
          console.error('Error al editar receta', err);
          alert('No se pudo editar la receta.');
        }
      });
    } else {
      this.recetaService.crearRecetaFormData(formData).subscribe({
        next: (response) => {
          this.router.navigate(['/recetas', response.hashedId]);
        },
        error: (err) => {
          console.error('Error al crear receta', err);
          alert('Ocurrió un error al guardar la receta. Intenta iniciar sesión nuevamente.');
          this.router.navigate(['/login']);
        }
      });
    }
  }

  dataURLtoBlob(dataUrl: string): Blob {
    const arr = dataUrl.split(',');
    const mime = arr[0].match(/:(.*?);/)![1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
  }
}