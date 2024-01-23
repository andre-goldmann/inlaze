import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/models';
import { StoreService } from '../store/store.service';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  constructor(
    private httpClient: HttpClient,
    private storeService: StoreService,
  ) {}

  public getUsers(): Observable<User[]> {
    // TODO should be done by Guard
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.storeService.authToken()}`,
    });
    return this.httpClient.get<User[]>('http://localhost:3000/api/users', {
      headers,
    });
  }

  updateUser(user: any): Observable<User> {
    // TODO should be done by Guard
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.storeService.authToken()}`,
    });
    return this.httpClient.put<User>('http://localhost:3000/api/user', user, {
      headers,
    });
  }
}
