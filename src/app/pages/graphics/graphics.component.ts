import { Component, OnInit, ViewChild } from '@angular/core';
import { MatAccordion } from '@angular/material/expansion';
import { Router } from '@angular/router';
import { CalendarEvent } from 'angular-calendar';
import { AppointmentService } from 'src/app/services/appointment.service';
import { PetService } from 'src/app/services/pet.service';
import { ServiceService } from 'src/app/services/service.service';
import { SpinnerService } from 'src/app/services/spinner.service';
import { UserService } from 'src/app/services/user.service';

interface WeekData {
  title: string;
  appointmentCount: number;
}

@Component({
  selector: 'app-graphics',
  templateUrl: './graphics.component.html',
  styleUrls: ['./graphics.component.css']
})
export class GraphicsComponent implements OnInit {

  @ViewChild(MatAccordion) accordion: MatAccordion = new MatAccordion;

  barChartData: any[] = [
    {
      name: 'Perros',
      value: 0,
    },
    {
      name: 'Gatos',
      value: 0,
    },
    {
      name: 'Otros',
      value: 0,
    },
  ];

  usersData: any[] = [];
  areaChartData: any[] = [
    {
      name: 'Usuarios',
      series: []
    },
  ];
  dates: any[] = [];

  pieChartData: any[] = [];
  gridChartData: any[] = [];

  countDogs!: number;
  countCats!: number;
  countOthers!: number;

  weekData: WeekData[] = [];
  lineChartData: any[] = [];

  appointmentsToday: any[] = [];

  openPanel = true;

  constructor(
    private router: Router,
    private petService: PetService,
    private userService: UserService,
    private appointmentService: AppointmentService,
    private serviceService: ServiceService,
    private spinnerService: SpinnerService
  ) { }

  ngOnInit(): void {
    this.spinnerService.showLoadingIndicator();
    this.getSpecies();
    this.getUsers();
    this.getMedicinesCount();
    this.getServicesCount();
    this.getAppointments();
    this.getAppointmentsToday();
  }

  getSpecies() {
    this.petService.countSpecies().subscribe(
      (res: any) => {
        this.countDogs = res.dogs;
        this.countCats = res.cats;
        this.countOthers = res.others;

        this.barChartData = [
          {
            name: 'Perros',
            value: this.countDogs,
          },
          {
            name: 'Gatos',
            value: this.countCats,
          },
          {
            name: 'Otros',
            value: this.countOthers,
          },
        ];
        console.log(this.barChartData);
      },
      err => console.log(err)
    );
  }

  getUsers() {
    this.userService.getAllUsers().subscribe(
      (users: any) => {
        this.usersData = users;
        this.processUserData();

      },
      err => console.log(err)
    );
  }


  processUserData() {
    this.usersData.forEach((user: any) => {
      if (user.createdAt) {
        this.dates.push(user.createdAt);
      }
    });

    const usersByMonth: Record<string, number> = {};

    this.dates.forEach((data: any) => {
      const createdAtDate: string = data;
      const month = createdAtDate.substring(3, 5);
      usersByMonth[month] = (usersByMonth[month] || 0) + 1;
      this.getMonthName(Number(month));
    });

    const seriesData = Object.keys(usersByMonth).map(monthStr => {
      const monthName = this.getMonthName(Number(monthStr));
      const value = usersByMonth[monthStr];
      return { name: monthName, value: value };
    });

    this.areaChartData = [
      {
        name: 'Clientes',
        series: seriesData.reverse()
      },
    ];
  }

  getMonthName(monthNumber: number) {
    const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    return months[monthNumber - 1];
  }

  getMedicinesCount() {
    this.petService.countMedicines().subscribe(
      (res: any) => {
        this.pieChartData = res;
        console.log(this.pieChartData);
      },
      err => console.log(err)
    );
  }

  getServicesCount() {
    this.serviceService.countServices().subscribe(
      (res: any) => {
        this.gridChartData = res;
        const firstThreeItems = this.gridChartData.slice(0, 3);
        console.log(firstThreeItems);
        this.gridChartData = firstThreeItems;
      },
      err => console.log(err)
    );
  }

  getAppointmentsToday() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
  
    this.appointmentService.getAppointmentsAny().subscribe(
      (appointments: any[]) => {
        console.log(appointments);
        this.appointmentsToday = appointments.filter(appointment => {
          const appointmentDate = new Date(appointment.date);
  
          // Filtrar por fecha y por estatus
          const isToday = appointmentDate.getDate() === today.getDate() &&
                          appointmentDate.getMonth() === today.getMonth() &&
                          appointmentDate.getFullYear() === today.getFullYear();
  
          const validStatus = ["Finalizada", "Cancelada por el cliente", "Cancelada por el veterinario"].indexOf(appointment.status) === -1;
  
          return isToday && validStatus;
        });
        console.log(this.appointmentsToday);
        this.accordion.openAll();
        this.spinnerService.hideLoadingIndicator();
      },
      err => console.log(err)
    );
  }
  

  getAppointments() {
    this.appointmentService.getAppointments().subscribe(
      (res: any) => {
        this.proccessWeekData(res);
        
      },
      err => console.log(err)
    );
  }

  proccessWeekData(res: any) {
    const currentDate = new Date();
    const lastMonth = new Date(currentDate.getTime() - 30 * 24 * 60 * 60 * 1000);
    const beforeLastMonth = new Date(currentDate.getTime() - 60 * 24 * 60 * 60 * 1000);
    console.log(currentDate.getMonth() + 1);
    console.log(lastMonth.getMonth() + 1);
    console.log(beforeLastMonth.getMonth() + 1);

    let count1 = 0;
    let count2 = 0;
    let count3 = 0;

    res.forEach((appointment: any) => {
      if (Number(appointment.date.substring(6, 7)) === currentDate.getMonth() + 1) {
        count1++;
      }
      if (Number(appointment.date.substring(6, 7)) === lastMonth.getMonth() + 1) {
        count2++;
      }
      if (Number(appointment.date.substring(6, 7)) === beforeLastMonth.getMonth() + 1) {
        count3++;
      }
    });
    this.weekData.push({ title: this.getMonthName(Number(currentDate.getMonth() + 1)), appointmentCount: count1 });
    this.weekData.push({ title: this.getMonthName(Number(lastMonth.getMonth() + 1)), appointmentCount: count2 });
    this.weekData.push({ title: this.getMonthName(Number(beforeLastMonth.getMonth() + 1)), appointmentCount: count3 });
    this.weekData = this.weekData.reverse();
    const seriesData = this.weekData.map(week => {
      return { name: week.title, value: week.appointmentCount };
    });
  
    this.lineChartData = [
      {
        name: 'Semanas',
        series: seriesData
      }
    ];
  }


  // Otras opciones de configuración para el gráfico
  colorScheme = 'nightLights';
  showXAxis = true;
  showYAxis = true;
  showXAxisLabel = true;
  showYAxisLabel = true;
  xAxisLabel = '';
  yAxisLabel = '';

  showLabels = true;
  labelFormatting = (value: number) => `${value}%`;
  explodeSlices = false;
  doughnut = true;
  legend = true;
  legendPosition = 'below';

  goAppointments() {
    this.router.navigate(['/dashboard/appointments']);
  }

  goAddAppointment() {
    this.router.navigate(['/dashboard/addAppointment']);
  }

  goAddClient() {
    this.router.navigate(['/dashboard/addClient']);
  }

  goAddPet() {
    this.router.navigate(['/dashboard/addPet']);
  }

}
