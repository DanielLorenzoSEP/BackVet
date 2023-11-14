import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UrlService } from '../services/url.service';

export const urlGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const url = inject(UrlService);
  if (url.getUrl() !== '') {
    return true;
  } else {
    router.navigate(['']);
    return false;
  }
};
