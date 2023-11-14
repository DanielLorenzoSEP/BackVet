import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AppointmentService } from 'src/app/services/appointment.service';
import { PetService } from 'src/app/services/pet.service';
import { ServiceService } from 'src/app/services/service.service';
import { SpinnerService } from 'src/app/services/spinner.service';
import { UserService } from 'src/app/services/user.service';

interface Appointment {
  date: string;
  services: {
    id: number;
  }[];
  status: string;
  type: string;
  user: {
    id: number;
  };
  pets: {
    id: number;
  }[];
  doctors: {
    id: number;
  }[];
}

@Component({
  selector: 'app-edit-appointment',
  templateUrl: './edit-appointment.component.html',
  styleUrls: ['./edit-appointment.component.css']
})
export class EditAppointmentComponent {
  /* myFilter = (d: Date | null): boolean => {
    const day = (d || new Date()).getDay();
    return day !== 0 && day !== 6;
  }; */
  appointmentForm!: FormGroup;
  listUsers!: any[];
  listPets!: any[];
  listDoctors!: any[];
  listServices!: any[];
  appointment!: any;

  appointmentHoursValues: string[] = [
    "00:00:00", "00:30:00", "01:00:00", "01:30:00", "02:00:00", "02:30:00",
    "03:00:00", "03:30:00", "04:00:00", "04:30:00", "05:00:00", "05:30:00",
    "06:00:00", "06:30:00", "07:00:00", "07:30:00", "08:00:00", "08:30:00",
    "09:00:00", "09:30:00", "10:00:00", "10:30:00", "11:00:00", "11:30:00",
    "12:00:00", "12:30:00", "13:00:00", "13:30:00", "14:00:00", "14:30:00",
    "15:00:00", "15:30:00", "16:00:00", "16:30:00", "17:00:00", "17:30:00",
    "18:00:00", "18:30:00", "19:00:00", "19:30:00", "20:00:00", "20:30:00",
    "21:00:00", "21:30:00", "22:00:00", "22:30:00", "23:00:00", "23:30:00"
  ];

  appointmentHoursLabels: string[] = [
    "12:00 AM", "12:30 AM", "01:00 AM", "01:30 AM", "02:00 AM", "02:30 AM",
    "03:00 AM", "03:30 AM", "04:00 AM", "04:30 AM", "05:00 AM", "05:30 AM",
    "06:00 AM", "06:30 AM", "07:00 AM", "07:30 AM", "08:00 AM", "08:30 AM",
    "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
    "12:00 PM", "12:30 PM", "01:00 PM", "01:30 PM", "02:00 PM", "02:30 PM",
    "03:00 PM", "03:30 PM", "04:00 PM", "04:30 PM", "05:00 PM", "05:30 PM",
    "06:00 PM", "06:30 PM", "07:00 PM", "07:30 PM", "08:00 PM", "08:30 PM",
    "09:00 PM", "09:30 PM", "10:00 PM", "10:30 PM", "11:00 PM", "11:30 PM"
  ];

  originalAppointmentHoursValues: string[] = [
    "00:00:00", "00:30:00", "01:00:00", "01:30:00", "02:00:00", "02:30:00",
    "03:00:00", "03:30:00", "04:00:00", "04:30:00", "05:00:00", "05:30:00",
    "06:00:00", "06:30:00", "07:00:00", "07:30:00", "08:00:00", "08:30:00",
    "09:00:00", "09:30:00", "10:00:00", "10:30:00", "11:00:00", "11:30:00",
    "12:00:00", "12:30:00", "13:00:00", "13:30:00", "14:00:00", "14:30:00",
    "15:00:00", "15:30:00", "16:00:00", "16:30:00", "17:00:00", "17:30:00",
    "18:00:00", "18:30:00", "19:00:00", "19:30:00", "20:00:00", "20:30:00",
    "21:00:00", "21:30:00", "22:00:00", "22:30:00", "23:00:00", "23:30:00"
  ];

  originalAppointmentHoursLabels: string[] = [
    "12:00 AM", "12:30 AM", "01:00 AM", "01:30 AM", "02:00 AM", "02:30 AM",
    "03:00 AM", "03:30 AM", "04:00 AM", "04:30 AM", "05:00 AM", "05:30 AM",
    "06:00 AM", "06:30 AM", "07:00 AM", "07:30 AM", "08:00 AM", "08:30 AM",
    "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
    "12:00 PM", "12:30 PM", "01:00 PM", "01:30 PM", "02:00 PM", "02:30 PM",
    "03:00 PM", "03:30 PM", "04:00 PM", "04:30 PM", "05:00 PM", "05:30 PM",
    "06:00 PM", "06:30 PM", "07:00 PM", "07:30 PM", "08:00 PM", "08:30 PM",
    "09:00 PM", "09:30 PM", "10:00 PM", "10:30 PM", "11:00 PM", "11:30 PM"
  ];

  today = new Date();
  day = this.today.getDate() + 1;
  month = this.today.getMonth() + 1;
  year = this.today.getFullYear();

  date: string = `${this.year}-${this.month.toString().padStart(2, '0')}-${this.day.toString().padStart(2, '0')}`;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private petService: PetService,
    private serviceService: ServiceService,
    private appointmentService: AppointmentService,
    private spinnner: SpinnerService,
    private router: Router,
    public dialogRef: MatDialogRef<EditAppointmentComponent>
  ) { }

  ngOnInit() {
    /* this.spinnner.showLoadingIndicator(); */
    this.getAppointmentById(localStorage.getItem('appointmentId')!);
    this.getUsers();
    this.getPets();
    this.getDoctors();
    this.getServices();
    this.appointment = {
      id: '',
      date: '',
      serviceId: '',
      status: '',
      userId: '',
      petId: '',
      doctorId: ''
    };
    if (this.isToday(this.date)) this.filterHours(this.today.getHours())
  }

  resetAppointmentHours() {
    this.appointmentHoursValues = [...this.originalAppointmentHoursValues];
    this.appointmentHoursLabels = [...this.originalAppointmentHoursLabels];
  }

  getAppointmentById(id: any) {
    this.appointmentService.getAppointmentWithUserAndPet(id).subscribe(
      (res: any) => {
        const dateString = res.date.split(' ')[0];
        const lastTwoCharacters = dateString.slice(-2);
        const dayOfMonth = parseInt(lastTwoCharacters, 10) + 1;

        const updatedDateString = dateString.slice(0, -2) + dayOfMonth.toString().padStart(2, '0');
        this.appointmentForm = this.fb.group({
          day: [updatedDateString, Validators.required],
          hour: [res.date.split(' ')[1], Validators.required],
          service: [res.serviceId, Validators.required],
          status: [res.status, Validators.required],
          user: [res.userId, Validators.required],
          pet: [res.petId, Validators.required],
          doctor: [res.doctorId, Validators.required]
        });
      },
      err => console.log(err)
    )
  }

  formatThisTime(time: Date): string {
    const hours = time.getHours();
    const minutes = time.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    return `${this.padZero(hours % 12)}:${this.padZero(minutes)} ${ampm}`;
  }

  padZero(number: number): string {
    return (number < 10 ? '0' : '') + number;
  }

  getUsers() {
    this.userService.getUserByRole("CLIENT").subscribe(
      (res: any) => {
        this.listUsers = res;
      },
      err => console.log(err)
    )
  }

  getPets() {
    this.petService.getAllPets().subscribe(
      (res: any) => {
        this.listPets = res;
      },
      err => console.log(err)
    )
  }

  getDoctors() {
    this.petService.getDoctors().subscribe(
      (res: any) => {
        this.listDoctors = res;
      },
      err => console.log(err)
    )
  }

  getServices() {
    this.serviceService.getServices().subscribe(
      (res: any) => {
        this.listServices = res;
      },
      err => console.log(err)
    )
  }

  updateAppointment() {
    this.spinnner.showLoadingIndicator();

    const selectedDate = this.appointmentForm.get('day')?.value;
    const selectedTime = this.appointmentForm.get('hour')?.value;

    const formattedTime = this.formatTime(selectedTime);
    const formattedDate = this.formatDate(new Date(selectedDate));

    const combinedDateTime: string = `${formattedDate} ${formattedTime}`;
    this.appointment.date = combinedDateTime;
    console.log(combinedDateTime)
    this.appointment.id = parseInt(localStorage.getItem('appointmentId')!, 10);
    this.appointment.date = combinedDateTime;
    this.appointment.serviceId = this.appointmentForm.get('service')?.value;
    this.appointment.status = this.appointmentForm.get('status')?.value;
    this.appointment.userId = this.appointmentForm.get('user')?.value;
    this.appointment.petId = this.appointmentForm.get('pet')?.value;
    this.appointment.doctorId = this.appointmentForm.get('doctor')?.value;
    console.log(this.appointment)

    this.appointmentService.updateAppointment(this.appointment).subscribe(
      (res: any) => {
        this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
          this.router.navigate(['dashboard/appointments']);
        });
        this.dialogRef.close();
        this.spinnner.hideLoadingIndicator();
      },
      err => {
        this.spinnner.hideLoadingIndicator();
        console.log(err)
      }
    )
  }

  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = this.twoDigits(date.getMonth() + 1);
    const day = this.twoDigits(date.getDate());

    return `${year}-${month}-${day}`;
  }

  formatTime(time: string): string {
    const newTime = time.slice(0, -3);
    return newTime;
  }

  twoDigits(value: number): string {
    return value < 10 ? `0${value}` : value.toString();

  }

  isToday(date: string) {
    const today = new Date();
    const selectedDate = new Date(date);
    return (
      today.getFullYear() === selectedDate.getFullYear() &&
      today.getMonth() === selectedDate.getMonth() &&
      today.getDate() === selectedDate.getDate()
    );
  }

  onDateChange(event: any) {
    const selectedDate = event.value;

    if (selectedDate === this.date) {
    } else if (this.isToday(selectedDate)) {
      this.filterHours(this.today.getHours());
    } else {
      this.resetAppointmentHours();
    }
  }
  filterHours(hours: number) {
    this.appointmentHoursValues = this.appointmentHoursValues.filter(hour => {
      const hourNumber = parseInt(hour.split(':')[0], 10);
      if (hourNumber < hours) {
        this.appointmentHoursLabels.shift();
      }
      return hourNumber >= hours;
    });
  }


  onCancelClick() {
    this.dialogRef.close();
  }
}
