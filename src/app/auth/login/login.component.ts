import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  imports: [CommonModule, ReactiveFormsModule]
})
export class LoginComponent {
  formLogin: FormGroup;
  errorMessage: string | null = null;
  showPassword: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.formLogin = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    if (this.formLogin.invalid) return;

    const credentials = this.formLogin.value;
    const queryRedirect = this.route.snapshot.queryParamMap.get('redirectTo');
    const redirectTo = queryRedirect || localStorage.getItem('redirectTo') || '/';

    this.authService.login(credentials).subscribe({
      next: (res: { token: string }) => {
        localStorage.setItem('token', res.token);
        localStorage.removeItem('redirectTo');
        this.router.navigate([redirectTo]);
      },
      error: () => {
        this.errorMessage = 'Usuario o contraseña inválidos';
      }
    });
  }

  goToRegister(): void {
    this.router.navigate(['/register']);
  }
}
