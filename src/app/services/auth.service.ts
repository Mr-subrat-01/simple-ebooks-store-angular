import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { User } from '../Models/User';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.APIURL}`;
  constructor(private http: HttpClient, private router: Router) { }
  
  fetchUserDetails(email: string):Observable<User> {
    return this.http.get<User>(`${this.apiUrl}user?email=${email}`);
  }

  storeUserDetails(user: User) {
    localStorage.setItem('userDetails', JSON.stringify(user));
  }

  getUserDetails() {
    const userDetails = localStorage.getItem('userDetails');
    return userDetails ? JSON.parse(userDetails) : null;
  }

  isLoggedIn():boolean {
    return !!this.getUserDetails();
  }

}
