import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SpinnerService } from 'src/app/services/spinner.service';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-recover3',
  templateUrl: './recover3.component.html',
  styleUrls: ['./recover3.component.css']
})
export class Recover3Component implements OnInit {

  passwordForm!: FormGroup;
  matchPasswordError = false;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private userService: UserService,
    private loadingIndicatorService: SpinnerService
  ) { }

  ngOnInit(): void {
    if (localStorage.getItem('email') === null) {
      this.router.navigate(['/login']);
    }
    this.passwordForm = this.initializeForm();
  }

  initializeForm(): FormGroup {
    return this.formBuilder.group({
      password: ['', [Validators.required, Validators.pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/), Validators.minLength(8)]],
      confirmPassword: ['', Validators.required]
    });
  }

  matchPassword(): boolean {
    this.matchPasswordError = this.passwordForm.value.password !== this.passwordForm.value.confirmPassword;
    return this.matchPasswordError;
  }

  onSubmit() {
    this.loadingIndicatorService.showLoadingIndicator();
    if (this.matchPassword()) {
      this.loadingIndicatorService.hideLoadingIndicator();
      Swal.fire({
        icon: 'warning',
        text: 'Las contraseñas no coinciden',
        showConfirmButton: true
      });
    } else {
      this.userService.changePassword(localStorage.getItem('email')!, this.passwordForm.value.password).subscribe(
        (response: any) => {
          this.loadingIndicatorService.hideLoadingIndicator();
          Swal.fire({
            icon: 'success',
            text: 'Contraseña actualizada correctamente',
            showConfirmButton: true
          });
          localStorage.removeItem('email');
          this.router.navigate(['/login']);
        }),
        (error: any) => {
          this.loadingIndicatorService.hideLoadingIndicator();
          Swal.fire({
            icon: 'error',
            text: 'Ha ocurrido un error al cambiar la contraseña',
            showConfirmButton: true
          });
        }
    }
  }
}
