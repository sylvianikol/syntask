import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { BehaviorSubject, throwError } from "rxjs";
import { catchError, tap } from "rxjs/operators";
import { User } from "../user/user.model";

const baseUrl = 'http://localhost:8080';


@Injectable({providedIn: 'root'})
export class AuthService {

    // BehaviorSubject gives immediate access to the prev emitted value
    // this way we get access to the current user
    user = new BehaviorSubject<User>(null!); 
    private expirationTimer: any;

    constructor(
        private http: HttpClient,
        private router: Router
    ) {}
    
    signUp(username: string, email: string, password: string) {
        return this.http.post<any>(`${baseUrl}/sign-up`,
        {   
            username: username,
            email: email,
            password: password
        }
        ).pipe(
            catchError(this.handleError), 
            tap(resData => { 
                this.handleAuthentication(resData);
            })
        );
    }


    login(username: string, password: string) {
        return this.http.post<any>(`${baseUrl}/signin`,
            {   
                username: username,
                password: password
            }
        ).pipe(
            catchError(this.handleError), 
            tap(resData => { 
                this.handleAuthentication(resData);
            })
        );
    }

    autoLogin() {
        const userData: {

            id: string; 
            email: string; 
            username: string;
            roles: [];
            _token: string;
            _tokenExpirationDate: string;

        } = JSON.parse(localStorage.getItem('userData')!);

        if (!userData) return;

        const loadedUser = new User(
            userData.id,
            userData.email,
            userData.username,
            userData.roles,
            userData._token,
            new Date(userData._tokenExpirationDate)
        );

        if (loadedUser.token) {
            this.user.next(loadedUser);
            const expiration = 
                new Date(userData._tokenExpirationDate).getTime() - 
                new Date().getTime(); 
            this.autoLogout(expiration);
        }
    }

    logout() {
        this.user.next(null!);
        this.router.navigate(['/']);
        localStorage.removeItem('userData');

        if (this.expirationTimer) {
            clearTimeout(this.expirationTimer);
        }

        this.expirationTimer = null;
    }

    autoLogout(expiration: number) {
        this.expirationTimer = setTimeout(() => {
            this.logout();
        }, expiration);
    }

    handleAuthentication(resData: any) {
        const user = new User(
            resData.id,
            resData.email,
            resData.username,
            resData.roles,
            resData.accessToken,
            resData.expirationDate 
        );

        this.user.next(user);
        this.autoLogout(new Date(resData.expirationDate).getTime() - new Date().getTime());
        localStorage.setItem('userData', JSON.stringify(user));
    }

    handleError(errorRes: HttpErrorResponse) {
        console.log(errorRes.error.error);
        let errorMessage = 'An uknown error!';

        if (!errorRes.error || !errorRes.error.error) {
            return throwError(errorMessage);
        }

        switch(errorRes.error.error) {
            case 'EMAIL_ALREADY_EXISTS': 
                errorMessage = 'This email already exists!';
            break;
            case 'Forbidden': 
                errorMessage = 'Incorrect username or password!';
            break;
        }

        return throwError(errorMessage);
    }
}