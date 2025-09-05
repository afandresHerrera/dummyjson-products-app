import { Component, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ButtonModule, InputTextModule, PasswordModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  loginForm: FormGroup;
  submitted = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', Validators.required],
    });

  }

  onSubmit(): void {
    this.submitted = true;

    if (this.loginForm.valid) {
      const { username, password } = this.loginForm.value;

      this.authService.login(username!, password!).subscribe({
        next: (user) => {
          if (user) {
            this.router.navigate(['dashboard']);
          } else {
            alert('⚠️ No se pudo iniciar sesión correctamente');
          }
        },
        error: () => alert('❌ Credenciales inválidas'),
      });
    }
  }

}
