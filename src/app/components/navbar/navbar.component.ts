import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { DashboardComponent } from 'src/app/pages/dashboard/dashboard.component';
import { LoginService } from 'src/app/services/login.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {

  showNavbar: boolean = false;
  veterinary: string = localStorage.getItem('veterinary') || '';

  constructor(
    private loginService: LoginService,
    private router: Router,
    private dashboard: DashboardComponent,
    private cookieService: CookieService
  ) { }

  toggleSideBar() {
    this.dashboard.isDrawerOpen = !this.dashboard.isDrawerOpen;
    this.showNavbar = !this.showNavbar;
  }

  closeSideBar() {
    this.dashboard.isDrawerOpen = false;
    this.showNavbar = false;
  }

  logout() {
    Swal.fire({
      title: "¿Deseas cerrar sesión?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, cerrar sesión',
      cancelButtonText: 'No, cancelar',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33'
    }).then((result: any) => {
      if (result.isConfirmed) {
        this.loginService.logout();
        this.router.navigate(['/login']);
      }
    })
  }

  goDashboard() {
    this.router.navigate(['dashboard'])
  }
}
