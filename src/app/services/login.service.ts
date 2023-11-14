import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { UrlService } from './url.service';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(
    private http: HttpClient,
    private cookieService: CookieService,
    private urlService: UrlService
  ) { }

  url: string = this.urlService.getUrl();

  generateToken(user: any) {
    return this.http.post(`${this.url}/auth/login`, user);
  }

  login(token: any) {
    this.cookieService.set('token', token);
  }

  isLoggedIn() {
    let token = this.cookieService.get('token');
    if (token == undefined || token == '' || token == null) {
      return false;
    } else {
      return true;
    }
  }

  logout() {
    this.deleteToken();
    return true;
  }

  deleteToken() {
    this.cookieService.delete('token');
  }

  getToken() {
    return this.cookieService.get('token');
  }

  setUser(user: any) {
    localStorage.setItem('user', JSON.stringify(user));
  }

  getUser() {
    let userStr = localStorage.getItem('user');
    if (userStr != null) {
      return JSON.parse(userStr);
    } else {
      this.logout();
      return null;
    }
  }

  getUserRole() {
    let user = this.getUser();
    return user.authorities[0].authority;
  }

  getCurrentUser() {

    const headers = {
      'Authorization': `Bearer ${this.cookieService.get('token')}`
    }

    return this.http.get(`${this.url}/actual`, { headers });
  }

  getEmailUser(username: String) {
    return this.http.get(`${this.url}/actualuser/${username}`);
  }

  usernameExists(username: String) {
    return this.http.get(`${this.url}/exists/username/${username}`);
  }

  emailExists(email: String) {
    return this.http.get(`${this.url}/exists/email/${email}`);
  }

  phoneExists(phone: String) {
    return this.http.get(`${this.url}/exists/phone/${phone}`);
  }
}
