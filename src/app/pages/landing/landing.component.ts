import { Component, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { CommonModule } from '@angular/common';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
    MatIconModule,
    MatCardModule,
    CommonModule,
    MatProgressBarModule,
    MatSnackBarModule,
  ],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.scss',
})
export class LandingComponent {
  username: string = '';
  password: string = '';
  error: string = '';
  loading = false;
  private snackBar = inject(MatSnackBar);
  private router = inject(Router);
  private userService = inject(UserService);

  onSubmit() {
    this.loading = true;
    this.userService.signIn(this.username, this.password).subscribe({
      next: (response) => {
        localStorage.setItem('access', response.access);
        localStorage.setItem('refresh', response.refresh);
        localStorage.setItem('username', response.user.username);
        localStorage.setItem('id', response.user.id.toString());
        localStorage.setItem('group', response.user.group);  // ✅ Add group here
        this.snackBar.open('signin successful!', '', {
          duration: 3000, // 3 seconds
          panelClass: ['success-snackbar'], // Optional custom class
        });
        this.router.navigate(['/admin/dashboard']);
      },
      error: () => {
        this.error = 'Invalid username or password';
        this.snackBar.open('sign in failed. Please try again.', '', {
          duration: 3000,
          panelClass: ['error-snackbar'],
        });
      },
    });
  }
}
