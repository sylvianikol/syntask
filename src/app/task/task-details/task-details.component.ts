import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Task } from 'src/app/task/task.model';
import { TaskService } from 'src/app/task/task.service';
import { User } from 'src/app/user/user.model';
import { UserService } from 'src/app/user/user.service';

@Component({
  selector: 'app-task-details',
  templateUrl: './task-details.component.html',
  styleUrls: ['./task-details.component.css']
})
export class TaskDetailsComponent implements OnInit {

  currentTask!: Task;
  message = '';

  constructor(
    private taskService: TaskService,
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit(): void {
    this.message = '';
    this.getTask(this.route.snapshot.paramMap.get('id'));
  }

  getTask(id: any): void {
    this.taskService.get(id)
      .subscribe(
       (data: Task) => {
          this.currentTask = data;
          console.log(data);
        },
        error => {
          console.log(error);
        });
  }

  updateCompleted(status: boolean): void {
    const data = {
      title: this.currentTask.title,
      description: this.currentTask.description,
      priority: this.currentTask.priority,
      developer: this.currentTask.developer,
      completed: status
    };

    this.taskService.update(this.currentTask.id, data)
      .subscribe(
        response => {
          this.currentTask.completed = status;
          
          this.message = status 
            ? 'Task status changed to Completed!' 
            : 'Task status changed to Pending!';
        },
        error => {
          console.log(error);
        });
  }

  updateTask(): void {
    this.taskService.update(this.currentTask.id, this.currentTask)
      .subscribe(
        response => {
          this.message = 'Task details were updated successfully!';
        },
        error => {
          console.log(error);
        });
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

}
