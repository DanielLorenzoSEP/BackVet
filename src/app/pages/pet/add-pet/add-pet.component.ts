import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PetService } from 'src/app/services/pet.service';
import { SpinnerService } from 'src/app/services/spinner.service';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';

interface Pet {
  name: string;
  race: string;
  specie: string;
  sex: string;
  birthdate: string;
  weight: number;
  user: number;
}

@Component({
  selector: 'app-add-pet',
  templateUrl: './add-pet.component.html',
  styleUrls: ['./add-pet.component.css']
})
export class AddPetComponent {

  newPetForm!: FormGroup;
  listClients!: any;
  today = new Date();
  day = this.today.getDate();
  month = this.today.getMonth() + 1; // Recuerda que los meses son base 0 en JavaScript
  year = this.today.getFullYear();



  date: string = `${this.year}-${this.month.toString().padStart(2, '0')}-${this.day.toString().padStart(2, '0')}`;
  constructor(
    private router: Router,
    private location: Location,
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
    this.newPetForm = this.initializeForm();
    this.getClients();
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

    let birthdate = this.newPetForm.value.birthdate.split('-').reverse().join('-');

    let pet: Pet = {
      name: this.newPetForm.value.name,
      race: this.newPetForm.value.race,
      specie: this.newPetForm.value.specie,
      sex: this.newPetForm.value.sex,
      birthdate: birthdate,
      weight: this.newPetForm.value.weight,
      user: this.newPetForm.value.user,
    };

    console.log(this.newPetForm.value);
    console.log(pet);

    this.petService.addPet(pet).subscribe((data: any) => {
      this.spinner.hideLoadingIndicator();
      Swal.fire({
        icon: 'success',
        text: 'Mascota agregada correctamente',
      });
      this.router.navigate([`/dashboard/pet/${data.id}`]);
    }), (error: any) => {
      Swal.fire({
        icon: 'error',
        text: 'No se pudo agregar la mascota',
      });
      console.log(error);
    }
  }

  goBack() {
    this.router.navigate(['dashboard/pets']);
  }

  getClients() {
    this.spinner.showLoadingIndicator();
    this.userService.getUserByRole('CLIENT').subscribe((data) => {
      this.spinner.hideLoadingIndicator();
      this.listClients = data;
    });
  }
}
