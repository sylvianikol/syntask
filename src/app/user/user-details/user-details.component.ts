import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Role } from '../enums/role.enum';
import { User } from '../user.model';
import { UserService } from '../user.service';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.css']
})
export class UserDetailsComponent implements OnInit {


  role = Role;
  
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


  keys() : Array<string> {
    let keys = Object.keys(this.role);
    let result = keys.reduce((acc: any, curr: any) => { 
      const role = curr.replace('ROLE_', '');
      acc.push(role); 
      return acc;
    }, []);
     
    return result.slice(keys.length / 2);
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
          this.router.navigate(['/users']);
        },
        error => {
          console.log(error);
        });
  }

  private stringifyRoles(roles: []) {
    
    return roles.reduce((acc: string, cur: any) => {
      
      const role = cur.role.replace('ROLE_', '').concat(', ');
      
      acc = acc + role;
      return acc;
    }, '').slice(0, -2);
  
  }
}
