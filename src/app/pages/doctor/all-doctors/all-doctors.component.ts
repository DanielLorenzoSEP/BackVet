import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { DoctorService } from 'src/app/services/doctor.service';
import { SpinnerService } from 'src/app/services/spinner.service';
import { UserService } from 'src/app/services/user.service';
import { DoctorComponent } from '../doctor/doctor.component';
import Swal from 'sweetalert2';
import { Location } from '@angular/common';

@Component({
  selector: 'app-all-doctors',
  templateUrl: './all-doctors.component.html',
  styleUrls: ['./all-doctors.component.css']
})
export class AllDoctorsComponent {
  usuarios: any[] = []; // Inicializa el arreglo vacío

  displayedColumns: string[] = ['id', 'name', 'lastname', 'email', 'phone', 'status', 'actions'];
  dataSource = new MatTableDataSource<any>(this.usuarios); // Usa any como tipo genérico para la fuente de datos

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private doctorService: DoctorService,
    private router: Router,
    private location: Location,
    private spinner: SpinnerService,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.spinner.showLoadingIndicator();
    this.getDoctors();
  }

  getDoctors() {
    this.usuarios = []; // Limpia el arreglo
    this.doctorService.getDoctors().subscribe(
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
    );
  }

  openEditDialog(id: any) {
    const dialogRef = this.dialog.open(DoctorComponent, {
      width: '80%', // Ajusta el ancho según tus necesidades
      data: {
        doctorId: id // Puedes enviar el ID del médico seleccionado si es necesario
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getDoctors(); // Actualiza la tabla cuando se cierra el diálogo
    });
  }

  deleteDoctor(id: any) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "¡No podrás revertir esto!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#00A8E8',
      cancelButtonColor: '#E81123',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.doctorService.deleteDoctor(id).subscribe(
          res => {
            this.getDoctors(); // Actualiza la tabla cuando se elimina un médico
            Swal.fire(
              '¡Eliminado!',
              'El médico ha sido eliminado.',
              'success'
            )
          },
          err => {
            console.log(err);
          }
        );
      }
    })
  }

  filter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase(); // Filtra los datos de la tabla
  }

  goNewClient() {
    this.router.navigate(['dashboard/addDoctor'])
  }

  goBack() {
    this.router.navigate(['dashboard']);
  }

}
