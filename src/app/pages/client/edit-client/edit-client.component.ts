import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Observable, catchError, forkJoin, map, of } from 'rxjs';
import { SpinnerService } from 'src/app/services/spinner.service';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-edit-client',
  templateUrl: './edit-client.component.html',
  styleUrls: ['./edit-client.component.css']
})
export class EditClientComponent implements OnInit {

  editClientForm!: FormGroup;
  usernameExists: boolean = false;
  emailExists: boolean = false;
  phoneExists: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<EditClientComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private router: Router,
    private formBuilder: FormBuilder,
    private userService: UserService,
    private spinner: SpinnerService
  ) { }

  keyPress(event: any) {
    const pattern = /[0-9\+\-\ ]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  ngOnInit(): void {
    this.spinner.showLoadingIndicator();
    this.editClientForm = this.initializeForm();
    this.getClientById();
    console.log('data ', this.data.user.username);
  }

  getClientById(): void {
    this.userService.getUserByUsername(this.data.user.username).subscribe(
      (response: any) => {
        console.log('response ', response);
        this.editClientForm.patchValue(response);
        response.address = response.address.split('  ', 3);
        this.editClientForm.patchValue({
          city: response.address[0],
          municipality: response.address[1],
          street: response.address[2]
        });
        this.spinner.hideLoadingIndicator();
      },
      (error: any) => {
        this.spinner.hideLoadingIndicator();
        console.log('error ', error);
      }
    );
  }

  onCancelClick(): void {
    this.dialogRef.close();
  }

  initializeForm(): FormGroup {
    return this.formBuilder.group({
      email: ['Cargando...', [Validators.required, Validators.email, Validators.pattern( /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/)]],
      phone: ['Cargando...', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]],
      username: ['Cargando...', [Validators.required, Validators.pattern(/^[a-zA-Z0-9áéíóúÁÉÍÓÚ\s]+$/), Validators.minLength(6)]],
      city: ['Cargando...', [Validators.required, Validators.pattern(/^[a-zA-Z0-9áéíóúÁÉÍÓÚ\s]+$/)]],
      municipality: ['Cargando...', [Validators.required, Validators.pattern(/^[a-zA-Z0-9áéíóúÁÉÍÓÚ\s]+$/)]],
      street: ['Cargando...', [Validators.required, Validators.pattern(/^[a-zA-Z0-9áéíóúÁÉÍÓÚ\s]+$/)]],
    });
  }

  async onSubmit(): Promise<void> {
    const observables = [
      this.verifyUsernameExists(),
      this.verifyEmailExists(),
      this.verifyPhoneExists()
    ];

    let obs: boolean = false;

    forkJoin(observables).subscribe(results => {
      const [usernameExists, emailExists, phoneExists] = results;
      if (usernameExists && this.editClientForm.value.username != this.data.user.username) {
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: 'El usuario ya existe',
          showConfirmButton: false,
          timer: 2000
        });
        obs = true;
      }
      if (emailExists && this.editClientForm.value.email != this.data.user.email) {
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: 'El correo ya existe',
          showConfirmButton: false,
          timer: 2000
        });
        obs = true;
      }
      if (phoneExists && this.editClientForm.value.phone != this.data.user.phone) {
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: 'El teléfono ya existe',
          showConfirmButton: false,
          timer: 2000
        });
        obs = true;
      }


      if (!obs) {
        console.log('editClientForm ', this.editClientForm.value);
        this.spinner.showLoadingIndicator();
        let userToEdit = {
          id: this.data.user.id,
          username: this.editClientForm.value.username,
          email: this.editClientForm.value.email,
          phone: this.editClientForm.value.phone,
          address: this.editClientForm.value.city + '  ' + this.editClientForm.value.municipality + '  ' + this.editClientForm.value.street,
        }
        console.log(userToEdit);
        this.userService.updateUser(userToEdit).subscribe(
          (res: any) => {
            this.spinner.hideLoadingIndicator();
            console.log(res);
            Swal.fire({
              icon: 'success',
              title: 'Cambios guardados',
              showConfirmButton: false,
              timer: 1000
            })
            this.dialogRef.close();
            this.router.navigate([`/dashboard/indClient/${userToEdit.username}`]);
          }
        ), (err: any) => {
          this.spinner.hideLoadingIndicator();
          console.log('error al actualizar el usuario');
          Swal.fire({
            icon: 'error',
            text: 'No se pudieron guardar los cambios',
          })
        }
      }
    }
    );
  }


  verifyUsernameExists(): Observable<boolean> {
    return this.userService.getUserByUsername(this.editClientForm.value.username).pipe(
      map(response => {
        return response != null;
      }),
      catchError(error => {
        console.log('error ', error);
        return of(false);
      })
    );
  }

  verifyEmailExists(): Observable<boolean> {
    return this.userService.getUserByEmail(this.editClientForm.value.email).pipe(
      map(response => {
        return response != null;
      }),
      catchError(error => {
        console.log('error ', error);
        return of(false);
      })
    );
  }

  verifyPhoneExists(): Observable<boolean> {
    return this.userService.getUserByPhone(this.editClientForm.value.phone).pipe(
      map(response => {
        return response != null;
      }),
      catchError(error => {
        console.log('error ', error);
        return of(false);
      })
    );
  }

}
