import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { UserService } from 'app/core/services/user.service';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent {
  usuario = {
    email: 'usuario@email.com',
    nombre: 'Nombre Apellido',
    profileImage: null
  };

  mostrarSelector = false;
  modalClosing = false;
  avatars: string[] = [];
  defaultAvatars = [
    'assets/avatars/avatar1.png',
    'assets/avatars/avatar2.png',
    'assets/avatars/avatar3.png',
    'assets/avatars/avatar4.png'
  ];
  
  fotoUrl: string | ArrayBuffer | null = null;
  selectedImage: File | null = null;

  nuevaPassword = '';
  confirmarPassword = '';
  defaultAvatar = 'assets/avatars/avatar2.png';

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.loadAvatars();
    this.userService.getPerfil().subscribe({
      next: (user: any) => {
        this.usuario = {
          email: user.email,
          nombre: user.name,
          profileImage: user.profileImage
        };

        this.fotoUrl = user.profileImage || this.defaultAvatar;
      }
    });
  }

  onFotoSeleccionada(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.selectedImage = input.files[0];

      const reader = new FileReader();
      reader.onload = () => {
        this.fotoUrl = reader.result;

        const formData = new FormData();
        formData.append('perfil', new Blob(
          [JSON.stringify({ name: this.usuario.nombre })],
          { type: 'application/json' }
        ));
        formData.append('imagen', this.selectedImage!);

        this.userService.actualizarPerfil(formData).subscribe({
          next: () => {
            this.loadAvatars();
            this.modalClosing = true;
            setTimeout(() => {
              this.mostrarSelector = false;
              this.modalClosing = false;
            }, 200);
          },
          error: err => console.error('Error al subir imagen', err)
        });
      };

      reader.readAsDataURL(this.selectedImage);
    }
  }

  abrirModal(): void {
    this.mostrarSelector = true;
    document.body.style.overflow = 'hidden';
  }

  cerrarSelector(): void {
    this.mostrarSelector = false;
    document.body.style.overflow = '';
  }

  loadAvatars(): void {
    this.userService.getUserAvatars().subscribe({
      next: (avatars: string[]) => {
        this.avatars = [
          ...this.defaultAvatars,
          ...avatars.filter((url: string) => !this.defaultAvatars.includes(url))
        ];
      },
      error: (err: any) => console.error('Error al cargar avatares del usuario', err)
    });
  }

  seleccionarAvatar(avatar: string): void {
    const formData = new FormData();
    formData.append('perfil', new Blob(
      [JSON.stringify({ name: this.usuario.nombre, imageUrl: avatar })],
      { type: 'application/json' }
    ));

    this.userService.actualizarPerfil(formData).subscribe({
      next: () => {
        this.fotoUrl = avatar;
        this.selectedImage = null;
        this.loadAvatars();
        this.modalClosing = true;
        setTimeout(() => {
          this.mostrarSelector = false;
          this.modalClosing = false;
        }, 200);
      },
      error: err => console.error('Error al guardar avatar seleccionado', err)
    });
  }

  eliminarAvatarUsuario(url: string, event: MouseEvent): void {
    event.stopPropagation();
    this.userService.eliminarAvatar(url).subscribe({
      next: () => {
        this.avatars = this.avatars.filter((a: string) => a !== url);
        if (this.fotoUrl === url) this.fotoUrl = this.defaultAvatar;
      },
      error: (err: any) => {
        if (err.status === 500 && err.error?.message?.includes('actualmente en uso')) {
          alert('No puedes eliminar el avatar que estás usando actualmente.');
        } else {
          console.error('Error al eliminar avatar', err);
        }
      }
    });
  }

  guardarCambios(): void {
    if (this.nuevaPassword && this.nuevaPassword !== this.confirmarPassword) {
      alert('Las contraseñas no coinciden');
      return;
    }

    const formData = new FormData();
    const perfilData = {
      name: this.usuario.nombre,
      password: this.nuevaPassword || undefined,
      imageUrl: typeof this.fotoUrl === 'string' && !this.selectedImage ? this.fotoUrl : undefined
    };

    formData.append('perfil', new Blob([JSON.stringify(perfilData)], { type: 'application/json' }));
    if (this.selectedImage) {
      formData.append('imagen', this.selectedImage);
    }

    this.userService.actualizarPerfil(formData).subscribe({
      next: () => {
        alert('Perfil actualizado');
        this.loadAvatars();
      },
      error: err => console.error('Error actualizando perfil', err)
    });
  }
}