import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { RecipeService } from 'app/core/services/receta.service';

@Component({
  selector: 'app-crear-receta',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MatIconModule],
  templateUrl: './crear-receta.component.html',
  styleUrls: ['./crear-receta.component.scss']
})
export class CrearRecetaComponent implements OnInit {
  receta = {
    title: '',
    description: '',
    category: '',
    ingredients: '',
    imageUrl: '',
    steps: [] as string[]
  };

  nuevoIngrediente = '';
  ingredientes: string[] = [];
  nuevoPaso = '';
  imagenPreview: string | null = null;
  categorias = ['Comida', 'Postre', 'Empanada', 'Vegetariano'];

  constructor(
    private recetaService: RecipeService,
    private router: Router
  ) { }

  ngOnInit(): void { }

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

  seleccionarCategoria(categoria: string) {
    this.receta.category = categoria.toUpperCase();
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
    const formData = new FormData();

    const recetaSinImagen = { ...this.receta };
    const imagenBlob = this.dataURLtoBlob(this.imagenPreview!);

    formData.append('receta', new Blob([JSON.stringify(recetaSinImagen)], { type: 'application/json' }));
    if (imagenBlob) {
      formData.append('imagen', imagenBlob, 'imagen.png');
    }

    this.recetaService.crearRecetaFormData(formData).subscribe({
      next: () => this.router.navigate(['/recetas']),
      error: err => {
        console.error('Error al crear receta', err);
        alert('Ocurrió un error al guardar la receta. Intenta iniciar sesión nuevamente.');
        this.router.navigate(['/login']);
      }
    });
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