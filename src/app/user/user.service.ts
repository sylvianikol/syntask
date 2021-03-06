import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { exhaustMap, take } from 'rxjs/operators';

import { AuthService } from "../auth/auth.service";

const baseUrl = 'http://localhost:8080/users';

@Injectable({ providedIn: 'root' })
export class UserService {
    
    constructor(
        private http: HttpClient,
        private authService: AuthService
    ) {}
    
    getAll(params: any): Observable<any> { 
        
        return this.authService.user.pipe(
            take(1), 
            exhaustMap(user => {
                return this.http.get(
                    `${baseUrl}?${this.requestParams(params)}`, 
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
    
    update(id: string, data: any): Observable<any> {
        return this.authService.user.pipe(
            take(1), 
            exhaustMap(user => {
                return this.http.post(`${baseUrl}/${id}`, data, this.requestOptions(user.token!));
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
    
    findByUsername(username: any): Observable<any> {
        return this.http.get(`${baseUrl}?username=${username}`);
    }
    
    private requestParams(params: any) {
        const username = params[`username`];
        const page = params[`page`];
        const size = params[`size`];
         
        if (!params) return '';
        
        if (username) {
            return `username=${username}&page=${page}&size=${size}`;
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