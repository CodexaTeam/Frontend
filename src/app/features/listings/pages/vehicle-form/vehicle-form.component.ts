import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../iam/services/auth.service';
import { Vehicle } from '../../models/vehicle.model';
import { take } from 'rxjs';
import {VehicleService} from '../../services/vehicle.service';

@Component({
  selector: 'app-vehicle-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './vehicle-form.component.html',
  styleUrls: ['./vehicle-form.component.css']
})
export class VehicleFormComponent implements OnInit {
  vehicleForm: FormGroup;
  isEditMode = false;
  currentVehicleId: number | null = null;
  currentOwnerId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private vehicleService: VehicleService,
    private authService: AuthService
  ) {
    this.vehicleForm = this.fb.group({
      brand: ['', Validators.required],
      model: ['', Validators.required],
      year: ['', [Validators.required, Validators.min(2000)]],
      pricePerDay: ['', [Validators.required, Validators.min(1)]],
      imageUrl: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.authService.currentUser$.pipe(take(1)).subscribe(user => {
      if (user) this.currentOwnerId = user.id;
    });
  }

  onSubmit() {
    if (this.vehicleForm.invalid || this.currentOwnerId === null) return;

    const formValue = this.vehicleForm.value;

    const vehicleData = new Vehicle(
      Date.now(), // ID temporal
      formValue.brand,
      formValue.model,
      formValue.year,
      formValue.pricePerDay,
      'available',
      formValue.imageUrl,
      this.currentOwnerId
    );

    this.vehicleService.createVehicle(vehicleData).subscribe(() => {
      alert('¡Vehículo publicado con éxito!');
      this.router.navigate(['/my-vehicles']);
    });
  }
}
