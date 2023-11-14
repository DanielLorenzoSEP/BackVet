import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { LoginService } from './login.service';
import { UrlService } from './url.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

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

  recoverPassword(email: string) {

    let emailData = {
      username: null,
      email: email
    }

    return this.http.post(`${this.url}/email/recover`, emailData);
  }

  validate(code: any) {

    const codeData = {
      email: code.email,
      code: code.code
    }

    return this.http.post(`${this.url}/email/validate`, codeData);
  }

  changePassword(email: string, password: string) {

    const passwordData = {
      email: email,
      password: password
    }

    console.log(passwordData);

    return this.http.put(`${this.url}/update`, passwordData);
  }

  getAllUsers() {

    return this.http.get(`${this.url}/`, { headers: this.getHeadersViaCookie() });
  }

  getUserByRole(role: string) {

    return this.http.get(`${this.url}/roles/${role}`, { headers: this.getHeadersViaCookie() });
  }

  getUserByUsername(username: string) {

    return this.http.get(`${this.url}/user/username/${username}`, { headers: this.getHeadersViaCookie() });
  }

  getUserByEmail(email: string) {

    return this.http.get(`${this.url}/user/email/${email}`, { headers: this.getHeadersViaCookie() });
  }

  getUserByPhone(phone: string) {

    return this.http.get(`${this.url}/user/phone/${phone}`, { headers: this.getHeadersViaCookie() });
  }

  createClient(user: any) {

    const currentDate = new Date();
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
    const day = currentDate.getDate().toString().padStart(2, '0');
    const year = currentDate.getFullYear();

    let date: string = `${day}-${month}-${year}`;

    const userData = {
      email: user.email,
      phone: user.phone,
      direction: user.city + '  ' + user.municipality + '  ' + user.street,
      username: user.username,
      password: 'passwordClient',
      createdAt: date,
      roles: ["CLIENT"]
    }

    return this.http.post(`${this.url}/createuser`, userData, { headers: this.getHeadersViaCookie() });
  }

  updateUser(userData: any) {

    return this.http.put(`${this.url}/update/user`, userData, { headers: this.getHeadersViaCookie() });
  }

  deleteUser(id: number) {

    return this.http.delete(`${this.url}/deleteuser/${id}`, { headers: this.getHeadersViaCookie() });
  }

  updateToEmployee(user: any) {

    const userData = {
      id: user.id,
      email: user.email,
      phone: user.phone,
      address: user.direction,
      username: user.username
    }

    return this.http.put(`${this.url}/updatetoemployee`, userData, { headers: this.getHeadersViaCookie() });
  }

  updateToUser(user: any) {

    const userData = {
      id: user.id,
      email: user.email,
      phone: user.phone,
      address: user.direction,
      username: user.username
    }

    return this.http.put(`${this.url}/updatetouser`, userData, { headers: this.getHeadersViaCookie() });
  }
}
