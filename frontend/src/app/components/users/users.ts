import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { CategoryService } from '../../services/category.service';
import { ProductService } from '../../services/product.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-users',
  templateUrl: './users.html',
  styleUrls: ['./users.css'],
  imports: [CommonModule, ReactiveFormsModule],
})
export class UsersComponent implements OnInit {
  users: any[] = [];
  userForm!: FormGroup;
  errorMessage = '';


  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private categoryService: CategoryService,
    private productService: ProductService
  ) { }

  ngOnInit() {
    this.userForm = this.fb.group({
      id: [null],
      email: ['']
    });
    this.getUsers();
  }

  getUsers() {
    this.userService.getUsers().subscribe(res => this.users = res);
  }

 editUser(user: any) {
    this.userForm.patchValue({
      id: user.id,
      email: user.email
    });
  }

  cancelEdit() {
  this.userForm.reset();
}

  updateUser() {
    const { id, email } = this.userForm.value;
    if (!id) return;

    this.userService.updateUser(id, { email }).subscribe({
      next: () => {
        this.getUsers();
        this.userForm.reset();
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Update failed';
        setTimeout(() => this.errorMessage = '', 3000);
      }
    });
  }

  deleteUser(id: number) {
    this.errorMessage = '';
    this.userService.deleteUser(id).subscribe({
      next: () => {
        this.getUsers();
      },
      error: (err) => {
        if (err.status === 403 && err.error?.message) {
          this.errorMessage = err.error.message;
        } else {
          this.errorMessage = 'An unexpected error occurred.';
        }

        // ✅ Auto-hide message after 3 seconds
        setTimeout(() => {
          this.errorMessage = '';
        }, 3000);
      },
    });
  }
}
