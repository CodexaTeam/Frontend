import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../iam/services/auth.service';
import { Vehicle } from '../../models/vehicle.model';
import { take } from 'rxjs';
import {VehicleService} from '../../services/vehicle.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-vehicle-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslateModule],
  templateUrl: './vehicle-form.component.html',
  styleUrls: ['./vehicle-form.component.css']
})
export class VehicleFormComponent implements OnInit {
  vehicleForm: FormGroup;
  isEditMode = false;
  currentVehicleId: number | null = null;
  currentOwnerId: number | null = null;
  imagePreview: string | ArrayBuffer | null = null;

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

    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.currentVehicleId = +params['id'];
        this.vehicleService.getVehicle(this.currentVehicleId).subscribe(vehicle => {
          this.vehicleForm.patchValue(vehicle);
          this.imagePreview = vehicle.imageUrl;
        });
      }
    });
  }

  onFileChange(event: any) {
    const reader = new FileReader();
    if (event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.imagePreview = reader.result;
        this.vehicleForm.patchValue({
          imageUrl: reader.result
        });
      };
    }
  }

  onSubmit() {
    if (this.vehicleForm.invalid) return;

    const formValue = this.vehicleForm.value;

    if (this.isEditMode && this.currentVehicleId) {
      const updatedVehicle = new Vehicle(
        this.currentVehicleId,
        formValue.brand,
        formValue.model,
        formValue.year,
        formValue.pricePerDay,
        'available',
        formValue.imageUrl,
        this.currentOwnerId!
      );
      this.vehicleService.updateVehicle(updatedVehicle).subscribe(() => {
        alert('¡Vehículo actualizado con éxito!');
        this.router.navigate(['/my-vehicles']);
      });
    } else {
      const vehicleData = new Vehicle(
        Date.now(), // Temporal ID
        formValue.brand,
        formValue.model,
        formValue.year,
        formValue.pricePerDay,
        'available',
        formValue.imageUrl,
        this.currentOwnerId!
      );
      this.vehicleService.createVehicle(vehicleData).subscribe(() => {
        alert('¡Vehículo publicado con éxito!');
        this.router.navigate(['/my-vehicles']);
      });
    }
  }
}
