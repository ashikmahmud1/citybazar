import {User} from "../models/user";
import {Subject} from "rxjs";

export class AuthService {
  private user:User;
  authChange = new Subject<boolean>();
  users:User[] = [
    {email:'sazzad@gmail.com',password:'sazzad@a1b2c3'},
    {email:'shopon@gmail.com',password:'sazzad@a1b2c3'},
    {email:'hussain@gmail.com',password:'sazzad@a1b2c3'}
  ];
  login(user:User) {
    let authenticatedUser = this.users.find(u => u.email == user.email && u.password == user.password);
    if (authenticatedUser){
      this.user = {
        email:user.email,
        password:user.password
      };
      this.authChange.next(true);
    }
    else {
      this.authChange.next(false);
    }
  }
  logout() {
    this.user = null;
    this.authChange.next(false);
  }
  isAuth() {
    return this.user !== null;
  }
}
