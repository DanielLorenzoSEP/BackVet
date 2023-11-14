import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

interface Url {
  url: string;
  name: string;
}

@Injectable({
  providedIn: 'root'
})
export class UrlService {

  constructor(
    private router: Router
  ) { }

  checkUrl(): void {
    console.log(this.getUrl());
    if (this.getUrl() === '' || this.getUrl() === undefined) {
      console.log('no hay url');
      localStorage.setItem('veterinary', '');
      this.router.navigate(['']);

    } else {
      console.log('hay url');
      const name = localStorage.getItem('veterinary');
      this.setUrl(this.veterinaries.find(veterinary => veterinary.name === name));
    }
  }

  veterinaries: any[] = [
    { url: 'https://spring-vet-production.up.railway.app', name: 'Veterinaria 1' },
    { url: 'https://spring-vet-production-f8a0.up.railway.app', name: 'Veterinaria 2' },
    { url: 'http://localhost:8080', name: 'Veterinaria 3' }
  ];

  url: Url = {} as Url;

  setUrl(url: any) {
    this.url = url;
  }

  getUrl(): string {
    return this.url.url;
  }

}
