import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '../user.model';
import { UserService } from '../user.service';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.css']
})
export class UserDetailsComponent implements OnInit {

  currentUser!: User;
  message = '';

  constructor(
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit(): void {
    this.message = '';
    this.getUser(this.route.snapshot.paramMap.get('id'));
  }

  getUser(id: any): void {

    this.userService.get(id)
      .subscribe((data: User) => {
          this.currentUser = data;
          console.log(data);
        },
        error => {
          console.log(error);
        });
  }

  updateUser(): void {

    // const data = {
    //   username: this.currentUser.username,
    //   email: this.currentUser.email,
    //   role: this.currentUser.roles
    // };

    this.userService.update(this.currentUser.id, this.currentUser)
      .subscribe(
        response => {
          this.message = 'User details were updated successfully!';
        },
        error => {
          console.log(error);
        });
  }


  deleteUser(): void {

    this.userService.delete(this.currentUser.id)
      .subscribe(response => {
          console.log(response);
          this.router.navigate(['/users']);
        },
        error => {
          console.log(error);
        });
  }

}
