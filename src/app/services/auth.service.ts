import { Injectable, Injector, OnInit } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})

export class AuthService {

  url: string = "http://localhost:8080/api/";

  constructor(private http: HttpClient, private injector: Injector, private router: Router) {
  }

  setToken(key: string, value: any) {
    localStorage.setItem(key, value);
  }

  getToken(key: string) {
    return localStorage.getItem(key);
  }

  removeToken(key: string) {
    localStorage.removeItem(key);
  }

  logout() {
    setTimeout(() => {
      sessionStorage.clear();
      localStorage.clear();
      this.router.navigate(['/auth/login']);
    }, 3000);
  }

  callAPI(type: string, url: string, body: any) {
    return this.http.request(type, `${this.url}${url}`,
      { body, observe: 'response', reportProgress: true })
      .pipe(
        catchError(this.handleError));
  }

  GetResponse(data: any, toaster: boolean = true) {
    console.log("data", data);
    if (data.body !== undefined) {
      if (data.body.success) {
        if (toaster) {
          this.alertPopUp('success', data.body.message);
        }
        return data.body;
        // return JSON.parse(atob(data.body.data), function (prop, value) {
        //   var lower = prop.charAt(0).toLowerCase() + prop.substring(1);
        //   if (prop === lower) return value;
        //   else this[lower] = value;
        // });
      } else if (!data.body.success) {
        if (toaster) {
          this.alertPopUp('warning', data.body.message);
        }
        return data.body;
        // return JSON.parse(atob(data.body.data), function (prop, value) {
        //   var lower = prop.charAt(0).toLowerCase() + prop.substring(1);
        //   if (prop === lower) return value;
        //   else this[lower] = value;
        // });
      }
      else {
        if (toaster) {
          this.alertPopUp('warning', data.body.message);
        }
        return data.body;
        // return JSON.parse(atob(data.body.data), function (prop, value) {
        //   var lower = prop.charAt(0).toLowerCase() + prop.substring(1);
        //   if (prop === lower) return value;
        //   else this[lower] = value;
        // });
      }
    }
  }

  handleError = (error: HttpErrorResponse) => {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    this.alertPopUp('error', error.error.message);
    if (error.error.statusCode === 403 || error.error.statusCode === 401) {
      this.logout();
    }
    return throwError(errorMessage);
  }

  alertPopUp(type: any, title: string) {
    Swal.fire({
      position: 'center',
      icon: type,
      title: title,
      showConfirmButton: false,
      timer: 3000
    });
  }
}
