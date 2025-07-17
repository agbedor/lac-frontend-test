import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { MatBadgeModule } from '@angular/material/badge';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { UserService } from '../../services/user.service';
import { ApplicationService } from '../../services/application.service';
import { CaseService } from '../../services/case.service';
import { ActionService } from '../../services/action.service';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-admin-page',
  standalone: true,
  imports: [RouterModule, MatBadgeModule, MatButtonModule, MatIconModule,MatDividerModule],
  templateUrl: './admin-page.component.html',
  styleUrl: './admin-page.component.scss',
})
export class AdminPageComponent {
  private router = inject(Router);
  private userService = inject(UserService);
  private caseService = inject(CaseService);
  private actionService = inject(ActionService);
  private applicationService = inject(ApplicationService); // 👈 Injected
  username: string = '';
  applicationCount = this.applicationService.applicantCount;
  // userCount: 2;p
  caseCount = this.caseService.caseCount;
  actionCount = this.actionService.actionCount;

  ngOnInit() {
    // Access localStorage AFTER component initializes
    this.username = localStorage.getItem('username') || '';
    this.applicationService.loadApplicantCount(); // 👈 Load the initial count
    this.actionService.loadActionCount();
    this.caseService.loadCaseCount();
  }
  signOut() {
    // Call signOut method from UserService
    this.userService.signOut();
    // Redirect to the landing page after sign-out
    this.router.navigate(['/landing']);
  }
}
