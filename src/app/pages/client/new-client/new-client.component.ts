import { Location } from '@angular/common';
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
  selector: 'app-new-client',
  templateUrl: './new-client.component.html',
  styleUrls: ['./new-client.component.css']
})
export class NewClientComponent implements OnInit {

  newclientForm!: FormGroup;
  usernameExists: boolean = false;
  emailExists: boolean = false;
  phoneExists: boolean = false;

  constructor(
    private router: Router,
    private location: Location,
    private formBuilder: FormBuilder,
    private userService: UserService,
    private loadingIndicatorService: SpinnerService
  ) { }

  keyPress(event: any) {
    const pattern = /[0-9\+\-\ ]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  ngOnInit(): void {
    this.newclientForm = this.initializeForm();
  }

  initializeForm(): FormGroup {
    return this.formBuilder.group({
      email: ['', [Validators.required, Validators.email, Validators.pattern(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/)]],
      phone: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]],
      username: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9áéíóúÁÉÍÓÚ\s]+$/), Validators.minLength(6)]],
      city: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9áéíóúÁÉÍÓÚ\s]+$/)]], // Corregido
      municipality: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9áéíóúÁÉÍÓÚ\s]+$/)]], // Corregido
      street: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9áéíóúÁÉÍÓÚ\s]+$/)]], // Corregido
    });
  }


  async onSubmit(): Promise<void> {
    const observables = [
      this.verifyUsernameExists(),
      this.verifyEmailExists(),
      this.verifyPhoneExists()
    ];

    forkJoin(observables).subscribe(results => {
      const [usernameExists, emailExists, phoneExists] = results;
      if (usernameExists) {
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: 'El usuario ya existe',
          showConfirmButton: false,
          timer: 2000
        });
      }
      if (emailExists) {
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: 'El correo ya existe',
          showConfirmButton: false,
          timer: 2000
        });
      }
      if (phoneExists) {
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: 'El teléfono ya existe',
          showConfirmButton: false,
          timer: 2000
        });
      }


      if (!usernameExists && !emailExists && !phoneExists) {
        this.loadingIndicatorService.showLoadingIndicator();
        this.userService.createClient(this.newclientForm.value).subscribe(
          (response: any) => {
            this.loadingIndicatorService.hideLoadingIndicator();
            Swal.fire({
              position: 'center',
              icon: 'success',
              title: 'Cliente agregado con éxito',
              showConfirmButton: false,
              timer: 3000
            });
            this.router.navigate(['/dashboard/client']);
          },
          (error: any) => {
            this.loadingIndicatorService.hideLoadingIndicator();
            console.log('error ', error);
            Swal.fire({
              position: 'center',
              icon: 'error',
              title: 'Error al agregar al cliente',
              showConfirmButton: false,
              timer: 2000
            });
          });
      }
    }
    );
  }


  verifyUsernameExists(): Observable<boolean> {
    return this.userService.getUserByUsername(this.newclientForm.value.username).pipe(
      map(response => {
        console.log('username ' + response);
        return response != null;
      }),
      catchError(error => {
        console.log('error ', error);
        return of(false);
      })
    );
  }

  verifyEmailExists(): Observable<boolean> {
    return this.userService.getUserByEmail(this.newclientForm.value.email).pipe(
      map(response => {
        console.log('email ' + response);
        return response != null;
      }),
      catchError(error => {
        console.log('error ', error);
        return of(false);
      })
    );
  }

  verifyPhoneExists(): Observable<boolean> {
    return this.userService.getUserByPhone(this.newclientForm.value.phone).pipe(
      map(response => {
        console.log('phone ' + response);
        return response != null;
      }),
      catchError(error => {
        console.log('error ', error);
        return of(false);
      })
    );
  }

  goBack() {
    this.router.navigate(['dashboard/client']);
  }
}

