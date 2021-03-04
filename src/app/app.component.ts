import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from './auth/auth.service';
import { User } from './models/user.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'Issue Tracker';

  private userSubscription!: Subscription;
  user!: User;
  isLoggedIn = false;
  isAdmin = false;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    
    this.authService.autoLogin();

    this.userSubscription = this.authService.user
      .subscribe(user => {
        this.isLoggedIn = !user ? false : true; 
        this.user = user;

        if (this.isLoggedIn) {
          this.isAdmin = this.user.roles.indexOf("ADMIN") > -1;
        }
      });
  }

  onLogout() {
    this.authService.logout();
  }

  ngOnDestroy() {
    this.userSubscription.unsubscribe();
  }
}
