import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { StoreService } from '../../../store/store.service';
import { User } from '../../../models/models';
@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.scss',
})
export class RegistrationComponent {
  registrationForm: FormGroup = this.fb.group({
    fullName: ['', Validators.required],
    age: [0, [Validators.required, Validators.min(1), Validators.max(110)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', Validators.required],
  });

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private storeService: StoreService
  ) {}

  onSubmit() {
    if (this.registrationForm.valid) {
      console.log('Login successful!', this.registrationForm.value);
      this.http
        .post<User>(
          'http://localhost:3000/api/register',
          this.registrationForm.getRawValue()
        )
        .subscribe(
          user => {
            console.log('Registered successfully:', user);
            this.storeService.setUser(user);
            this.router.navigateByUrl('/posts');
          },
          error => {
            console.error('Form submission error:', error);
          }
        );
    }
  }
}
