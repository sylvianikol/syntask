import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { exhaustMap, take } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';

const baseUrl = 'http://localhost:8080/tasks';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  getAll(params: any): Observable<any> {
    // take(n) only takes n values from the observable
    // and automatically unsubscribes

    // exhaustMap() waits for the 1st observable to complete,
    // which will happen after take(n)
    return this.authService.user.pipe(
      take(1), 
      exhaustMap(user => {
        return this.http.get(
          `${baseUrl}?userId=${user.id}&${this.requestParams(params)}`, 
          this.requestOptions(user.token!));
      })
    );
  }

  get(id: string): Observable<any> {
    return this.authService.user.pipe(
      take(1), 
      exhaustMap(user => {
        return this.http.get(`${baseUrl}/${id}`, this.requestOptions(user.token!));
      })
    );
  }

  create(data: any): Observable<any> {
    return this.authService.user.pipe(
      take(1), 
      exhaustMap(user => {
        return this.http.post(`${baseUrl}/add`, data, this.requestOptions(user.token!));
      })
    );
  }

  update(taskId: string, data: any): Observable<any> {
    return this.authService.user.pipe(
      take(1), 
      exhaustMap(user => {
        return this.http.post(`${baseUrl}/${taskId}`, data, this.requestOptions(user.token!));
      })
    );
  }

  delete(id: string): Observable<any> {
    return this.authService.user.pipe(
      take(1), 
      exhaustMap(user => {
        return this.http.delete(`${baseUrl}/${id}`, this.requestOptions(user.token!));
      })
    ); 
  }

  deleteAll(): Observable<any> {
    return this.authService.user.pipe(
      take(1), 
      exhaustMap(user => {
        return this.http.delete(`${baseUrl}?userId=${user.id}`, this.requestOptions(user.token!));
      })
    ); 
  }

  findByTitle(title: any): Observable<any> {
    return this.http.get(`${baseUrl}?title=${title}`);
  }

  private requestParams(params: any) {
    const title = params[`title`];
    const page = params[`page`];
    const size = params[`size`];

    if (!params) return '';
    
    if (title && page && size) {
      return `title=${title}&page=${page}&size=${size}`;
    }

    return `page=${page}&size=${size}`;
  }

  private requestOptions(token: string) {

    const headerDict = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, PUT, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With',
      'Authorization': 'Bearer ' + token,
    }
    
    return {                                                                                                                                                                                 
      headers: new HttpHeaders(headerDict), 
    };
  }
}
