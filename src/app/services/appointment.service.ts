import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';
import { LoginService } from './login.service';
import { UrlService } from './url.service';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {

  constructor(
    private http: HttpClient,
    private urlService: UrlService,
    private cookieService: CookieService
  ) { }

  url: string = this.urlService.getUrl();

  getHeadersViaCookie() {
    const headers = {
      'Authorization': `Bearer ${this.cookieService.get('token')}`
    }
    return headers;
  }

  getAppointments() {

    return this.http.get(`${this.url}/appointment/all`, { headers: this.getHeadersViaCookie() });
  }

  getAppointmentsAny(): Observable<any[]> {

    return this.http.get<any[]>(`${this.url}/appointment/all`, { headers: this.getHeadersViaCookie() });
  }

  createAppointment(appointment: any) {

    return this.http.post(`${this.url}/appointment/`, appointment, { headers: this.getHeadersViaCookie() });
  }

  updateStatus(id: number, status: string) {

    const body = {
      id: id,
      status: status
    }

    return this.http.put(`${this.url}/appointment/status`, body, { headers: this.getHeadersViaCookie() });
  }

  getAppointmentById(id: number) {

    return this.http.get(`${this.url}/appointment/${id}`, { headers: this.getHeadersViaCookie() });
  }

  getAppointmentWithUserAndPet(id: number) {

    return this.http.get(`${this.url}/appointment/all/${id}`, { headers: this.getHeadersViaCookie() });
  }

  updateAppointment(appointment: any) {

    return this.http.put(`${this.url}/appointment/update`, appointment, { headers: this.getHeadersViaCookie() });
  }

  deleteAppointment(id: number) {
      
      return this.http.delete(`${this.url}/appointment/${id}`, { headers: this.getHeadersViaCookie() });
    }
}
