import { RouterModule, Routes } from '@angular/router';
import { MainDashboardComponent } from './core/main-dashboard/main-dashboard.component';
import { NgModule } from '@angular/core';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { BusinessComponent } from './pages/business/business.component';
import { StaffComponent } from './pages/staff/staff.component';
import { ServicesComponent } from './pages/services/services.component';
import { AppointmentCalendarComponent } from './pages/appointment-calendar/appointment-calendar.component';
export const routes: Routes = [
  {
    path: '',
    component: MainDashboardComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        component: DashboardComponent,
      },
      {
        path: 'appontment-calendar',
        component: AppointmentCalendarComponent,
      },
      {
        path: 'business',
        component: BusinessComponent,
      },
      {
        path: 'staff',
        component: StaffComponent,
      },
      {
        path: 'services',
        component: ServicesComponent,
      },
    ]
  },
  { path: '**', redirectTo: 'dashboard' }, // Redirect to dashboard if route not found
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}