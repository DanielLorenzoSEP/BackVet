import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { LoginService } from './login.service';
import { UrlService } from './url.service';

@Injectable({
  providedIn: 'root'
})
export class PetService {

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

  getPetsByUserId(id: number) {

    return this.http.get(`${this.url}/pets/user/${id}`, { headers: this.getHeadersViaCookie() });
  }

  addPet(pet: any) {

    const Pet = {
      name: pet.name,
      sex: pet.sex,
      birthdate: pet.birthdate,
      specie: pet.specie,
      race: pet.race,
      weight: pet.weight,
      userId: pet.user
    }

    console.log(Pet);

    return this.http.post(`${this.url}/pets/`, Pet, { headers: this.getHeadersViaCookie() });
  }

  deletePet(id: number) {

    return this.http.delete(`${this.url}/pets/${id}`, { headers: this.getHeadersViaCookie() });
  }

  getPetById(id: number) {

    return this.http.get(`${this.url}/pets/${id}`, { headers: this.getHeadersViaCookie() });
  }

  getAllPets() {

    return this.http.get(`${this.url}/pets/`, { headers: this.getHeadersViaCookie() });
  }

  getPetsWithUser() {

    return this.http.get(`${this.url}/pets/users`, { headers: this.getHeadersViaCookie() });
  }

  getOnlyUser(id: number) {

    return this.http.get(`${this.url}/user/pet/${id}`, { headers: this.getHeadersViaCookie() });
  }

  updatePet(pet: any) {

    return this.http.put(`${this.url}/pets/`, pet, { headers: this.getHeadersViaCookie() });
  }

  getDoctors() {

    return this.http.get(`${this.url}/medical/doctor`, { headers: this.getHeadersViaCookie() });
  }

  getMedicines() {

    return this.http.get(`${this.url}/medical/medicine`, { headers: this.getHeadersViaCookie() });
  }

  createPrescription(prescription: any) {

    return this.http.post(`${this.url}/medical/prescription`, prescription, { headers: this.getHeadersViaCookie() });
  }

  getDoctorPrescriptions(id: number) {

    return this.http.get(`${this.url}/medical/prescription/doctor/${id}`, { headers: this.getHeadersViaCookie() });
  }

  deletePrescription(id: number) {

    return this.http.delete(`${this.url}/medical/prescription/${id}`, { headers: this.getHeadersViaCookie() });
  }

  getPrescriptionById(id: number) {

    return this.http.get(`${this.url}/medical/prescription/${id}`, { headers: this.getHeadersViaCookie() });
  }

  getMedicineByName(name: string) {

    return this.http.get(`${this.url}/medical/medicine/${name}`, { headers: this.getHeadersViaCookie() });
  }

  createRelation(relation: any) {

    return this.http.post(`${this.url}/medical/relation`, relation, { headers: this.getHeadersViaCookie() });
  }

  countSpecies() {

    return this.http.get(`${this.url}/dashboard/pets`, { headers: this.getHeadersViaCookie() });
  }

  countMedicines() {

    return this.http.get(`${this.url}/medical/count`, { headers: this.getHeadersViaCookie() });
  }
}
