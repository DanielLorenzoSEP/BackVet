import { Location } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { SpinnerService } from 'src/app/services/spinner.service';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-all-clients',
  templateUrl: './all-clients.component.html',
  styleUrls: ['./all-clients.component.css']
})
export class AllClientsComponent implements OnInit {
  usuarios: any[] = []; // Inicializa el arreglo vacío

  displayedColumns: string[] = ['id', 'username', 'email', 'phone', 'actions'];
  dataSource = new MatTableDataSource<any>(this.usuarios); // Usa any como tipo genérico para la fuente de datos

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private userService: UserService,
    private router: Router,
    private location: Location,
    private spinner: SpinnerService
  ) { }

  ngOnInit(): void {
    this.spinner.showLoadingIndicator();
    this.getClients();
  }

  getClients() {
    this.usuarios = [];
    this.userService.getUserByRole("CLIENT").subscribe(
      (res: any) => {
        this.spinner.hideLoadingIndicator();
        this.usuarios = res;
        this.dataSource = new MatTableDataSource<any>(this.usuarios); // Asigna la respuesta a la fuente de datos de la tabla
        this.dataSource.paginator = this.paginator; // Asigna el paginador después de obtener los datos
        console.log(this.usuarios);
      },
      err => {
        this.spinner.hideLoadingIndicator();
        console.log(err);
      }
    )
  }

  deleteUser(id: number) {
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
        this.userService.deleteUser(id).subscribe(
          (res: any) => {
            this.spinner.hideLoadingIndicator();
            console.log(res);
            Swal.fire({
              icon: 'success',
              title: 'Cliente eliminado',
              showConfirmButton: false,
              timer: 1000
            })
            this.getClients();
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

  onRowClick(row: any) {
    console.log(row.username)
    this.router.navigate([`dashboard/indClient/${row.username}`])
  }

  filter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase(); // Filtra los datos de la tabla
  }

  goNewClient() {
    this.router.navigate(['dashboard/addClient'])
  }

  goBack() {
    this.router.navigate(['dashboard']);
  }
}
