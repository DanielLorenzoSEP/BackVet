import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PetService } from 'src/app/services/pet.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-medical',
  templateUrl: './add-medical.component.html',
  styleUrls: ['./add-medical.component.css']
})
export class AddMedicalComponent implements OnInit {

  symptomInput: string = '';
  symptoms: string[] = [];
  petI!: number;

  addSymptom() {
    if (this.symptomInput.trim() !== '') {
      this.symptoms.push(this.symptomInput);
      this.symptomInput = '';
    }
  }

  removeSymptom(symptom: string) {
    this.symptoms = this.symptoms.filter(s => s !== symptom);
  }

  diagnosis: any = {
    reason: '',
    diagnosis: '',
    treatment: '',
    observations: '',
    status: '',
    pet: {
      id: this.petI
    }
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private petService: PetService
    ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.petI = this.diagnosis.pet.id = params['id'] || null;
    });
  }

  submitForm() {
    this.diagnosis.reason = this.symptoms.join(', ');
    this.diagnosis.pet.id = this.petI;
    /* this.petService.createMedicalHistory(this.diagnosis).subscribe(
      (res: any) => {
        Swal.fire({
          icon: 'success',
          title: 'Diagnóstico creado',
          text: 'El diagnóstico se ha creado correctamente',
          showConfirmButton: false,
          timer: 2000
        });
        this.router.navigate([`/dashboard/pet/${this.petI}`]);
      },
      (err: any) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Ha ocurrido un error al crear el diagnóstico',
          confirmButtonText: 'Aceptar'
        })
      }
    ); */
    console.log(this.diagnosis);
  }

}
