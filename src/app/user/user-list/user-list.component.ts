import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { TaskService } from 'src/app/task/task.service';
import { User } from 'src/app/user/user.model';
import { Role } from '../enums/role.enum';
import { UserService } from '../user.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {

  page: number = 1;
  count: number = 0;
  pageSize: number = 10;
  pageSizes = [3, 5, 10, 15];
  responsive: boolean = true;

  users!: User[];
  currentUser!: User;
  currentIndex = -1;
  username = '';
  isAdmin = false;

  private userSubscription!: Subscription;
  user!: User;
  isLoggedIn = false;

  constructor(
    private userService: UserService,
    private taskService: TaskService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    
    this.userSubscription = this.authService.user
      .subscribe(user => {
        this.isLoggedIn = !!user;
        this.user = user;

        if (this.isLoggedIn) { 
          this.isAdmin = this.user.roles.indexOf(Role.ROLE_ADMIN) > -1;     
        } 

        if (this.isAdmin) {
          this.fetchUsers();
        }

      });
  }

  getRequestParams(searchUsername: any, page: number, pageSize: number) {
     
    let params: any = {};

    if (searchUsername) {
      params[`username`] = searchUsername;
    }

    if (page) {
      params[`page`] = page - 1;
    }

    if (pageSize) {
      params[`size`] = pageSize;
    }

    return params;
  }

  fetchUsers(): void {

    const params = this.getRequestParams(this.username, this.page, this.pageSize);

    this.userService.getAll(params)
      .subscribe(
        (data: any) => {
          // const { users, totalItems } = data;
          this.users = data.users;
          // this.count = totalItems;
          console.log(data);
          console.log(this.users);
        },
        error => {
          console.log(error);
        });
  }

  refreshList(): void {
    this.fetchUsers();
    this.currentUser = new User('', '', '', [], '', new Date());
    this.currentIndex = -1;
  }

  setActiveUser(user: User, index: number): void {
    this.currentUser = user;
    this.currentIndex = index;
  }

  removeAllUsers(): void {
    this.userService.deleteAll()
      .subscribe(
        response => {
          console.log(response);
          this.refreshList();
        }, 
        error => {
          console.log(error);
        });
  }

  searchUsername(): void {
    this.userService.findByUsername(this.username)
      .subscribe(
        data => {
          this.users = data;
          console.log(data);
        },
        error => {
          console.log(error);
        });
  }

  onAddUser() {
    this.router.navigate(['/users/add'])
  }

  onGetUserTasks(id: string) {
    // todo: navigate to tasks -> fetchTasksByUserId(id) 
  }

  handlePageChange(event: any) {
    this.page = event;
    this.fetchUsers();
  }

  handlePageSizeChange(event: any) {
    this.pageSize = event.target.value;
    this.page = 1;
    this.fetchUsers();
  }

  ngOnDestroy() {
    this.userSubscription.unsubscribe();
  }

}
