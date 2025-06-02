import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { AuthService } from 'app/core/services/auth.service';

@Component({
  selector: 'app-register',
  imports: [CommonModule, ReactiveFormsModule, MatIconModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  formReg: FormGroup;
  showPassword = false;
  loading = false;
  errorMessage: string = '';
  successMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.formReg = this.fb.group({
      username: [
        '',
        [Validators.required, Validators.pattern(/^(?![_.-])[a-zA-Z0-9._-]{3,20}(?<![_.-])$/)]
      ],
      name: ['', Validators.required],
      surname: ['', Validators.required],
      genero: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  register(): void {
    this.errorMessage = '';
    this.successMessage = '';
    if (this.formReg.invalid) {
      this.formReg.markAllAsTouched();
      return;
    }
    this.loading = true;
    this.authService.registerUser(this.formReg.value).subscribe({
      next: (resp) => {
        this.successMessage = '¡Registro completado! Redirigiendo al login...';
        localStorage.setItem('token', resp.token);
        this.router.navigate(['/home']);
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'No se pudo registrar. Intenta de nuevo.';
        this.loading = false;
      }
    });
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }
}
