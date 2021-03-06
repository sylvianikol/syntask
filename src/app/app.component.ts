import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from './auth/auth.service';
import { Role } from './user/enums/role.enum';
import { User } from './user/user.model';

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
          this.isAdmin = this.user.roles.indexOf(Role.ROLE_ADMIN) > -1;
        }
        console.log(this.user);
      });
  }

  onLogout() {
    this.authService.logout();
  }

  ngOnDestroy() {
    this.userSubscription.unsubscribe();
  }
}
