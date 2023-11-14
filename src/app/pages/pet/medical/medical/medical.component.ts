import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PetService } from 'src/app/services/pet.service';
import { SpinnerService } from 'src/app/services/spinner.service';

@Component({
  selector: 'app-medical',
  templateUrl: './medical.component.html',
  styleUrls: ['./medical.component.css']
})
export class MedicalComponent implements OnInit{

  medical: any = {};

  constructor(
    private petService: PetService,
    private spinner: SpinnerService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.getMedicalHistory();
  }

  getMedicalHistory() {
    this.spinner.showLoadingIndicator();
    /* this.petService.getMedicalHistoriesById(this.route.snapshot.paramMap.get('id')!).subscribe(
      (res: any) => {
        this.spinner.hideLoadingIndicator();
        this.medical = res;
        console.log(res);
      },
      (err: any) => {
        this.spinner.hideLoadingIndicator();
        console.log(err);
      }
    ); */
  }

}
