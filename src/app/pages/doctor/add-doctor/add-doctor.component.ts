import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DoctorService } from 'src/app/services/doctor.service';
import { PetService } from 'src/app/services/pet.service';
import { SpinnerService } from 'src/app/services/spinner.service';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-doctor',
  templateUrl: './add-doctor.component.html',
  styleUrls: ['./add-doctor.component.css']
})
export class AddDoctorComponent {
  doctorForm!: FormGroup;
  listDoctors!: any;

  constructor(
    private router: Router,
    private location: Location,
    private formBuilder: FormBuilder,
    private spinner: SpinnerService,
    private doctorService: DoctorService
  ) { }

  ngOnInit(): void {
    this.doctorForm = this.initializeForm();
    this.getDoctors();
  }

  initializeForm(): FormGroup {
    return this.formBuilder.group({
      name: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9áéíóúÁÉÍÓÚ\s]+$/)]],
      lastname: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9áéíóúÁÉÍÓÚ\s]+$/)]],
      email: ['', [Validators.required, Validators.email, Validators.pattern( /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/)]],
      phone: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]],
      status: ['', [Validators.required]]
    });
  }

  keyPress(event: any) {
    const pattern = /[0-9\+\-\ ]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  onSubmit() {
    this.spinner.showLoadingIndicator();
    this.doctorService.createDoctor(this.doctorForm.value).subscribe((data) => {
      this.spinner.hideLoadingIndicator();
      Swal.fire({
        icon: 'success',
        title: 'Doctor creado con éxito',
        showConfirmButton: false,
        timer: 1500
      });
      this.router.navigate(['dashboard/doctors']);
    }
    );
  }

  getDoctors() {
    this.spinner.showLoadingIndicator();
    this.doctorService.getDoctors().subscribe((data) => {
      this.spinner.hideLoadingIndicator();
      this.listDoctors = data;
    });
  }

  goBack() {
    this.router.navigate(['dashboard/doctors']);
  }
  
}
