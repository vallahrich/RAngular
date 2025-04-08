import { Component, OnInit } from '@angular/core';
import { User } from '../model/user';
import { UserComponent } from "../user/user.component";
import { UserService } from '../services/user.service';


@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [UserComponent],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.css'
})
export class UserListComponent implements OnInit{
    constructor(private userService: UserService) {}
    
    users : User[] = []
    
    ngOnInit(): void {
    this.userService.getUsers().subscribe(users => {
      this.users = users;
    });
  }
  
  /*users: User[] = [
      {
        userId: 1,
        username: 'jane_doe',
        email: 'jane.doe@mailinator.com',
        passwordHash: 'hash123',
        createdAt: new Date(2022, 0, 15)
      },
      {
        userId: 2,
        username: 'superman',
        email: 'super.man@mailinator.com',
        passwordHash: 'hash456',
        createdAt: new Date(2021, 2, 10)
      },
      {
        userId: 3,
        username: 'superwoman',
        email: 'super.woman@mailinator.com',
        passwordHash: 'hash789',
        createdAt: new Date(2023, 6, 5)
      },
      {
        userId: 4,
        username: 'batman',
        email: 'batman@mailinator.com',
        passwordHash: 'bat123',
        createdAt: new Date(2020, 10, 25)
      },
      {
        userId: 5,
        username: 'spiderman',
        email: 'spidey@mailinator.com',
        passwordHash: 'spidey321',
        createdAt: new Date(2019, 4, 30)
      }
    ]; */
  }
