import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { PetService } from 'src/app/services/pet.service';
import { SpinnerService } from 'src/app/services/spinner.service';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-edit-pet',
  templateUrl: './edit-pet.component.html',
  styleUrls: ['./edit-pet.component.css']
})
export class EditPetComponent {
  editPetForm!: FormGroup;
  listClients!: any;
  user!: any;

  today = new Date();
  day = this.today.getDate();
  month = this.today.getMonth() + 1; // Recuerda que los meses son base 0 en JavaScript
  year = this.today.getFullYear();



  date: string = `${this.year}-${this.month.toString().padStart(2, '0')}-${this.day.toString().padStart(2, '0')}`;

  constructor(
    public dialogRef: MatDialogRef<EditPetComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private router: Router,
    private formBuilder: FormBuilder,
    private userService: UserService,
    private petService: PetService,
    private spinner: SpinnerService
  ) { }

  keyPress(event: any) {
    const pattern = /[0-9\.\ ]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  ngOnInit(): void {
    this.editPetForm = this.initializeForm();
    this.getUserByPetId();
    this.getClients();
    this.editPetForm.patchValue({
      name: this.data.pet.name,
      race: this.data.pet.race,
      specie: this.data.pet.specie,
      sex: this.data.pet.sex,
      birthdate: this.data.pet.birthdate.split('-').reverse().join('-'),
      weight: this.data.pet.weight,
      user: this.data.user.id
    });
    console.log(this.data.user);
  }

  initializeForm(): FormGroup {
    return this.formBuilder.group({
      name: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s]+$/)]],
      race: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s]+$/)]],
      specie: ['', [Validators.required]],
      sex: ['', [Validators.required]],
      birthdate: ['', [Validators.required]],
      weight: ['', [Validators.required]],
      user: ['', [Validators.required]],
    });
  }

  onSubmit() {
    this.spinner.showLoadingIndicator();
    let pet = {
      id: this.data.pet.id,
      name: this.editPetForm.value.name,
      race: this.editPetForm.value.race,
      specie: this.editPetForm.value.specie,
      sex: this.editPetForm.value.sex,
      birthdate: this.editPetForm.value.birthdate.split('-').reverse().join('-'),
      weight: this.editPetForm.value.weight,
      user: { id: this.editPetForm.value.user }
    }
    console.log(pet);
    this.petService.updatePet(pet).subscribe(
      (res: any) => {
        this.spinner.hideLoadingIndicator();
        Swal.fire({
          icon: 'success',
          title: 'Mascota actualizada',
          showConfirmButton: false,
          timer: 1500
        });
        this.dialogRef.close();
      },
      (err: any) => {
        this.spinner.hideLoadingIndicator();
        Swal.fire({
          icon: 'error',
          title: 'No se pudo actualizar la mascota',
          text: err.error.message,
        });
      }
    );
  }

  getClients() {
    this.spinner.showLoadingIndicator();
    this.userService.getUserByRole('CLIENT').subscribe((data) => {
      this.spinner.hideLoadingIndicator();
      this.listClients = data;
    });
  }

  getUserByPetId() {
    this.spinner.showLoadingIndicator();
    this.petService.getOnlyUser(this.data.pet.id).subscribe(
      (res: any) => {
        this.spinner.hideLoadingIndicator();
        console.log(res);
        this.user = res;
        console.log(this.user);
      },
      (err: any) => {
        this.spinner.hideLoadingIndicator();
        console.log(err);
      }
    );
  }

  onCancelClick() {
    this.dialogRef.close();
  }
}
