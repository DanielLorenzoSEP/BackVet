import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, catchError, forkJoin, map, of } from 'rxjs';
import { LoginService } from 'src/app/services/login.service';
import { RegisterService } from 'src/app/services/register.service';
import { SpinnerService } from 'src/app/services/spinner.service';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register-step1',
  templateUrl: './register-step1.component.html',
  styleUrls: ['./register-step1.component.css']
})
export class RegisterStep1Component implements OnInit {

  loginForm!: FormGroup;
  usernameExists: boolean = false;
  emailExists: boolean = false;
  phoneExists: boolean = false;

  constructor(private userService: UserService,
    private loginService: LoginService,
    private router: Router,
    private formBuilder: FormBuilder,
    private registerService: RegisterService,
    private loadingIndicatorService: SpinnerService) { }

  ngOnInit(): void {
    this.loginForm = this.initializeForm();
    localStorage.clear();
  }

  initializeForm(): FormGroup {
    return this.formBuilder.group({
      email: ['', [Validators.required, Validators.email, Validators.pattern( /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/)]],
      phone: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]],
      username: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9áéíóúÁÉÍÓÚ\s]+$/), Validators.minLength(6)]],
      password: ['', [Validators.required, Validators.pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/), Validators.minLength(8)]],
      city: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9áéíóúÁÉÍÓÚ\s]+$/)]],
      municipality: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9áéíóúÁÉÍÓÚ\s]+$/)]],
      street: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9áéíóúÁÉÍÓÚ\s]+$/)]],
    });
  }

  async onSubmit(): Promise<void> {
    this.loadingIndicatorService.showLoadingIndicator();
    const observables = [
      this.verifyUsernameExists(),
      this.verifyEmailExists(),
      this.verifyPhoneExists()
    ];

    forkJoin(observables).subscribe(results => {
      const [usernameExists, emailExists, phoneExists] = results;
      if (usernameExists) {
        this.loadingIndicatorService.hideLoadingIndicator();
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: 'El usuario ya existe',
          showConfirmButton: false,
          timer: 2000
        });
      }
      if (emailExists) {
        this.loadingIndicatorService.hideLoadingIndicator();
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: 'El correo ya existe',
          showConfirmButton: false,
          timer: 2000
        });
      }
      if (phoneExists) {
        this.loadingIndicatorService.hideLoadingIndicator();
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: 'El teléfono ya existe',
          showConfirmButton: false,
          timer: 2000
        });
      }
      if (!usernameExists && !emailExists && !phoneExists) {
        this.registerService.createUser(this.loginForm.value).subscribe(
          (response: any) => {
            this.loadingIndicatorService.hideLoadingIndicator();
            Swal.fire({
              position: 'center',
              icon: 'info',
              title: 'Se ha enviado un código de confirmación',
              showConfirmButton: false,
              timer: 3000
            });
            localStorage.setItem('email', this.loginForm.value.email);
            this.router.navigate(['/registro2']);
          },
          (error: any) => {
            this.loadingIndicatorService.hideLoadingIndicator();
            console.log('error ', error);
            Swal.fire({
              position: 'center',
              icon: 'error',
              title: 'Error al crear el usuario',
              showConfirmButton: false,
              timer: 2000
            });
          });
      }
    });

  }

  verifyUsernameExists(): Observable<boolean> {
    return this.loginService.usernameExists(this.loginForm.value.username).pipe(
      map((response: any) => {
        console.log('username ' + response.value);
        if (response.value) {
          return true;
        } else {
          return false;
        }
      }),
      catchError(error => {
        console.log('error ', error);
        return of(false);
      })
    );
  }

  verifyEmailExists(): Observable<boolean> {
    return this.loginService.emailExists(this.loginForm.value.email).pipe(
      map((response: any) => {
        console.log('email ' + response.value);
        if (response.value) {
          return true;
        } else {
          return false;
        }
      }),
      catchError(error => {
        console.log('error ', error);
        return of(false);
      })
    );
  }

  verifyPhoneExists(): Observable<boolean> {
    return this.loginService.phoneExists(this.loginForm.value.phone).pipe(
      map((response: any) => {
        console.log('phone ' + response.value);
        if (response.value) {
          return true;
        } else {
          return false;
        }
      }),
      catchError(error => {
        console.log('error ', error);
        return of(false);
      })
    );
  }
}

