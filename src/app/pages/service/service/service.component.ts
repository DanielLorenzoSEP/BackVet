import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { DoctorService } from 'src/app/services/doctor.service';
import { ServiceService } from 'src/app/services/service.service';
import { SpinnerService } from 'src/app/services/spinner.service';
import Swal from 'sweetalert2';

interface Service {
  id: number;
  name: string;
  description: string;
  price: number;
  duration: number;
}

@Component({
  selector: 'app-service',
  templateUrl: './service.component.html',
  styleUrls: ['./service.component.css']
})
export class ServiceComponent {
  serviceForm!: FormGroup;
  service: Service = {} as Service;
  id!: number;
  listServices!: any;

  constructor(
    private formBuilder: FormBuilder,
    private serviceService: ServiceService,
    private spinner: SpinnerService,
    private doctorService: DoctorService,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    console.log(data);
  }

  ngOnInit(): void {
    this.serviceForm = this.initializeForm();
    if (this.data.serviceId) {
      this.getServiceById(this.data.serviceId);
      this.id = this.data.serviceId;
    }
  }


  keyPress(event: any) {
    const pattern = /[0-9\.\ ]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  initializeForm(): FormGroup {
    return this.formBuilder.group({
      name: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9áéíóúÁÉÍÓÚ\s()]+$/)]],
      description: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9áéíóúÁÉÍÓÚ\s().,]+$/)]],
      price: ['', [Validators.required]],
      duration: ['', [Validators.required]]
    });
  }

  onSubmit() {
    this.spinner.showLoadingIndicator();
    this.service.id = this.id;
    this.service.name = this.serviceForm.value.name;
    this.service.description = this.serviceForm.value.description;
    this.service.price = this.serviceForm.value.price;
    this.service.duration = this.serviceForm.value.duration;
    console.log(this.service);
    this.serviceService.updateService(this.service).subscribe(
      (res: any) => {
        this.spinner.hideLoadingIndicator();
        this.dialog.closeAll();
        Swal.fire({
          icon: 'success',
          title: 'Servicio actualizado correctamente',
          showConfirmButton: false,
          timer: 1500
        });
      },
      err => {
        this.spinner.hideLoadingIndicator();
        console.log(err);
      }
    );
  }

  getServiceById(id: any) {
    this.spinner.showLoadingIndicator();
    this.serviceService.getServiceById(id).subscribe(
      (res: any) => {
        this.spinner.hideLoadingIndicator();
        this.service = res;
        this.serviceForm = this.initializeForm();
        this.serviceForm.patchValue({
          name: this.service.name,
          description: this.service.description,
          price: this.service.price,
          duration: this.service.duration
        });
        console.log(this.service);
      },
      err => {
        this.spinner.hideLoadingIndicator();
        console.log(err);
      }
    );
  }

  onCancelClick() {
    this.dialog.closeAll();
  }

}
