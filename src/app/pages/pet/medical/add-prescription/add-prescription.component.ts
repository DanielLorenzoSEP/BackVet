import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSelectChange } from '@angular/material/select';
import { ActivatedRoute, Router } from '@angular/router';
import { parse } from 'date-fns';
import { PetService } from 'src/app/services/pet.service';
import { SpinnerService } from 'src/app/services/spinner.service';
import Swal from 'sweetalert2';

interface MedicineDTO {
  medicines: [{ id: number }];
  dose: string;
  via: string;
  interval: string;
}

interface Diagnosis {
  symtomps: string,
  diagnosis: string,
  status: string,
  creationDate: string,
  observations: string,
  doctors: [{ id: number }],
  pet: { id: number },
  relations: any
};

@Component({
  selector: 'app-add-prescription',
  templateUrl: './add-prescription.component.html',
  styleUrls: ['./add-prescription.component.css']
})
export class AddPrescriptionComponent implements OnInit {

  symptomInput: string = '';
  symptoms: string[] = [];
  petId!: number;
  tempId!: number;
  doctors: any[] = [];
  medicines: any[] = [];
  listMedicines: any[] = [];
  listMedicinesIds = new Array();
  listMedicinesDTO: MedicineDTO[] = [];
  hasMedicine: boolean = false;

  prescriptionForm!: FormGroup;
  medicineForm!: FormGroup;

  symptomOptions: string[] = [
    'Diarrea',
    'Vómitos',
    'Fiebre',
    'Tos',
    'Estornudos',
    'Pérdida de apetito',
    'Letargia',
    'Picazón',
    'Dificultad para respirar',
    'Dolor abdominal',
    'Cojera',
    'Convulsiones',
    'Secreción nasal',
    'Problemas de comportamiento',
    'Otros',
  ];


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private petService: PetService,
    private spinnerService: SpinnerService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.petId = params['id'] || null;
    });
    this.tempId = parseInt(this.petId.toString(), 10);
    console.log(typeof this.tempId);
    this.getDoctors();
    this.getMedicines();
    this.prescriptionForm = this.initializeForm();
    this.medicineForm = this.initializeMedicineForm();
  }

  initializeForm(): FormGroup {
    return this.formBuilder.group({
      symptom: ['', Validators.required],
      diagnosis: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9áéíóúÁÉÍÓÚÑñ\s]+$/), Validators.minLength(6)]],
      observations: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9áéíóúÁÉÍÓÚÑñ\s,]+$/), Validators.minLength(8)]],
      doctor: ['', Validators.required]
    });
  }

  initializeMedicineForm(): FormGroup {
    return this.formBuilder.group({
      medicine: ['', Validators.required],
      dose: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9áéíóúÁÉÍÓÚÑñ\s]+$/)]],
      via: ['', Validators.required],
      interval: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9áéíóúÁÉÍÓÚÑñ\s]+$/)]]
    });
  }

  addSymptom(event: Event) {
    event.preventDefault(); // Evita que el formulario se envíe si está dentro de un formulario
    this.symptomInput = this.prescriptionForm.value.symptom;

    if (this.symptomInput.trim() !== '') {
      this.symptoms.push(this.symptomInput);
      this.symptomInput = '';
      this.prescriptionForm.get('symptom')?.reset(); // Resetea el valor del campo de síntomas en el formulario
      this.prescriptionForm.patchValue({ symptom: '' });
    }

  }

  removeSymptom(symptom: string) {
    this.symptoms = this.symptoms.filter(s => s !== symptom);
  }

  getMedicines() {
    this.spinnerService.showLoadingIndicator();
    this.petService.getMedicines().subscribe(
      (res: any) => {
        this.spinnerService.hideLoadingIndicator();
        this.medicines = res;
        console.log(this.medicines);
      },
      (err: any) => {
        this.spinnerService.hideLoadingIndicator();
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Ha ocurrido un error al cargar los medicamentos',
          confirmButtonText: 'Aceptar'
        })
      }
    );
  }

  getDoctors() {
    this.spinnerService.showLoadingIndicator();
    this.petService.getDoctors().subscribe(
      (res: any) => {
        this.spinnerService.hideLoadingIndicator();
        this.doctors = res;
        console.log(this.doctors);
      },
      (err: any) => {
        this.spinnerService.hideLoadingIndicator();
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Ha ocurrido un error al cargar los doctores',
          confirmButtonText: 'Aceptar'
        })
      }
    );
  }

  medicinesForm() {
    console.log(this.medicineForm.value);
    /* this.medicines.forEach((medicine: any) => {
      if (medicine.id === this.medicineForm.value.medicine) {
        this.medicines = this.medicines.filter(m => m.id !== medicine.id);
        this.listMedicines[this.listMedicines.length - 1].medicine = medicine;
      }
    }); */
    this.listMedicines.push(this.medicineForm.value);
    console.log(this.listMedicines);
    this.medicineForm.reset();
    this.hasMedicine = true;
  }

  submitForm() {

    this.spinnerService.showLoadingIndicator();
    this.listMedicinesDTO = [];
    const uniqueMedicineIds = new Set<number>();
    let successfulRelationsCount = 0;

    this.listMedicines.forEach((medicine: any) => {
      const medicineId = medicine.medicine;
      console.log(medicineId);

      if (!uniqueMedicineIds.has(medicineId)) {
        this.listMedicinesDTO.push({
          medicines: [{ id: medicineId.id }],
          dose: medicine.dose,
          via: medicine.via,
          interval: medicine.interval
        });

        uniqueMedicineIds.add(medicineId);
      }
      console.log(this.listMedicinesDTO);
    });

    const currentDate = new Date();
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
    const day = currentDate.getDate().toString().padStart(2, '0');
    const year = currentDate.getFullYear();

    let date: string = `${day}-${month}-${year}`;

    const symptomsArray = this.prescriptionForm.value.symptom.toString().split(',');
    const formattedSymptoms = symptomsArray.join(', ');

    let diagnosis: Diagnosis = {
      symtomps: formattedSymptoms,
      diagnosis: this.prescriptionForm.value.diagnosis,
      status: 'status',
      creationDate: date,
      observations: this.prescriptionForm.value.observations,
      doctors: [{ id: this.prescriptionForm.value.doctor }],
      pet: { id: this.tempId },
      relations: this.listMedicinesIds.map(m => m)
    };

    console.log(diagnosis);

    this.listMedicinesDTO.forEach((medicine: any, index: number) => {
      this.petService.createRelation(medicine).subscribe(
        (res: any) => {
          console.log(res);
          diagnosis.relations.push({ id: res.id });
          successfulRelationsCount++;
          if (successfulRelationsCount === this.listMedicinesDTO.length) {
            this.petService.createPrescription(diagnosis).subscribe(
              (res: any) => {
                Swal.fire({
                  icon: 'success',
                  title: 'Diagnóstico creado',
                  text: 'El diagnóstico se ha creado correctamente',
                  showConfirmButton: false,
                  timer: 2000
                });
                this.spinnerService.hideLoadingIndicator();
                this.router.navigate([`/dashboard/pet/${this.petId}`]);
              },
              (err: any) => {
                this.spinnerService.hideLoadingIndicator();
                Swal.fire({
                  icon: 'error',
                  title: 'Error',
                  text: 'Ha ocurrido un error al crear el diagnóstico',
                  confirmButtonText: 'Aceptar'
                })
              }
            );
          }
        },
        (err: any) => {
          console.log(err);
        }
      );
    })

  }

  goBack() {
    this.location.back();
  }
  
}
