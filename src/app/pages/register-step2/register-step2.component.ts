import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RegisterService } from 'src/app/services/register.service';
import { SpinnerService } from 'src/app/services/spinner.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register-step2',
  templateUrl: './register-step2.component.html',
  styleUrls: ['./register-step2.component.css']
})
export class RegisterStep2Component implements OnInit {

  constructor(private formBuilder: FormBuilder,
    private router: Router,
    private registerService: RegisterService,
    private loadingIndicatorService: SpinnerService) { }

  tokenForm!: FormGroup;

  ngOnInit(): void {
    if (localStorage.getItem('token') != null) {
      localStorage.removeItem('token');
    }
    if (localStorage.getItem('email') === null) {
      this.router.navigate(['/login']);
    }
    this.tokenForm = this.initializeForm();
  }

  initializeForm(): FormGroup {
    return this.formBuilder.group({
      token: ['', [Validators.required, Validators.pattern(/^[0-9]+$/), Validators.minLength(8), Validators.maxLength(8)]],
    });
  }

  onSubmit() {
    this.loadingIndicatorService.showLoadingIndicator();
    let user = {
      email: localStorage.getItem('email'),
      code: this.tokenForm.value.token
    }
    this.registerService.validate(user).subscribe(
      (response: any) => {
        this.loadingIndicatorService.hideLoadingIndicator();
        if (response) {
          localStorage.removeItem('email');
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Registro exitoso',
            showConfirmButton: false,
            timer: 2000
          });
          this.router.navigate(['/login']);
        } else {
          Swal.fire({
            position: 'center',
            icon: 'error',
            title: 'Código incorrecto',
            showConfirmButton: false,
            timer: 2000
          });
        }
      },
      (error: any) => {
        this.loadingIndicatorService.hideLoadingIndicator();
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: 'Código incorrecto',
          showConfirmButton: false,
          timer: 2000
        });
      }
    );
  }
}
