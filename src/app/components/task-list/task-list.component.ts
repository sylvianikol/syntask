import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { Task } from 'src/app/models/task.model';
import { User } from 'src/app/models/user.model';
import { TaskService } from 'src/app/services/task.service';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css']
})
export class TaskListComponent implements OnInit, OnDestroy {
  
  tasks!: Task[];
  page: number = 1;
  count: number = 0;
  pageSize: number = 10;
  pageSizes = [3, 5, 10, 15];
  responsive: boolean = true;

  currentTask!: Task;
  currentIndex = -1;
  title = '';
  isAdmin = false;

  private userSubscription!: Subscription;
  user!: User;
  isLoggedIn = false;

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
          this.fetchTasks();
          this.isAdmin = this.user.roles.indexOf("ADMIN") > -1;
        } 
      });
  }

  getRequestParams(searchTitle: any, page: number, pageSize: number) {
    // tslint:disable-next-line:prefer-const
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

  fetchTasks(): void {

    const params = this.getRequestParams(this.title, this.page, this.pageSize);

    this.taskService.getAll(params)
      .subscribe(
        (data: any) => {
          const { tasks, totalItems } = data;
          this.tasks = tasks;
          this.count = totalItems;
          console.log(data);
        },
        error => {
          console.log(error);
        });
  }

  refreshList(): void {
    this.fetchTasks();
    this.currentTask = new Task('', '', '', '', new Date(Date.now()), this.user, false);
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

  searchTitle(): void {
    this.taskService.findByTitle(this.title)
      .subscribe(
        data => {
          this.tasks = data;
          console.log(data);
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

  ngOnDestroy() {
    this.userSubscription.unsubscribe();
  }
  
}
