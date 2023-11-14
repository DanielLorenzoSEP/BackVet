import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { PetService } from 'src/app/services/pet.service';
import { SpinnerService } from 'src/app/services/spinner.service';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';
import { EditClientComponent } from '../edit-client/edit-client.component';
import { Location } from '@angular/common';

interface User {
  id: number;
  username: string;
  email: string;
  phone: string;
  address: string;
}

@Component({
  selector: 'app-individual-client',
  templateUrl: './individual-client.component.html',
  styleUrls: ['./individual-client.component.css']
})
export class IndividualClientComponent implements OnInit {

  user!: User;
  pets: any[] = [];
  editForm!: FormGroup;

  constructor(
    private userService: UserService,
    private route: ActivatedRoute,
    private location: Location,
    private petsService: PetService,
    private router: Router,
    private spinner: SpinnerService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.getUsersandPets();
  }


  openEditDialog(): void {
    const dialogRef = this.dialog.open(EditClientComponent, {
      width: '80%', // Personaliza el ancho según tus necesidades
      height: '90%', // Personaliza el alto según tus necesidades
      panelClass: 'dialog', // Personaliza la clase del diálogo
      data: { user: this.user } // Pasa los datos del usuario al diálogo
    });
  
    dialogRef.afterClosed().subscribe(result => {
      this.getUsersandPets();
    });
  }


  getUsersandPets() {
    this.spinner.showLoadingIndicator();
    this.user = { id: 0, username: '', email: '', phone: '', address: '' };
    this.pets = [];
    this.userService.getUserByUsername(this.route.snapshot.paramMap.get('username')!).subscribe(
      (res: any) => {
        this.user = res;
        this.petsService.getPetsByUserId(res.id).subscribe(
          (res: any) => {
            this.spinner.hideLoadingIndicator();
            this.pets = res.map((pet: any) => ({ ...pet, view: false })); // Agregar la propiedad 'view' a cada mascota
          }
        ), (err: any) => {
          this.spinner.hideLoadingIndicator();
          console.log('error al traer las mascotas');
        }
      }
    ), (err: any) => {
      this.spinner.hideLoadingIndicator();
      console.log('error al traer al usuario');
    }
  }

  deleteClient() {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "Se eliminará el cliente y todas sus mascotas",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.spinner.showLoadingIndicator();
        this.userService.deleteUser(this.user.id).subscribe(
          (res: any) => {
            this.spinner.hideLoadingIndicator();
            console.log(res);
            Swal.fire({
              icon: 'success',
              title: 'Cliente eliminado',
              showConfirmButton: false,
              timer: 1000
            })
            this.router.navigate(['/dashboard/client'])
          }
        ), (err: any) => {
          this.spinner.hideLoadingIndicator();
          console.log('error al eliminar el usuario');
          Swal.fire({
            icon: 'error',
            text: 'No se pudo eliminar el cliente',
          })
        }
      }
    })
  }

  deletePet(pet: any, event: Event) {
    event.stopPropagation();
    Swal.fire({
      title: '¿Estás seguro?',
      text: "Se eliminará la mascota",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.deleteMascota(pet);
      }
    })
  }

  deleteMascota(pet: any) {
    this.spinner.showLoadingIndicator();
    this.petsService.deletePet(pet.id).subscribe(
      (res: any) => {
        this.spinner.hideLoadingIndicator();
        console.log(res);
        Swal.fire({
          icon: 'success',
          title: 'Mascota eliminada',
          showConfirmButton: false,
          timer: 1000
        })
        this.pets = this.pets.filter(p => p.id !== pet.id);
      }, (err: any) => {
        this.spinner.hideLoadingIndicator();
        console.log('error al eliminar la mascota');
        Swal.fire({
          icon: 'error',
          text: 'No se pudo eliminar la mascota',
        })
      }
    )
  }

  goBack() {
    this.router.navigate(['dashboard/client']);
  }

  goCreatePet() {
    this.router.navigate([`/dashboard/addPet`])
  }

  goEditPet(pet: any) {
    this.router.navigate([`/dashboard/pet/${pet.id}`])
  }
}
