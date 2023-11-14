import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ServiceService } from 'src/app/services/service.service';
import { SpinnerService } from 'src/app/services/spinner.service';

@Component({
  selector: 'app-add-service',
  templateUrl: './add-service.component.html',
  styleUrls: ['./add-service.component.css']
})
export class AddServiceComponent {
  serviceForm!: FormGroup;
  listServices!: any;

  constructor(
    private router: Router,
    private location: Location,
    private serviceService: ServiceService,
    private formBuilder: FormBuilder,
    private spinner: SpinnerService,
  ) { }

  ngOnInit(): void {
    this.serviceForm = this.initializeForm();
    this.getServices();
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
    this.serviceService.addService(this.serviceForm.value).subscribe(
      (res: any) => {
        this.spinner.hideLoadingIndicator();
        this.router.navigate(['/dashboard/services']);
      },
      err => {
        this.spinner.hideLoadingIndicator();
        console.log(err);
      }
    );
  }

  getServices() {
    this.spinner.showLoadingIndicator();
    this.serviceService.getServices().subscribe(
      (res: any) => {
        this.spinner.hideLoadingIndicator();
        this.listServices = res;
      },
      err => {
        this.spinner.hideLoadingIndicator();
        console.log(err);
      }
    );
  }

  goBack() {
    this.router.navigate(['dashboard/services']);
  }
  
}
