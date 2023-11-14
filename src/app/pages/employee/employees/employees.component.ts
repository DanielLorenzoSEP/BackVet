import { Location } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { SpinnerService } from 'src/app/services/spinner.service';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.css']
})
export class EmployeesComponent implements OnInit {

  usuarios: any[] = [];
  anotherUsers: any[] = [];
  toggle!: boolean;

  displayedColumns: string[] = ['id', 'username', 'email', 'phone', 'rol', 'actions'];
  dataSource = new MatTableDataSource<any>(this.usuarios);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private userService: UserService,
    private router: Router,
    private localion: Location,
    private spinner: SpinnerService
  ) { }

  ngOnInit(): void {
    this.spinner.showLoadingIndicator();
    this.getUsers();
  }

  getUsers() {
    this.userService.getUserByRole("EMPLOYEE").subscribe(
      (res: any) => {
        this.anotherUsers = res;
        this.getUserByRole("USER");
      },
      err => {
        this.spinner.hideLoadingIndicator();
        console.log(err);
      }
    );
  }
  
  getUserByRole(role: string) {
    this.userService.getUserByRole(role).subscribe(
      (res: any) => {
        this.spinner.hideLoadingIndicator();
        if (role === "USER") {
          this.usuarios = res;
        } else if (role === "EMPLOYEE") {
          this.anotherUsers = res;
        }
        this.updateDataSource();
        console.log(this.usuarios);
      },
      err => {
        this.spinner.hideLoadingIndicator();
        console.log(err);
      }
    );
  }

  updateDataSource() {
    this.usuarios = [];
    this.usuarios = [...this.usuarios, ...this.anotherUsers];
    this.dataSource.data = [...this.usuarios]; // Actualiza la fuente de datos de la tabla
  }

  setPermission(event: MatSlideToggleChange, user: any) {
    Swal.fire({
      title: '¿Está seguro?',
      text: `¿Está seguro que desea darle permisos de empleado a ${user.username}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, cambiar',
      cancelButtonText: 'No, cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.spinner.showLoadingIndicator();
        this.userService.updateToEmployee(user).subscribe(
          res => {
            this.spinner.hideLoadingIndicator();
            user.roles[0].name = 'EMPLOYEE';
            this.updateDataSource();
            console.log(res);
          },
          err => {
            this.spinner.hideLoadingIndicator();
            console.log(err);
          }
        )
      }
      event.source.checked = false;
    })
  }

  removePermission(event: MatSlideToggleChange, user: any) {
    Swal.fire({
      title: '¿Está seguro?',
      text: `¿Está seguro que desea quitarle los permisos de empleado a ${user.username}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, cambiar',
      cancelButtonText: 'No, cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.spinner.showLoadingIndicator();
        this.userService.updateToUser(user).subscribe(
          res => {
            this.spinner.hideLoadingIndicator();
            user.roles[0].name = 'USER';
            this.updateDataSource();
            console.log(res);
          },
          err => {
            this.spinner.hideLoadingIndicator();
            console.log(err);
          }
        )
      }
      event.source.checked = true;
    })
  }

  togglePermission(event: MatSlideToggleChange, user: any) {
    if (user.roles[0].name === 'EMPLOYEE') {
      this.removePermission(event, user);
    } else if (user.roles[0].name === 'USER') {
      this.setPermission(event, user);
    }
  }

  /* private updateDataSource() {
    this.dataSource.data = [...this.usuarios]; // Actualiza la fuente de datos de la tabla
  } */

  isChecked(user: any) {
    return user.roles[0].name == "EMPLOYEE";
  }

  goBack() {
    this.localion.back();
  }

}
