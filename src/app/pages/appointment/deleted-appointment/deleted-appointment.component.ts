import { DatePipe } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { AppointmentService } from 'src/app/services/appointment.service';
import { SpinnerService } from 'src/app/services/spinner.service';
import Swal from 'sweetalert2';

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H'},
  {position: 2, name: 'Helium', weight: 4.0026, symbol: 'He'},
  {position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li'},
  {position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be'},
  {position: 5, name: 'Boron', weight: 10.811, symbol: 'B'},
  {position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C'},
  {position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N'},
  {position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O'},
  {position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F'},
  {position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne'},
];

@Component({
  selector: 'app-deleted-appointment',
  templateUrl: './deleted-appointment.component.html',
  styleUrls: ['./deleted-appointment.component.css']
})
export class DeletedAppointmentComponent {
  appointments: any[] = [];
  completedAppointments: any[] = [];

  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
  dataSource = ELEMENT_DATA;

  secondDataSource = new MatTableDataSource<any>(this.appointments);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private dialog: MatDialog,
    private router: Router,
    private spinner: SpinnerService,
    private appointmentService: AppointmentService,
    private datePipe: DatePipe
  ) { }


  ngOnInit(): void {
    this.spinner.showLoadingIndicator();
    this.loadAppointments();
  }

  loadAppointments() {
    this.spinner.showLoadingIndicator();
    this.appointments = [];
    this.appointmentService.getAppointments().subscribe(
      (res: any) => {
        this.spinner.hideLoadingIndicator();

        // Filtrar las citas con estatus "Finalizada"
        const completedAppointments = res.filter((appointment: any) => {
          return (
            appointment.status === 'Finalizada' ||
            appointment.status === 'Cancelada por el cliente' ||
            appointment.status === 'Cancelada por el veterinario'
          );
        });

        // Filtrar las citas sin estatus "Finalizada"
        const activeAppointments = res.filter((appointment: any) => {
          return (
            appointment.status !== 'Finalizada' &&
            appointment.status !== 'Cancelada por el cliente' &&
            appointment.status !== 'Cancelada por el veterinario'
          );
        });

        this.appointments = activeAppointments.map((appointment: any) => {
          const formattedDate = this.datePipe.transform(appointment.date, 'medium');
          const translatedDate = formattedDate ? this.translateMonth(formattedDate) : '';
          return {
            ...appointment,
            formattedDate: translatedDate
          };
        });

        this.completedAppointments = completedAppointments.map((appointment: any) => {
          const formattedDate = this.datePipe.transform(appointment.date, 'medium');
          const translatedDate = formattedDate ? this.translateMonth(formattedDate) : '';
          return {
            ...appointment,
            formattedDate: translatedDate
          };
        });
        this.secondDataSource.data = this.completedAppointments;
        console.log(this.appointments);
        console.log(this.completedAppointments);
        this.spinner.hideLoadingIndicator();
      },
      err => {
        this.spinner.hideLoadingIndicator();
        console.log(err);
      }
    );
  }

  translateMonth(dateString: string): string {
    const monthTranslations: { [key: string]: string } = {
      'Jan': 'Ene',
      'Feb': 'Feb',
      'Mar': 'Mar',
      'Apr': 'Abr',
      'May': 'May',
      'Jun': 'Jun',
      'Jul': 'Jul',
      'Aug': 'Ago',
      'Sep': 'Sep',
      'Oct': 'Oct',
      'Nov': 'Nov',
      'Dec': 'Dic'
    };

    const englishMonths = Object.keys(monthTranslations).join('|');
    const regex = new RegExp(`(${englishMonths})\\s(\\d{1,2}),\\s(\\d{4}),\\s(\\d{1,2}:\\d{2}:\\d{2}\\s[APap][Mm])`);
    const match = dateString.match(regex);

    if (match) {
      const month = match[1];
      const translatedMonth = monthTranslations[month] || month;
      return `${translatedMonth} ${match[2]}, ${match[3]}, ${match[4]}`;
    }

    return dateString;
  }

  /* changeStatus(event: any, appointment: any) {
    this.spinner.showLoadingIndicator();
    this.appointmentService.updateStatus(appointment.id, event.value).subscribe(
      (res: any) => {
        this.loadAppointments();
      },
      err => { console.log(err) }
    );
  }


  onRowClick(row: any) {
  }

  filter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.secondDataSource.filter = filterValue.trim().toLowerCase(); // Filtra los datos de la tabla
  }

  filterSecondTable(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.secondDataSource.filter = filterValue.trim().toLowerCase();
  }

  goNewAppointment() {
    this.router.navigate(['dashboard/addAppointment'])
  }

  goDeleteAppointments() {
    this.router.navigate(['dashboard/deletedAppointments'])
  }

  deleteAppointment(id: number) {
    Swal.fire({ 
      title: '¿Estás seguro?',
      text: 'No podrás recuperar esta cita',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.spinner.showLoadingIndicator();
        this.appointmentService.deleteAppointment(id).subscribe(
          (res: any) => {
            this.loadAppointments();
            this.spinner.hideLoadingIndicator();
            Swal.fire(
              '¡Eliminada!',
              'La cita ha sido eliminada.',
              'success'
            )
          },
          err => {
            console.log(err);
            this.spinner.hideLoadingIndicator();
          }
        );
      }
    }
    )
  } */
}
