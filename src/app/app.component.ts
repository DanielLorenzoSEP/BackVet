import { Component, OnInit } from '@angular/core';
import { SpinnerService } from './services/spinner.service';
import { Router } from '@angular/router';
/* import { environment } from 'src/environments/environment'; */
import { environment } from 'src/environments/environment.development';
import { UrlService } from './services/url.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'veterinaria';
  isLoading: boolean = false;
  isDrawerOpen!: boolean;

  constructor(
    private loadingIndicatorService: SpinnerService,
    private router: Router,
    private urlService: UrlService,
  ) {
    this.loadingIndicatorService.loadingState$.subscribe(isLoading => {
      this.isLoading = isLoading;
    });
  }

  ngOnInit(): void {
    if (localStorage.getItem('veterinary') === null) {
      localStorage.setItem('veterinary', '');
    }
    this.urlService.checkUrl();
  }

  close(rout: string): void {
    this.router.navigate([rout]);
    /* this.interfazService.toggleDrawer(); */
  }
}
