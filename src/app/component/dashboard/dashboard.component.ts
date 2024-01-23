import { Router, RouterModule } from '@angular/router';
import { PostsComponent } from '../posts/posts.component';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { StoreService } from '../../store/store.service';
import { LoginResponse } from '../../models/models';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterModule, PostsComponent, ReactiveFormsModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
  isLoggedIn: boolean = false;

  loginForm: FormGroup = this.fb.group({
    email: ['', Validators.required],
    password: ['', Validators.required],
  });
  isRegistration: boolean = false;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    public storeService: StoreService,
  ) {}

  onSubmit() {
    if (this.loginForm.valid) {
      console.log('Login successful!', this.loginForm.value);
      this.http
        .post<LoginResponse>(
          'http://localhost:3000/api/login',
          this.loginForm.getRawValue(),
        )
        .subscribe(
          (response) => {
            console.log('Logged in successfully:', response);
            this.isLoggedIn = true;
            this.storeService.setUser(response.user);
            this.storeService.setToken(response.token);
            this.router.navigateByUrl('/posts');
          },
          (error) => {
            this.isLoggedIn = false;
            console.error('Form submission error:', error);
          },
        );
    }
  }

  register() {
    //
    this.isRegistration = true;
    this.router.navigateByUrl('/registration');
  }
}
