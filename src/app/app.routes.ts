import { Routes } from '@angular/router';
import { CasesComponent } from './pages/admin-page/cases/cases.component';
import { AdminPageComponent } from './pages/admin-page/admin-page.component';
import { ApplicationsComponent } from './pages/admin-page/applications/applications.component';
import { AnalysisComponent } from './pages/admin-page/analysis/analysis.component';
import { UserComponent } from './pages/admin-page/user/user.component';
import { LandingComponent } from './pages/landing/landing.component';
import { authGuard } from './auth.guard';
import { RedirectComponent } from './redirect/redirect.component';
import { ActionsComponent } from './pages/admin-page/actions/actions.component';
import { DashboardComponent } from './pages/admin-page/dashboard/dashboard.component';

export const routes: Routes = [
  // {
  //   path: 'cases',
  //   component: CasesComponent,
  //   title: 'Cases Page',
  // },
  // {
  //   path: 'application-form',
  //   component: ApplicationFormComponent,
  //   title: 'Application Form Page',
  // },
  {
    path: '',
    component: RedirectComponent, // ✅ Dynamic redirect based on localStorage
    pathMatch: 'full',
  },
  {
    path: 'landing',
    component: LandingComponent,
    title: 'Landing Page',
  },

  {
    path: 'admin',
    component: AdminPageComponent,
    canActivate: [authGuard], // ✅ apply guard here
    title: 'Admin Page',
    children: [
      // { path: '', redirectTo: 'applications', pathMatch: 'full' }, // 👈 default child route
      { path: 'dashboard', component: DashboardComponent },
      { path: 'applications', component: ApplicationsComponent },
      { path: 'cases', component: CasesComponent },
      { path: 'actions', component: ActionsComponent },
      { path: 'analysis', component: AnalysisComponent },
      { path: 'users', component: UserComponent },
      // other children like bookings, user, etc.
    ],
  },
  // { path: '', redirectTo: 'landing', pathMatch: 'full' },
];
export default routes;
