import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { Task } from 'src/app/task/task.model';
import { User } from 'src/app/user/user.model';
import { TaskService } from 'src/app/task/task.service';
import { Priority } from '../enum/priority.enum';
import { Status } from '../enum/status.enum';

@Component({
  selector: 'app-add-task',
  templateUrl: './add-task.component.html',
  styleUrls: ['./add-task.component.css']
})
export class AddTaskComponent implements OnInit, OnDestroy {
  
  private userSubscription!: Subscription;

  user!: User;
  keys!: any[];
  priorities = Priority; 

  task = {
    title: '',
    description: '',
    priority: Priority.LOW
  };

  submitted = false;

  constructor(
    private taskService: TaskService,
    private authService: AuthService
  ) { 
    this.keys = Object.keys(this.priorities).filter(f => !isNaN(Number(f)));
  }

  ngOnInit(): void {
    this.userSubscription = this.authService.user
      .subscribe(user => {
        this.user = user;
      });
  }

  saveTask(): void {
    const data = {
      title: this.task.title,
      description: this.task.description,
      priority: this.task.priority,
      developer: this.user.id
    };

    this.taskService.create(data)
      .subscribe(
        response => {
          this.submitted = true;
        },
        error => {
          console.log(error);
        });
  }

  newTask(): void {
    this.submitted = false;
    this.task = new Task('', '', '', Priority.LOW, Status.PENDING, new Date(Date.now()), this.user, false);
  }

  ngOnDestroy() {
    this.userSubscription.unsubscribe();
  }
}
