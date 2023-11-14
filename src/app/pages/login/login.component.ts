import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Route, Router } from '@angular/router';
import { local } from 'd3-selection';
import { CookieService } from 'ngx-cookie-service';
import { AppointmentService } from 'src/app/services/appointment.service';
import { DoctorService } from 'src/app/services/doctor.service';
import { LoginService } from 'src/app/services/login.service';
import { MedicineService } from 'src/app/services/medicine.service';
import { PetService } from 'src/app/services/pet.service';
import { RegisterService } from 'src/app/services/register.service';
import { ServiceService } from 'src/app/services/service.service';
import { SpinnerService } from 'src/app/services/spinner.service';
import { UrlService } from 'src/app/services/url.service';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';

interface Login {
  username: string;
  password: string;
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm!: FormGroup;

  veterinaries: any[] = [
    { url: 'https://spring-vet-production.up.railway.app', name: 'Veterinaria 1' },
    { url: 'https://spring-vet-production.up.railway.app', name: 'Veterinaria 2' },
    { url: 'https://localhost:8080', name: 'Veterinaria 3' }
  ];

  constructor(
    private loginService: LoginService,
    private petService: PetService,
    private appoinmentService: AppointmentService,
    private doctorService: DoctorService,
    private medicineService: MedicineService,
    private registerService: RegisterService,
    private serviceService: ServiceService,
    private userService: UserService,
    private router: Router,
    private formBuilder: FormBuilder,
    private loadingIndicatorService: SpinnerService,
    private urlService: UrlService,
  ) { }

  ngOnInit(): void {
    this.loginForm = this.initializeForm();
    this.loginService.deleteToken();

    this.loginService.url = this.urlService.getUrl();
    this.petService.url = this.urlService.getUrl();
    this.appoinmentService.url = this.urlService.getUrl();
    this.doctorService.url = this.urlService.getUrl();
    this.medicineService.url = this.urlService.getUrl();
    this.registerService.url = this.urlService.getUrl();
    this.serviceService.url = this.urlService.getUrl();
    this.userService.url = this.urlService.getUrl();
  }

  initializeForm(): FormGroup {
    return this.formBuilder.group({
      username: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9áéíóúÁÉÍÓÚ\s]+$/), Validators.minLength(6)]],
      password: ['', [Validators.required, Validators.pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/), Validators.minLength(8)]]
    });
  }

  onSubmit(): void {
    this.loadingIndicatorService.showLoadingIndicator();
    let user: Login = {
      username: this.loginForm.value.username,
      password: this.loginForm.value.password
    }

    this.loginService.generateToken(user).subscribe(
      (response: any) => {
        this.loadingIndicatorService.hideLoadingIndicator();
        if (response.token != null) {
          this.loginService.login(response.token);
          this.loginService.getCurrentUser().subscribe(
            (res: any) => {
              console.log('res ', res.authorities[0].authority);
              if (res.authorities[0].authority === 'ROLE_EMPLOYEE' || res.authorities[0].authority === 'ROLE_ADMIN') {
                this.loadingIndicatorService.hideLoadingIndicator();
                Swal.fire({
                  icon: 'success',
                  title: 'Bienvenido',
                  text: 'Has iniciado sesión correctamente',
                  showConfirmButton: false,
                  timer: 1500
                });
                this.router.navigate(['/dashboard']);
              } else if (res.authorities[0].authority === 'ROLE_INVITED') {
                this.loadingIndicatorService.hideLoadingIndicator();
                Swal.fire({
                  icon: 'error',
                  text: 'No has validado tu cuenta'
                });
                this.getEmailByUsername(this.loginForm.value.username);
                this.router.navigate(['/registro2']);
              } else if (res.authorities[0].authority === 'ROLE_USER') {
                Swal.fire({
                  icon: 'warning',
                  title: 'No tienes permisos para acceder',
                  text: 'Contacta con el administrador',
                  showConfirmButton: true,
                });
                this.loginService.deleteToken();
              }
            },
            (error: any) => {
              this.loadingIndicatorService.hideLoadingIndicator();
              console.log('error ', error);
            }
          );
        } else {
          Swal.fire({
            icon: 'error',
            text: 'Contraseña incorrecta'
          });
        }
      },
      (error: any) => {
        this.loadingIndicatorService.hideLoadingIndicator();
        console.log('error ', error);
        Swal.fire({
          icon: 'error',
          text: 'Usuario inexistente'
        });
      }
    );
  }

  /* login() {
    this.loadingIndicatorService.showLoadingIndicator();
    this.loginService.login(this.loginForm.value).subscribe(() => {
      this.loadingIndicatorService.hideLoadingIndicator();
      this.loginService.setLoggedState("true"),
      this.router.navigate(['/dashboard'])
    }, (error: any) => {
      this.loadingIndicatorService.hideLoadingIndicator();
      console.log('error ', error);
      Swal.fire({
        icon: 'error',
        text: 'Usuario inexistente'
      });
    });
  } */

  logout() {
    console.log(this.loginService.logout());
  }


  getEmailByUsername(username: String) {
    this.loginService.getEmailUser(username).subscribe(
      (res: any) => {
        localStorage.setItem('email', res.email);
      },
      (error: any) => {
        console.log('error email ', error);
      }
    );
  }
}  
