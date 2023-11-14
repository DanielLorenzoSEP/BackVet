import { Location } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { DoctorService } from 'src/app/services/doctor.service';
import { MedicineService } from 'src/app/services/medicine.service';
import { SpinnerService } from 'src/app/services/spinner.service';
import Swal from 'sweetalert2';

interface Medicine {
  id: number;
  name: string;
  description: string;
  fabricator: string;
  type: string;
}

@Component({
  selector: 'app-medicine',
  templateUrl: './medicine.component.html',
  styleUrls: ['./medicine.component.css']
})
export class MedicineComponent {
  medicineForm!: FormGroup;
  medicine: Medicine = {} as Medicine;
  id!: number;

  constructor(
    private location: Location,
    private formBuilder: FormBuilder,
    private spinner: SpinnerService,
    private dialog: MatDialog,
    private medicineService: MedicineService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    console.log(data);
  }

  ngOnInit(): void {
    this.medicineForm = this.initializeForm();
    if (this.data.medicineId) {
      this.getMedicineById(this.data.medicineId);
      this.id = this.data.medicineId;
    } 
  }

  initializeForm(): FormGroup {
    return this.formBuilder.group({
      name: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9áéíóúÁÉÍÓÚ\s()]+$/)]],
      description: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9áéíóúÁÉÍÓÚ\s().,]+$/)]],
      fabricator: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9áéíóúÁÉÍÓÚ\s()]+$/)]],
      type: ['', [Validators.required]]
    });
  }

  onSubmit() {
    this.spinner.showLoadingIndicator();
    this.medicine.id = this.id;
    this.medicine.name = this.medicineForm.value.name;
    this.medicine.description = this.medicineForm.value.description;
    this.medicine.fabricator = this.medicineForm.value.fabricator;
    this.medicine.type = this.medicineForm.value.type;
    console.log(this.medicine);
    this.medicineService.updateMedicine(this.medicine).subscribe(
      (res: any) => {
        this.spinner.hideLoadingIndicator();
        Swal.fire({
          icon: 'success',
          title: 'Médico actualizado con éxito',
          showConfirmButton: false,
          timer: 1500
        });
        this.dialog.closeAll();
      }
    );
  }

  getMedicineById(id: any) {
    this.spinner.showLoadingIndicator();
    this.medicineService.getMedicineById(id).subscribe(
      (res: any) => {
        this.spinner.hideLoadingIndicator();
        this.medicineForm.patchValue(res);
      },
      (err: any) => {
        this.spinner.hideLoadingIndicator();
        console.log(err);
      }
    );
  }

  onCancelClick() {
    this.dialog.closeAll();
  }
    
}
