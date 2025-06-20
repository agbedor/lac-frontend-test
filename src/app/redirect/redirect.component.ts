import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-redirect',
  imports: [],
  templateUrl: './redirect.component.html',
  styleUrl: './redirect.component.scss'
})
export class RedirectComponent {
  constructor(private router: Router) {
    const token = localStorage.getItem('access');
    if (token) {
      this.router.navigate(['/admin/dashboard']);
    } else {
      this.router.navigate(['/landing']);
    }
  }
}
