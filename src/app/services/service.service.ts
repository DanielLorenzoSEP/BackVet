import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { LoginService } from './login.service';
import { UrlService } from './url.service';

@Injectable({
  providedIn: 'root'
})
export class ServiceService {

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

  getServices() {
    return this.http.get(`${this.url}/service/`, { headers: this.getHeadersViaCookie() });
  }

  getServiceById(id: any) {
    return this.http.get(`${this.url}/service/${id}`, { headers: this.getHeadersViaCookie() });
  }

  addService(service: any) {
    return this.http.post(`${this.url}/service/`, service, { headers: this.getHeadersViaCookie() });
  }

  deleteService(id: any) {
    return this.http.delete(`${this.url}/service/${id}`, { headers: this.getHeadersViaCookie() });
  }

  updateService(service: any) {
    return this.http.put(`${this.url}/service/`, service, { headers: this.getHeadersViaCookie() });
  }

  countServices() {
    return this.http.get(`${this.url}/service/count`, { headers: this.getHeadersViaCookie() });
  }
}
