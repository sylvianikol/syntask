import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, throwError } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { TaskService } from 'src/app/task/task.service';
import { UserService } from 'src/app/user/user.service';
import { Priority } from '../enum/priority.enum';
import { Status } from '../enum/status.enum';

@Component({
  selector: 'app-task-details',
  templateUrl: './task-details.component.html',
  styleUrls: ['./task-details.component.css']
})
export class TaskDetailsComponent implements OnInit, OnDestroy {
  
  private userSubscription!: Subscription;
  
  user!: any;
  currentTask!: any;
  developerName = '';

  isAdmin = false;
  message = '';
  error = '';

  priorities = Priority;
  statuses = Status;
  checkedPriority: any;
  checkedStatus: any;

  constructor(
    private taskService: TaskService,
    private userService: UserService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
    ) { }

  ngOnInit(): void {

    this.userSubscription = this.authService.user
      .subscribe(user => {
        this.user = user;
        this.isAdmin = this.user.roles.indexOf("ROLE_ADMIN") > -1;
      });

    this.message = '';
    this.getTask(this.route.snapshot.paramMap.get('id'));
  }

  getTask(id: any): void {
    
    this.taskService.get(id).subscribe((data: any) => {
          console.log(data);
          this.currentTask = data;
          this.currentTask.developer = data.developer.id;

          this.checkedPriority = Priority[this.currentTask.priority];
          this.checkedStatus = Status[this.currentTask.status];

          this.userService.get(this.currentTask.developer).subscribe(user => {
            console.log(user);
            this.developerName = user.username;
          })
        },
        error => {
          console.log(error);
        });
  }

  updateTask(): void {

    const data = {
      title: this.currentTask.title.trim(),
      description: this.currentTask.description.trim(),
      priority: Priority[this.currentTask.priority], 
      developer: this.currentTask.developer,
      status: Status[this.currentTask.status]
    };

    console.log(data)
    this.taskService.update(this.currentTask.id, data)
      .subscribe(
        response => {
          this.message = 'Task details were updated successfully!';
          this.error = '';
        },
        error => this.handleError(error));
  }

  assignTask() {
    const taskId = this.route.snapshot.paramMap.get('id');
    this.router.navigate(['/tasks/' + taskId + '/assign'])
  }

  deleteTask(): void {
    this.taskService.delete(this.currentTask.id)
      .subscribe(
        response => {
          console.log(response);
          this.router.navigate(['/tasks']);
        },
        error => {
          console.log(error);
        });
  }

  onPriorityChange(priority: any) {

  }

  priorityKeys() : Array<string> {
    let keys = Object.keys(this.priorities);
    
    let result = keys.reduce((acc: any, curr: any) => { 
      acc.push(curr); 
      return acc;
    }, []);
     
    return result.slice(keys.length / 2);
  }

  statusKeys() : Array<string> {
    let keys = Object.keys(this.statuses);
    
    let result = keys.reduce((acc: any, curr: any) => { 
      acc.push(curr); 
      return acc;
    }, []);
     
    return result.slice(keys.length / 2);
  }

  private handleError(errorRes: HttpErrorResponse) {
         
    this.error = 'An uknown error!';
    this.message = '';

    if (!errorRes.error || !errorRes.error.error 
        || !errorRes.error.description) {
        return throwError(this.error);
    }

    if (errorRes.error.description) {
        const errors = errorRes.error.error;

        this.error = errors.reduce((acc: string, curr: string) => {
            return acc + curr + '<br>';
        }, '');

    } 

    return throwError(this.error);
  }

  ngOnDestroy() {
    this.userSubscription.unsubscribe();
  }
}
