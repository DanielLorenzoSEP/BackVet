import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { DoctorService } from 'src/app/services/doctor.service';
import { SpinnerService } from 'src/app/services/spinner.service';
import { UserService } from 'src/app/services/user.service';
import { MedicineComponent } from '../medicine/medicine.component';
import { MedicineService } from 'src/app/services/medicine.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-all-medicines',
  templateUrl: './all-medicines.component.html',
  styleUrls: ['./all-medicines.component.css']
})
export class AllMedicinesComponent {
  medicines: any[] = [];
  showDescription: boolean = true;
  displayedColumns: string[] = ['id', 'name', 'description', 'fabricator', 'type', 'actions'];
  dataSource = new MatTableDataSource<any>(this.medicines); // Usa any como tipo genérico para la fuente de datos

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private medicineService: MedicineService,
    private router: Router,
    private location: Location,
    private spinner: SpinnerService,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.getMedicines();
  }

  getMedicines() {
    this.spinner.showLoadingIndicator();
    this.medicines = []; // Limpia el arreglo
    this.medicineService.getMedicines().subscribe(
      (res: any) => {
        this.spinner.hideLoadingIndicator();
        this.medicines = res;
        this.dataSource = new MatTableDataSource<any>(this.medicines); // Asigna la respuesta a la fuente de datos de la tabla
        this.dataSource.paginator = this.paginator; // Asigna el paginador después de obtener los datos
        console.log(this.medicines);
      },
      (err: any) => {
        this.spinner.hideLoadingIndicator();
        console.log(err);
      }
    );
  }


  openEditDialog(id: any) {
    const dialogRef = this.dialog.open(MedicineComponent, {
      width: '80%', // Ajusta el ancho según tus necesidades
      data: {
        medicineId: id // Puedes enviar el ID del médico seleccionado si es necesario
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getMedicines(); // Actualiza la tabla cuando se cierra el diálogo
    });
  }

  deleteMedicine(id: any) {
    this.spinner.showLoadingIndicator();
    this.medicineService.deleteMedicine(id).subscribe(
      (res: any) => {
        this.spinner.hideLoadingIndicator();
        this.getMedicines();
      },
      (err: any) => {
        this.spinner.hideLoadingIndicator();
        console.log(err);
      }
    );
  }

  filter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase(); // Filtra los datos de la tabla
  }

  goNewMedicine() {
    this.router.navigate(['dashboard/addMedicines'])
  }

  goBack() {
    this.router.navigate(['dashboard']);
  }

  toggleDescription(event: any) {
    this.showDescription = !this.showDescription;
    console.log(this.showDescription);
  }


}
