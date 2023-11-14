import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SpinnerService {

  private loadingSubject = new Subject<boolean>();

  loadingState$ = this.loadingSubject.asObservable();

  showLoadingIndicator() {
    this.loadingSubject.next(true);
    
  }

  hideLoadingIndicator() {
    this.loadingSubject.next(false);
  }
}
