import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/services/login.service';
import { SpinnerService } from 'src/app/services/spinner.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements  OnInit{
  
  title = 'veterinaria';
  isLoading: boolean = false;
  isDrawerOpen: boolean = false;
  showEmployees: boolean = false;

  constructor(
    private loadingIndicatorService: SpinnerService,
    private router: Router,
    private loginService: LoginService
  ) {
    this.loadingIndicatorService.loadingState$.subscribe(isLoading => {
      this.isLoading = isLoading;
    });
  }
  ngOnInit(): void {
    this.getRole();
  }

  toggleDrawer() {
    this.isDrawerOpen = !this.isDrawerOpen;
  }

  close(rout: string): void {
    this.router.navigate(['dashboard/'+rout]);
    this.toggleDrawer();
  }

  getRole(): void {
    this.loginService.getCurrentUser().subscribe(
      (res: any) => {
        console.log(res.authorities[0].authority);
        if (res.authorities[0].authority == 'ROLE_ADMIN') {
          this.showEmployees = true;
        }
        console.log(this.showEmployees);
      }
    );
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
}
