import { Component, signal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { StoreService } from '../../../store/store.service';
import { UsersService } from '../../../services/users.service';

@Component({
  selector: 'app-edit',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './edit.component.html',
  styleUrl: './edit.component.scss',
})
export class EditComponent {
  editForm: FormGroup = this.fb.group({
    userId: ['', Validators.required],
    fullName: ['', Validators.required],
    email: ['', Validators.required],
    age: [0, Validators.required],
  });

  constructor(
    private fb: FormBuilder,
    private userService: UsersService,
    public storeService: StoreService,
  ) {
    const user = storeService.getUser();
    this.editForm.patchValue({
      userId: user.id,
      fullName: user.fullName,
      email: user.email,
      age: user.age,
    });
  }

  onSubmit() {
    this.userService
      .updateUser(this.editForm.getRawValue())
      .subscribe((user) => {
        this.storeService.setUser(user);
      });
  }
}
