import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { BreadcrumbService } from 'app/core/services/breadcrumb.service';
import { RecipeService, Recipe } from 'app/core/services/receta.service';
import { Observable } from 'rxjs';

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
  imagenArchivo: File | null = null;
  categorias: ('COMIDA' | 'POSTRE' | 'EMPANADA' | 'VEGETARIANO')[] = ['COMIDA', 'POSTRE', 'EMPANADA', 'VEGETARIANO'];
  editandoPasoIndex: number | null = null;
  pasoEditado: string = '';

  constructor(
    private recetaService: RecipeService,
    private breadcrumbService: BreadcrumbService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private cdRef: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.hashedId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.hashedId;

    setTimeout(() => {
      this.breadcrumbService.setBreadcrumbs([
        { label: 'Recetas', url: '/recetas' },
        { label: this.isEditMode ? 'Editar receta' : 'Nueva receta', url: this.router.url }
      ]);
    });

    this.cdRef.detectChanges();

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
    const file: File = event.target.files[0];
    const maxSizeMB = 2;

    if (file) {
      if (file.size > maxSizeMB * 1024 * 1024) {
        alert(`La imagen supera los ${maxSizeMB}MB permitidos.`);
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        this.imagenPreview = reader.result as string;
      };
      reader.readAsDataURL(file);

      this.imagenArchivo = file;
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

  iniciarEdicionPaso(index: number): void {
    this.editandoPasoIndex = index;
    this.pasoEditado = this.receta.steps[index];
  }

  guardarEdicionPaso(index: number): void {
    const texto = this.pasoEditado.trim();
    if (texto) {
      this.receta.steps[index] = this.capitalize(texto);
    }
    this.cancelarEdicionPaso();
  }

  cancelarEdicionPaso(): void {
    this.editandoPasoIndex = null;
    this.pasoEditado = '';
  }

  borrarImagen(): void {
    this.imagenPreview = null;
    this.imagenArchivo = null;
    this.receta.imageUrl = '';
  }

  validarFormulario(): boolean {
    if (!this.receta.title || !this.receta.description || !this.receta.category || this.ingredientes.length === 0 || this.receta.steps.length === 0) {
      this.mostrarMensaje('Por favor, completa todos los campos obligatorios.');
      return false;
    }
    return true;
  }

  crearFormData(receta: any, imagen?: File | null): FormData {
    const formData = new FormData();
    formData.append('receta', new Blob([JSON.stringify(receta)], { type: 'application/json' }));
    if (imagen) {
      formData.append('imagen', imagen);
    }
    return formData;
  }

  enviarReceta(request: Observable<any>): void {
    request.subscribe({
      next: (response: any) => {
        const redirectId = response?.hashedId || this.hashedId;
        this.mostrarMensaje('Receta guardada correctamente');
        this.router.navigate(['/recetas', redirectId]);
      },
      error: (err) => {
        console.error('Error al guardar la receta', err);
        this.mostrarMensaje('Error al guardar la receta. Intenta iniciar sesión nuevamente.');
        this.router.navigate(['/login']);
      }
    });
  }

  guardarReceta(): void {
    if (!this.validarFormulario()) return;

    const recetaFinal = {
      ...this.receta,
      ingredients: this.ingredientes.join(', ')
    };

    const request = this.isEditMode && this.hashedId
      ? this.imagenArchivo
        ? this.recetaService.editRecipeFormData(this.hashedId, this.crearFormData(recetaFinal, this.imagenArchivo))
        : this.recetaService.editRecipe(this.hashedId, recetaFinal)
      : this.recetaService.crearRecetaFormData(this.crearFormData(recetaFinal, this.imagenArchivo));

    this.enviarReceta(request);
  }

  mostrarMensaje(mensaje: string): void {
    this.snackBar.open(mensaje, 'Cerrar', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'top'
    });
  }
}