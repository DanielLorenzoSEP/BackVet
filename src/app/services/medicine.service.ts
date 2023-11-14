import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { LoginService } from './login.service';
import { UrlService } from './url.service';

@Injectable({
  providedIn: 'root'
})
export class MedicineService {

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

  getMedicines() {

    const headers = this.getHeadersViaCookie();

    return this.http.get(`${this.url}/medical/medicine`, { headers });
  }

  getMedicineById(id: any) {

    const headers = this.getHeadersViaCookie();

    return this.http.get(`${this.url}/medical/medicine/id/${id}`, { headers });
  }

  createMedicine(medicine: any) {

    const headers = this.getHeadersViaCookie();

    return this.http.post(`${this.url}/medical/medicine`, medicine, { headers });
  }

  deleteMedicine(id: any) {

    const headers = this.getHeadersViaCookie();

    return this.http.delete(`${this.url}/medical/medicine/delete/${id}`, { headers });
  }

  updateMedicine(medicine: any) {

    const headers = this.getHeadersViaCookie();

    return this.http.put(`${this.url}/medical/medicine`, medicine, { headers });
  }
}
