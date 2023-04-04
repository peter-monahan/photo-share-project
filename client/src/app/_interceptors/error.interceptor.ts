import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { catchError, Observable } from 'rxjs';
import { NavigationExtras, Router } from '@angular/router';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(private router: Router) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if(error){
          // console.log(error);
          switch (error.status) {
            case 400:
              if(error.error.errors) {
                const modelStateErrors = [];
                for (const key in error.error.errors) {
                  if(error.error.errors[key]) {
                    modelStateErrors.push(error.error.errors[key]);
                  }
                }
                throw modelStateErrors.flat();
              } else {
                alert(`${error.error}, ${error.status}`);
                break;
              }
            case 401:
              alert(`Unathorised, ${error.status}`);
              break;
            case 404:
              this.router.navigateByUrl('/not-found');
              break;
            case 500:
              const navigationExtras: NavigationExtras = {state: {error: error.error}};
              this.router.navigateByUrl("/server-error", navigationExtras);
              break;
            default:
              alert("something went wrong");
              console.log(error);
              break;
          }

        }
        throw error;
      })
    )
  }
}
