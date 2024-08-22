
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/User';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    HttpClientModule,
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
    registerForm: FormGroup;
  
    constructor(
      private fb: FormBuilder, 
      private authService: AuthService, 
      private router: Router
    ) {
      this.registerForm = this.fb.group({
        username: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        password: ['', Validators.required]
      });
    }
  
    onSubmit() {
      if (this.registerForm.valid) {
        const user: User = {
          username: this.registerForm.value.username,
          email: this.registerForm.value.email,
          password: this.registerForm.value.password
        };
  
        this.authService.register(user).subscribe(
          response => {
            console.log('Registration successful', response);
            this.router.navigate(['/login']); 
          },
          error => {
            console.error('Registration error', error);
        
          }
        );
      }
    }
    navigateToLogin() {
        this.router.navigate(['/login']); 
      }
  }