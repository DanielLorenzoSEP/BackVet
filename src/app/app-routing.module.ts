import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { authGuard } from './guards/auth.guard';
import { RegisterStep1Component } from './pages/register-step1/register-step1.component';
import { RegisterStep2Component } from './pages/register-step2/register-step2.component';
import { Recover1Component } from './pages/recover1/recover1.component';
import { Recover2Component } from './pages/recover2/recover2.component';
import { Recover3Component } from './pages/recover3/recover3.component';
import { NewClientComponent } from './pages/client/new-client/new-client.component';
import { IndividualClientComponent } from './pages/client/individual-client/individual-client.component';
import { AllClientsComponent } from './pages/client/all-clients/all-clients.component';
import { AddPetComponent } from './pages/pet/add-pet/add-pet.component';
import { PetComponent } from './pages/pet/pet/pet.component';
import { GraphicsComponent } from './pages/graphics/graphics.component';
import { AllPetsComponent } from './pages/pet/all-pets/all-pets.component';
import { AllAppointmentComponent } from './pages/appointment/all-appointment/all-appointment.component';
import { AppointmentComponent } from './pages/appointment/appointment/appointment.component';
import { AddAppointmentComponent } from './pages/appointment/add-appointment/add-appointment.component';
import { MedicalComponent } from './pages/pet/medical/medical/medical.component';
import { AddMedicalComponent } from './pages/pet/medical/add-medical/add-medical.component';
import { AddPrescriptionComponent } from './pages/pet/medical/add-prescription/add-prescription.component';
import { PrescriptionComponent } from './pages/pet/medical/prescription/prescription.component';
import { EmployeesComponent } from './pages/employee/employees/employees.component';
import { AllDoctorsComponent } from './pages/doctor/all-doctors/all-doctors.component';
import { DoctorComponent } from './pages/doctor/doctor/doctor.component';
import { AddDoctorComponent } from './pages/doctor/add-doctor/add-doctor.component';
import { MedicineComponent } from './pages/medicine/medicine/medicine.component';
import { AddMedicineComponent } from './pages/medicine/add-medicine/add-medicine.component';
import { AllMedicinesComponent } from './pages/medicine/all-medicines/all-medicines.component';
import { ServiceComponent } from './pages/service/service/service.component';
import { AddServiceComponent } from './pages/service/add-service/add-service.component';
import { AllServiceComponent } from './pages/service/all-service/all-service.component';
import { DeletedAppointmentComponent } from './pages/appointment/deleted-appointment/deleted-appointment.component';
import { HomeComponent } from './pages/home/home.component';
import { urlGuard } from './guards/url.guard';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent, canActivate: [urlGuard] },
  { path: 'registro1', component: RegisterStep1Component, canActivate: [urlGuard] },
  { path: 'registro2', component: RegisterStep2Component, canActivate: [urlGuard] },
  { path: 'recover1', component: Recover1Component, canActivate: [urlGuard] },
  { path: 'recover2', component: Recover2Component, canActivate: [urlGuard] },
  { path: 'recover3', component: Recover3Component, canActivate: [urlGuard] },
  {
    path: 'dashboard', component: DashboardComponent, canActivate: [authGuard, urlGuard],
    children: [
      { path: '', component: GraphicsComponent, canActivate: [authGuard, urlGuard], pathMatch: 'full' },
      { path: 'client', component: AllClientsComponent, canActivate: [authGuard, urlGuard] },
      { path: 'addClient', component: NewClientComponent, canActivate: [authGuard, urlGuard] },
      { path: 'indClient/:username', component: IndividualClientComponent, canActivate: [authGuard, urlGuard] },
      { path: 'pets', component: AllPetsComponent, canActivate: [authGuard, urlGuard] },
      { path: 'medical/:id', component: MedicalComponent, canActivate: [authGuard, urlGuard] },
      { path: 'addMedical', component: AddMedicalComponent, canActivate: [authGuard, urlGuard] },
      { path: 'addPet', component: AddPetComponent, canActivate: [authGuard, urlGuard] },
      { path: 'pet/:id', component: PetComponent, canActivate: [authGuard, urlGuard] },
      { path: 'appointments', component: AllAppointmentComponent, canActivate: [authGuard, urlGuard] },
      { path: 'deletedAppointments', component: DeletedAppointmentComponent, canActivate: [authGuard, urlGuard] },
      { path: 'appointment', component: AppointmentComponent, canActivate: [authGuard, urlGuard] },
      { path: 'addAppointment', component: AddAppointmentComponent, canActivate: [authGuard, urlGuard] },
      { path: 'doctors', component: AllDoctorsComponent, canActivate: [authGuard, urlGuard] },
      { path: 'doctor/:id', component: DoctorComponent, canActivate: [authGuard, urlGuard] },
      { path: 'addDoctor', component: AddDoctorComponent, canActivate: [authGuard, urlGuard] },
      { path: 'medicines', component: AllMedicinesComponent, canActivate: [authGuard, urlGuard] },
      { path: 'addMedicines', component: AddMedicineComponent, canActivate: [authGuard, urlGuard] },
      { path: 'services', component: AllServiceComponent, canActivate: [authGuard, urlGuard] },
      { path: 'addService', component: AddServiceComponent, canActivate: [authGuard, urlGuard] },
      { path: 'prescription', component: PrescriptionComponent, canActivate: [authGuard, urlGuard] },
      { path: 'addPrescription', component: AddPrescriptionComponent, canActivate: [authGuard, urlGuard] },
      { path: 'employees', component: EmployeesComponent, canActivate: [authGuard, urlGuard] },
      { path: '**', redirectTo: 'graphics' }
    ]
  },
  { path: '**', redirectTo: '/' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
