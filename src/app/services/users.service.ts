import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/models';
import { StoreService } from '../store/store.service';
import {HOST} from "../app.config";

@Injectable({
  providedIn: 'root',
})
export class UsersService {

  constructor(
    private httpClient: HttpClient,
    private storeService: StoreService
  ) {}

  public getUsers(): Observable<User[]> {
    // TODO should be done by Guard
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.storeService.authToken()}`,
    });
    return this.httpClient.get<User[]>(HOST + '/api/users', {
      headers,
    });
  }

  updateUser(user: any): Observable<User> {
    // TODO should be done by Guard
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.storeService.authToken()}`,
    });
    return this.httpClient.put<User>(HOST + '/api/user', user, {
      headers,
    });
  }
}
