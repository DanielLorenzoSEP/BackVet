import { Location } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { PetService } from 'src/app/services/pet.service';
import { SpinnerService } from 'src/app/services/spinner.service';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-all-pets',
  templateUrl: './all-pets.component.html',
  styleUrls: ['./all-pets.component.css']
})
export class AllPetsComponent {

  pets: any[] = [];

  displayedColumns: string[] = ['id', 'name', 'race', 'specie', 'user', 'actions'];
  dataSource = new MatTableDataSource<any>(this.pets);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private petService: PetService,
    private userService: UserService,
    private router: Router,
    private location: Location,
    private spinner: SpinnerService
  ) { }

  ngOnInit(): void {
    this.spinner.showLoadingIndicator();
    this.getData(); 
  }

  getData() {
    this.pets = [];
    this.petService.getPetsWithUser().subscribe(
      (res: any) => {
        this.spinner.hideLoadingIndicator();
        this.pets = res;
        this.dataSource = new MatTableDataSource<any>(this.pets);
        this.dataSource.paginator = this.paginator;
      },
      err => {
        this.spinner.hideLoadingIndicator();
        console.log(err);
      }
    )
    this.userService.getAllUsers().subscribe(
      (res: any) => {
        this.spinner.hideLoadingIndicator();
      },
      err => {
        console.log(err);
      }
    )
  }

  onRowClick(row: any) {
    console.log(row.username)
    this.router.navigate([`dashboard/pet/${row.id}`])
  }

  filter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase(); // Filtra los datos de la tabla
  }

  goNewPet() {
    this.router.navigate(['dashboard/addPet'])
  }

  goBack() {
    this.router.navigate(['dashboard']);
  }

  deletePet(id: number) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: '¡No podrás revertir esto!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#dc3545',
      confirmButtonText: '¡Sí, eliminar!',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.spinner.showLoadingIndicator();        
        this.petService.deletePet(id).subscribe(
          (res: any) => {
            this.spinner.hideLoadingIndicator();
            console.log(res);
            Swal.fire({
              title: '¡Eliminado!',
              text: 'La mascota ha sido eliminada.',
              icon: 'success',
              confirmButtonText: 'Aceptar'
            });
            this.getData();
          },
          (err: any) => {
            this.spinner.hideLoadingIndicator();
            Swal.fire({
              title: 'Error',
              text: 'No se ha podido eliminar la mascota',
              icon: 'error',
              confirmButtonText: 'Aceptar'
            });
            console.log(err);
          }
        );
      }
    });
  }

}
