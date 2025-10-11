import { Routes } from '@angular/router';
import { MainLayoutComponent } from './shared/components/main-layout/main-layout.component';
import { VehicleListComponent } from './features/listings/pages/vehicle-list/vehicle-list.component';
import { VehicleDetailComponent } from './features/listings/pages/vehicle-detail/vehicle-detail.component';
import { MyBookingsComponent } from './features/booking/pages/my-bookings/my-bookings.component';
import { LoginComponent } from './features/iam/pages/login/login.component';
import { RegisterComponent } from './features/iam/pages/register/register.component';
import { MyVehiclesComponent } from './features/listings/pages/my-vehicles/my-vehicles.component';
import { TrackingComponent } from './features/iot/pages/tracking/tracking.component';
import { BookingProcessComponent } from './features/booking/pages/booking-process/booking-process.component';
import { VehicleFormComponent } from './features/listings/pages/vehicle-form/vehicle-form.component';
import { BookingRequestsComponent } from './features/booking/pages/booking-requests/booking-requests.component';
import { ProfileComponent } from './features/iam/pages/profile/profile.component';
import { authGuard } from './core/guards/auth.guard';
import { BookingDetailComponent } from './features/booking/pages/booking-detail/booking-detail.component';
import { DashboardArrendatarioComponent } from './features/iam/pages/dashboard-arrendatario/dashboard-arrendatario.component';

/**
 * @const routes
 * @description Defines the application's routes. It includes public routes for login and registration,
 * and protected routes under the MainLayoutComponent that require authentication via the authGuard.
 */
export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardArrendatarioComponent },
      { path: 'vehicles', component: VehicleListComponent },
      { path: 'vehicles/:id', component: VehicleDetailComponent },
      { path: 'booking/:vehicleId', component: BookingProcessComponent },
      { path: 'my-bookings', component: MyBookingsComponent },
      { path: 'my-bookings/:id', component: BookingDetailComponent },
      { path: 'my-vehicles', component: MyVehiclesComponent },
      { path: 'publish-vehicle', component: VehicleFormComponent },
      { path: 'edit-vehicle/:id', component: VehicleFormComponent }, // Nueva ruta
      { path: 'booking-requests', component: BookingRequestsComponent },
      { path: 'profile', component: ProfileComponent },
      { path: 'tracking/:id', component: TrackingComponent },
    ]
  },
  { path: '**', redirectTo: '' }
];
