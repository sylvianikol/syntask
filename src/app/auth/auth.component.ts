import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {

  isLoginMode = true;
  isLoading = false;
  error!: string;

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  onSwitchMode() {
    this.error = '';
    this.isLoginMode = !this.isLoginMode;
  }

  onSubmit(form: NgForm) {
    this.error = '';

    if (!form.valid) return;

    const username = form.value.username;
    const password = form.value.password;
    
    this.isLoading = true; 
    
    let authObservable = new Observable<any>();

    if (this.isLoginMode) {
      authObservable = this.authService.login(username, password);
    } else {
      const email = form.value.email;
      authObservable = this.authService.signUp(username, email, password);  
    }

    authObservable.subscribe(resData => {
      console.log(resData);
      this.isLoading = false;
      this.isLoginMode = true;
      this.router.navigate(['/']);

    }, errorMessage => {  
      console.log(errorMessage); 
      this.error = errorMessage;
      this.isLoading = false;
    });

    form.reset();
  }
}
