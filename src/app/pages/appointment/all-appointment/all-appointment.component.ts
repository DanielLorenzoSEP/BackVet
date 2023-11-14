import { DatePipe, Location } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { AppointmentService } from 'src/app/services/appointment.service';
import { SpinnerService } from 'src/app/services/spinner.service';
import { UserService } from 'src/app/services/user.service';
import { AddAppointmentComponent } from '../add-appointment/add-appointment.component';
import { EditAppointmentComponent } from '../edit-appointment/edit-appointment.component';
import Swal from 'sweetalert2';

export interface Appointment {
  id: number;
  clientName: string;
  petName: string;
  date: string;
}

@Component({
  selector: 'app-all-appointment',
  templateUrl: './all-appointment.component.html',
  styleUrls: ['./all-appointment.component.css']
})
export class AllAppointmentComponent {
  appointments: any[] = [];
  completedAppointments: any[] = [];

  displayedColumns: string[] = ['user', 'pet', 'doctor', 'service', 'status', 'date', 'actions'];
  dataSource = new MatTableDataSource<any>(this.appointments);
  secondDataSource = new MatTableDataSource<any>(this.appointments);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private dialog: MatDialog,
    private router: Router,
    private location: Location,
    private spinner: SpinnerService,
    private appointmentService: AppointmentService,
    private datePipe: DatePipe,
    public dialogRef: MatDialogRef<EditAppointmentComponent>
  ) { }

  openDialog(enterAnimationDuration: string, exitAnimationDuration: string, id: any): void {
    localStorage.setItem('appointmentId', id);
    const dialogRef = this.dialog.open(EditAppointmentComponent, {
      width: '80%',
      enterAnimationDuration,
      exitAnimationDuration
    });

    dialogRef.afterClosed().subscribe(result => {
      // Aquí puedes manejar los resultados después de cerrar la ventana modal
      if (result) {
        // Realizar acciones después de cerrar la ventana modal
        this.loadAppointments(); // Actualiza las citas después de agregar una nueva cita
      }
    });
  }


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
  
        // Ordenar las citas activas por fecha de la más pronta a la más lejana
        activeAppointments.sort((a: any, b: any) => {
          const dateA = new Date(a.date).getTime();
          const dateB = new Date(b.date).getTime();
          return dateA - dateB;
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
        this.dataSource.data = this.appointments;
        this.secondDataSource.data = this.completedAppointments;
        console.log(this.appointments);
        this.dataSource.paginator = this.paginator;
        this.dialogRef.close();
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

  changeStatus(event: any, appointment: any) {
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
    this.dataSource.filter = filterValue.trim().toLowerCase(); // Filtra los datos de la tabla
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
  }

  goBack() {
    this.router.navigate(['dashboard']);
  }
}
