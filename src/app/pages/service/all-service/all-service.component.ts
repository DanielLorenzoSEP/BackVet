import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { DoctorService } from 'src/app/services/doctor.service';
import { ServiceService } from 'src/app/services/service.service';
import { SpinnerService } from 'src/app/services/spinner.service';
import { ServiceComponent } from '../service/service.component';
import { Location } from '@angular/common';

@Component({
  selector: 'app-all-service',
  templateUrl: './all-service.component.html',
  styleUrls: ['./all-service.component.css']
})
export class AllServiceComponent {
  services: any[] = [];

  displayedColumns: string[] = ['name', 'description', 'price', 'duration', 'actions'];
  dataSource = new MatTableDataSource<any>(this.services);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private serviceService: ServiceService,
    private router: Router,
    private location: Location,
    private spinner: SpinnerService,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.spinner.showLoadingIndicator();
    this.getServices();
  }

  getServices() {
    this.services = [];
    this.spinner.showLoadingIndicator();
    this.serviceService.getServices().subscribe(
      (res: any) => {
        this.spinner.hideLoadingIndicator();
        this.services = res;
        this.dataSource = new MatTableDataSource<any>(this.services); // Asigna la respuesta a la fuente de datos de la tabla
        this.dataSource.paginator = this.paginator; // Asigna el paginador después de obtener los datos
        console.log(this.services);
      },
      err => {
        this.spinner.hideLoadingIndicator();
        console.log(err);
      }
    );
  }

  openEditDialog(id: any) {
    const dialogRef = this.dialog.open(ServiceComponent, {
      width: '80%', // Ajusta el ancho según tus necesidades
      data: {
        serviceId: id // Puedes enviar el ID del médico seleccionado si es necesario
      }
    });
  
    dialogRef.afterClosed().subscribe(result => {
      this.getServices();
    });
  }

  filter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  goNewService() {
    this.router.navigate(['dashboard/addService'])
  }

  goBack() {
    this.router.navigate(['dashboard']);
  }
  
}
