import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot} from "@angular/router";
import { map, take } from "rxjs/operators";
import { AuthService } from "./auth.service";

@Injectable({providedIn: 'root'})
export class AdminGuard {

    constructor(
        private authService: AuthService, 
        private router: Router
    ) {}

    canActivate(route: ActivatedRouteSnapshot, router: RouterStateSnapshot) {

        return this.authService.user
                .pipe(
                    take(1), 
                    map(user => {

                    const isAuth = !!user;
                     
                    if (isAuth && user.roles.indexOf("ROLE_ADMIN") > -1) {
                        return true;
                    }

                    return this.router.createUrlTree(['/']);
                })); 
    }
    
}