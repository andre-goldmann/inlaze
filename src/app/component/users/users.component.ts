import { Component } from '@angular/core';
import {UsersService} from "../../services/users.service";
import {Observable} from "rxjs";
import {User} from "../../models/models";
import {CommonModule} from "@angular/common";

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export class UsersComponent {

  users$: Observable<User[]>;

  constructor(usersService:UsersService) {
    this.users$ = usersService.getUsers();
  }

}
