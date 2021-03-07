import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { throwError } from 'rxjs';
import { Role } from '../enums/role.enum';
import { UserService } from '../user.service';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.css']
})
export class UserDetailsComponent implements OnInit {

  roleKeys!: any[];
  roles = Role;
  
  currentUser!: any;
  message = '';
  error = ''

  constructor(
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit(): void {
    this.message = '';
    this.getUser(this.route.snapshot.paramMap.get('id'));
    this.roleKeys = Object.keys(this.roles).filter(f => !isNaN(Number(f)));
  }

  getUser(id: any): void {

    this.userService.get(id)
      .subscribe((data: any) => {
          this.currentUser = data;
        },
        error => {
          console.log(error);
        });
  }

  updateUser(): void {

    const data = {
      username: this.currentUser.username.trim(),
      email: this.currentUser.email.trim(),
      authorities: this.currentUser.authorities
    }

    this.userService.update(this.currentUser.id, data)
      .subscribe(
        response => {
          this.message = 'User details were updated successfully!';
          this.error = '';
        },
        error => this.handleError(error));
  }

  removeRole(roleName: string) {
    
    let currentRoles = this.currentUser.authorities;

    for (let role of currentRoles) {

      if (role.role === 'ROLE_' + roleName) {
        const index = currentRoles.indexOf(role, 0);
        this.currentUser.authorities.splice(index, 1);
        break;
      } 
    } 
  }

  addRole(roleName: string) {
    let currentRoles = this.currentUser.authorities;
    let newRole = 'ROLE_' + roleName;

    for (let role in Role) {
      const isValueProperty = parseInt(role, 10) >= 0
      
      if (isValueProperty && Role[role] === newRole) { //
        
        if (!this.isRoleAlreadyPresent(currentRoles, roleName)) {
          this.currentUser.authorities.push({ role: Role[role]});
        }
      }
    }

  }

  deleteUser(): void {

    this.userService.delete(this.currentUser.id)
      .subscribe(response => {
          this.router.navigate(['/users']);
        },
        error => {
          console.log(error);
        });
  }

  hasRole(roleName: string) {
    let roleArray = this.currentUser.authorities;

    for (let role of roleArray) {

      if (role.role === 'ROLE_' + roleName) {
        return true;
      } 

    } 
    return false;
  }

  keys() : Array<string> {
    let keys = Object.keys(this.roles);
    
    let result = keys.reduce((acc: any, curr: any) => { 
      const role = curr.replace('ROLE_', '');
      acc.push(role); 
      return acc;
    }, []);
     
    return result.slice(keys.length / 2);
  }

  private handleError(errorRes: HttpErrorResponse) {
    this.message = '';     
    this.error = 'An uknown error!';

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

  private isRoleAlreadyPresent(currentRoles: any, roleName: string) {
    
    for (let role of currentRoles) {

      if (role.role === 'ROLE_' + roleName) {
        const index = currentRoles.indexOf(role, 0);
        return true;
      } 
    } 

    return false;
  }
}
