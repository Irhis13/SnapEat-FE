import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
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
    email: '',
    username: '',
    profileImage: null,
    name: '',
    surname: '',
    genero: ''
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

  showPassword: boolean = false;
  showConfirmPassword: boolean = false;
  nuevaPassword = '';
  confirmarPassword = '';
  mostrarCambioPassword = false;
  passwordsIguales = true;
  defaultAvatar = 'assets/avatars/avatar2.png';
  usernameDisponible: boolean | null = null;
  verificandoUsername = false;
  usernameValido = true;
  originalUsername: string = '';
  mostrarModalExito = false;
  mostrarModalError = false;

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.loadAvatars();
    this.userService.getPerfil().subscribe({
      next: (user: any) => {
        this.usuario = {
          email: user.email,
          username: user.username,
          profileImage: user.profileImage,
          name: user.name,
          surname: user.surname,
          genero: user.genero
        };
        this.originalUsername = user.username;
        this.fotoUrl = user.profileImage || this.defaultAvatar;
      }
    });
  }

  onUsernameChange(): void {
    const username = this.usuario.username?.trim();

    const formatoValido = /^(?![_.-])[a-zA-Z0-9._-]{3,20}(?<![_.-])$/.test(username);
    this.usernameValido = formatoValido;

    if (!username) {
      this.usernameDisponible = null;
      return;
    }

    if (username === this.originalUsername) {
      this.usernameDisponible = true;
      return;
    }

    this.verificandoUsername = true;
    this.userService.checkUsernameDisponible(username).subscribe({
      next: disponible => {
        this.usernameDisponible = disponible;
        this.verificandoUsername = false;
      },
      error: err => {
        console.error('Error verificando disponibilidad de username', err);
        this.verificandoUsername = false;
        this.usernameDisponible = null;
      }
    });
  }

  private buildPerfilBlob(extra?: any): Blob {
    return new Blob(
      [JSON.stringify({
        username: this.usuario.username,
        name: this.usuario.name,
        surname: this.usuario.surname,
        genero: this.usuario.genero,
        ...extra
      })],
      { type: 'application/json' }
    );
  }

  onFotoSeleccionada(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.selectedImage = input.files[0];

      const reader = new FileReader();
      reader.onload = () => {
        this.fotoUrl = reader.result;

        const formData = new FormData();
        formData.append('perfil', this.buildPerfilBlob());
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
    formData.append('perfil', this.buildPerfilBlob({ imageUrl: avatar }));

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

  onPasswordChange(): void {
    this.passwordsIguales = this.nuevaPassword === this.confirmarPassword;
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  togglePasswordChange(): void {
    this.mostrarCambioPassword = !this.mostrarCambioPassword;
    if (!this.mostrarCambioPassword) {
      this.nuevaPassword = '';
      this.confirmarPassword = '';
      this.passwordsIguales = true;
    }
  }

  guardarCambios(): void {
    if (this.mostrarCambioPassword && (!this.nuevaPassword || !this.confirmarPassword || !this.passwordsIguales)) {
      alert('Debes introducir y confirmar la nueva contraseña, y deben coincidir.');
      return;
    }

    if (this.usernameDisponible === false) {
      alert('El nombre de usuario no está disponible.');
      return;
    }

    if (!this.usernameValido) {
      alert('El nombre de usuario no tiene un formato válido.');
      return;
    }

    const formData = new FormData();
    const extra = {
      ...(this.mostrarCambioPassword && this.nuevaPassword ? { password: this.nuevaPassword } : {}),
      imageUrl: typeof this.fotoUrl === 'string' && !this.selectedImage ? this.fotoUrl : undefined
    };

    formData.append('perfil', this.buildPerfilBlob(extra));
    if (this.selectedImage) {
      formData.append('imagen', this.selectedImage);
    }

    this.userService.actualizarPerfil(formData).subscribe({
      next: () => {
        this.mostrarModalExito = true;
        this.mostrarModalError = false;
        this.loadAvatars();
        setTimeout(() => this.mostrarModalExito = false, 2000);
      },
      error: err => {
        this.mostrarModalError = true;
        this.mostrarModalExito = false;
        setTimeout(() => this.mostrarModalError = false, 2200);
      }
    });
  }
}