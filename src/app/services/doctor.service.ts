import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { LoginService } from './login.service';
import { UrlService } from './url.service';

@Injectable({
  providedIn: 'root'
})
export class DoctorService {

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

  getDoctors() {

    return this.http.get(`${this.url}/medical/doctor`, { headers: this.getHeadersViaCookie() });
  }

  getDoctorById(id: number) {

    return this.http.get(`${this.url}/medical/doctor/${id}`, { headers: this.getHeadersViaCookie() });
  }

  createDoctor(doctor: any) {

    return this.http.post(`${this.url}/medical/doctor`, doctor, { headers: this.getHeadersViaCookie() });
  }

  deleteDoctor(id: number) {

    return this.http.delete(`${this.url}/medical/doctor/${id}`, { headers: this.getHeadersViaCookie() });
  }

  updateDoctor(doctor: any) {

    return this.http.put(`${this.url}/medical/doctor`, doctor, { headers: this.getHeadersViaCookie() });
  }
}
