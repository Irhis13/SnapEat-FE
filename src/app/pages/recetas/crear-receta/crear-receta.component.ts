import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { BreadcrumbService } from 'app/core/services/breadcrumb.service';
import { RecipeService, Recipe } from 'app/core/services/receta.service';
import { Observable } from 'rxjs';
import { SnackbarComponent } from 'app/shared/snackbar/snackbar.component';
import { BreadcrumbComponent } from 'app/shared/breadcrumb/breadcrumb.component';

@Component({
  selector: 'app-crear-receta',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatIconModule,
    MatSnackBarModule,
    BreadcrumbComponent
  ],
  templateUrl: './crear-receta.component.html',
  styleUrls: ['./crear-receta.component.scss'],
  encapsulation: ViewEncapsulation.None
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
  origen: string = '/recetas';

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

    const nav = this.router.getCurrentNavigation();
    const state = nav?.extras?.state as { from?: string };
    if (state?.from) {
      this.origen = state.from;
    }

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
    const fileInput = event.target as HTMLInputElement;

    const file = fileInput.files && fileInput.files.length > 0 ? fileInput.files[0] : null;
    const maxSizeMB = 2;

    if (!file) return;

    fileInput.value = '';

    const validTypes = ['image/png', 'image/jpeg', 'image/webp'];

    if (!validTypes.includes(file.type)) {
      this.mostrarMensajePersonalizado(
        'Formato de imagen no válido. Solo se permiten PNG, JPEG o WebP.',
        'warning'
      );
      return;
    }

    if (file.size > maxSizeMB * 1024 * 1024) {
      this.mostrarMensajePersonalizado(`La imagen supera los ${maxSizeMB}MB permitidos.`, 'warning');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      this.imagenPreview = reader.result as string;
    };
    reader.readAsDataURL(file);

    this.imagenArchivo = file;
  }

  capitalizeIngrediente(text: string): string {
    if (!text) return '';
    const trimmed = text.trim();
    return trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
  }

  capitalizePaso(text: string): string {
    if (!text) return '';
    let trimmed = text.trim();
    if (!trimmed.endsWith('.')) {
      trimmed += '.';
    }
    return trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
  }

  agregarIngrediente() {
    const ingrediente = this.capitalizeIngrediente(this.nuevoIngrediente.trim());

    if (!ingrediente) {
      this.mostrarMensajePersonalizado('El ingrediente no puede estar vacío.', 'warning');
      return;
    }

    if (this.ingredientes.includes(ingrediente)) {
      this.mostrarMensajePersonalizado('Ese ingrediente ya está añadido.', 'warning');
      return;
    }

    this.ingredientes.push(ingrediente);
    this.nuevoIngrediente = '';
    this.receta.ingredients = this.ingredientes.join(', ');
  }

  eliminarIngrediente(index: number) {
    this.ingredientes.splice(index, 1);
    this.receta.ingredients = this.ingredientes.join(', ');
  }

  agregarPaso() {
    const paso = this.nuevoPaso.trim();

    if (!paso) {
      this.mostrarMensajePersonalizado('El paso no puede estar vacío.', 'warning');
      return;
    }

    this.receta.steps.push(this.capitalizePaso(paso));
    this.nuevoPaso = '';
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
    if (!texto) {
      this.mostrarMensajePersonalizado('El paso editado no puede estar vacío.', 'warning');
      return;
    }

    const original = this.receta.steps[index].trim().replace(/\.$/, '');
    const editado = texto.replace(/\.$/, '');

    if (original === editado) {
      this.mostrarMensajePersonalizado('No hay cambios en el paso.', 'info');
      this.cancelarEdicionPaso();
      return;
    }

    this.receta.steps[index] = this.capitalizePaso(texto);
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
    if (!this.receta.title) {
      this.mostrarMensajePersonalizado('El título es obligatorio.', 'warning');
      return false;
    }

    if (!this.receta.description) {
      this.mostrarMensajePersonalizado('La descripción es obligatoria.', 'warning');
      return false;
    }

    if (this.ingredientes.length === 0) {
      this.mostrarMensajePersonalizado('Agrega al menos un ingrediente.', 'warning');
      return false;
    }

    if (this.receta.steps.length === 0) {
      this.mostrarMensajePersonalizado('Agrega al menos un paso.', 'warning');
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
        this.mostrarMensajePersonalizado('Receta guardada correctamente', 'success');
        this.router.navigate(['/recetas', redirectId]);
      },
      error: (err) => {
        console.error('Error al guardar la receta', err);
        this.mostrarMensajePersonalizado('Error al guardar la receta. Intenta iniciar sesión nuevamente.', 'error');
        this.router.navigate(['/login']);
      }
    });
  }

  guardarReceta(): void {
    if (!this.validarFormulario()) return;

    const recetaFinal = {
      ...this.receta,
      ingredients: this.ingredientes.join(', '),
      imageUrl: this.imagenArchivo ? '' : this.receta.imageUrl || 'assets/images/recipe_default.png'
    };

    const request = this.isEditMode && this.hashedId
      ? this.imagenArchivo
        ? this.recetaService.editRecipeFormData(this.hashedId, this.crearFormData(recetaFinal, this.imagenArchivo))
        : this.recetaService.editRecipe(this.hashedId, recetaFinal)
      : this.recetaService.crearRecetaFormData(this.crearFormData(recetaFinal, this.imagenArchivo));

    this.enviarReceta(request);
  }

  cancelarEdicion(): void {
    if (this.hashedId) {
      this.router.navigate(['/recetas', this.hashedId]);
    } else {
      this.router.navigate(['/recetas']);
    }
  }

  mostrarMensajePersonalizado(mensaje: string, tipo: 'error' | 'success' | 'info' | 'warning' = 'error') {
    this.snackBar.dismiss();

    setTimeout(() => {
      this.snackBar.openFromComponent(SnackbarComponent, {
        data: {
          message: mensaje,
          type: tipo,
          snackRef: this.snackBar
        },
        duration: 4000,
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
        panelClass: ['custom-snackbar-position']
      });
    }, 100);
  }
}