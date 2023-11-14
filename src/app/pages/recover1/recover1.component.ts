import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/services/login.service';
import { RegisterService } from 'src/app/services/register.service';
import { SpinnerService } from 'src/app/services/spinner.service';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-recover1',
  templateUrl: './recover1.component.html',
  styleUrls: ['./recover1.component.css']
})
export class Recover1Component implements OnInit {

  constructor(private router: Router,
    private formBuilder: FormBuilder,
    private userService: UserService,
    private loadingIndicatorService: SpinnerService) { }

  passwordForm!: FormGroup;

  ngOnInit(): void {
    this.passwordForm = this.initializeForm();
  }

  initializeForm(): FormGroup {
    return this.formBuilder.group({
      email: ['', [Validators.required, Validators.email, Validators.pattern( /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/)]]
    });
  }


  onSubmit() {
    this.loadingIndicatorService.showLoadingIndicator();
    this.userService.recoverPassword(this.passwordForm.value.email).subscribe(
      (data: any) => {
        localStorage.setItem('email', this.passwordForm.value.email);
        this.loadingIndicatorService.hideLoadingIndicator();
        Swal.fire({
          icon: 'info',
          title: 'Correo enviado',
          text: 'Se ha enviado un correo con el código de recuperación',
          showConfirmButton: true,
          confirmButtonText: 'Aceptar',
          confirmButtonColor: '#0096d2'
        })
        this.router.navigate(['/recover2']);
      }
    ), (error: any) => {
      this.loadingIndicatorService.hideLoadingIndicator();
      console.log('error ', error);
    }
  }
}
