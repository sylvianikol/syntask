import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription, throwError } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { Task } from 'src/app/task/task.model';
import { TaskService } from 'src/app/task/task.service';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css']
})
export class TaskListComponent implements OnInit, OnDestroy {
  private userSubscription!: Subscription;
  
  page: number = 1;
  count: number = 0;
  pageSize: number = 10;
  currentIndex = -1;
  pageSizes = [3, 5, 10, 15];
  responsive: boolean = true;

  tasks!: Task[];
  user!: any;
  currentTask!: Task;
  title = '';
  error = '';

  isAdmin = false;
  isLoggedIn = false;
  isLoading = false;

  constructor(
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
          this.isLoading = true;   
          this.fetchTasks();
          this.isAdmin = this.user.roles.indexOf("ROLE_ADMIN") > -1;
        } 
      });
  }

  fetchTasks(): void {
     
    const params = this.getRequestParams(this.title, this.page, this.pageSize);

    this.taskService.getAll(params)
      .subscribe(
        (data: any) => {

          const { tasks, totalItems } = data;
    
          this.tasks = tasks;
          this.count = totalItems;
          
          console.log(data);
        }, error => this.handleError(error) );

    this.isLoading = false;
  }

  refreshList(): void {
    this.fetchTasks();
    this.currentTask = new Task('', '', '', null!, null!, new Date(Date.now()), this.user, false);
    this.currentIndex = -1;
  }

  setActiveTask(task: Task, index: number): void {
    this.currentTask = task;
    this.currentIndex = index;
  }

  removeAllTasks(): void {
    this.taskService.deleteAll()
      .subscribe(
        response => {
          console.log(response);
          this.refreshList();
        }, 
        error => {
          console.log(error);
        });
  }

  onAddTask() {
    this.router.navigate(['/tasks/add'])
  }

  handlePageChange(event: any) {
    this.page = event;
    this.fetchTasks();
  }

  handlePageSizeChange(event: any) {
    this.pageSize = event.target.value;
    this.page = 1;
    this.fetchTasks();
  }

  private getRequestParams(searchTitle: any, page: number, pageSize: number) {
    
    let params: any = {};

    if (searchTitle) {
      params[`title`] = searchTitle;
    }

    if (page) {
      params[`page`] = page - 1;
    }

    if (pageSize) {
      params[`size`] = pageSize;
    }

    return params;
  }

  private handleError(errorRes: HttpErrorResponse) {
         
    this.error = 'An uknown error!';

    if (!errorRes.error || !errorRes.error.error) {
        return throwError(this.error);
    }

    this.error = errorRes.error.error;
    
    return throwError(this.error);
  }

  ngOnDestroy() {
    this.userSubscription.unsubscribe();
  }
  
}
