import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { concatMapTo } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/auth.service';
import { Role } from 'src/app/user/enums/role.enum';
import { User } from 'src/app/user/user.model';
import { UserService } from 'src/app/user/user.service';
import { Priority } from '../enum/priority.enum';
import { Status } from '../enum/status.enum';
import { Task } from '../task.model';
import { TaskService } from '../task.service';

@Component({
  selector: 'app-assign-task',
  templateUrl: './assign-task.component.html',
  styleUrls: ['./assign-task.component.css']
})
export class AssignTaskComponent implements OnInit {

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
  isAssigned = false;

  private userSubscription!: Subscription;
  user!: any;
  currentTask!: Task;
  isLoggedIn = false;
  message = '';

  constructor(
    private userService: UserService,
    private taskService: TaskService,
    private authService: AuthService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    
    this.userSubscription = this.authService.user
      .subscribe(user => {
        this.isLoggedIn = !!user;
        this.user = user;

        if (this.isLoggedIn) { 
          this.isAdmin = this.user.roles.indexOf("ROLE_ADMIN") > -1;    
        } 

        if (this.isAdmin) {
          this.fetchUsers();
          this.getTask(this.route.snapshot.paramMap.get('id'));
        }

      });
  }

  getTask(id: any): void {
    this.taskService.get(id)
      .subscribe(
       (data: Task) => {
          this.currentTask = data;
        },
        error => {
          console.log(error);
        });
  }


  fetchUsers(): void {

    const params = this.getRequestParams(this.username, this.page, this.pageSize);

    this.userService.getAll(params)
      .subscribe(
        (data: any) => {
          const { users, totalItems } = data;
          this.users = users;
          this.count = totalItems;
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

  setActiveUser(user: User, index: number): void {
    this.currentUser = user;
    this.currentIndex = index;
  }

  assignUser(userId: string) {

    const data = { 
      title: this.currentTask.title,
      description: this.currentTask.description,
      priority: Priority[this.currentTask.priority],
      developer: userId,
      status: Status[this.currentTask.status]
    }; 

  
    this.taskService.update(this.currentTask.id, data)
      .subscribe(data => {
         this.message = `${this.currentUser.username} 
                         was assigned to task 
                         "${this.currentTask.title}"`;
         this.isAssigned = true;
       },
       error => {
         console.log(error);
       }); 
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

  private getRequestParams(param: any, page?: number, pageSize?: number) {
     
    let params: any = {};

    if (param) {
      params[`param`] = param;
    }

    if (page) {
      params[`page`] = page - 1;
    }

    if (pageSize) {
      params[`size`] = pageSize;
    }

    return params;
  }

  ngOnDestroy() {
    this.userSubscription.unsubscribe();
  }

}
