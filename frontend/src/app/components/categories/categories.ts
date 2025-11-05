import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CategoryService } from '../../services/category.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.html',
  imports: [CommonModule, ReactiveFormsModule]
})
export class CategoriesComponent implements OnInit {
  categories: any[] = [];
  categoryForm!: FormGroup;
  successMsg: string = '';
  errorMsg: string = '';

  constructor(private fb: FormBuilder, private categoryService: CategoryService) {}

  ngOnInit() {
    this.categoryForm = this.fb.group({
      id: [null],
      name: [''],
      description: ['']
    });
    this.getCategories();
  }

  showMessage(type: 'success' | 'error', message: string) {
    if (type === 'success') {
      this.successMsg = message;
      this.errorMsg = '';
    } else {
      this.errorMsg = message;
      this.successMsg = '';
    }

    // Clear messages automatically after 3 seconds
    setTimeout(() => {
      this.successMsg = '';
      this.errorMsg = '';
    }, 3000);
  }

  getCategories() {
    this.categoryService.getCategories().subscribe({
      next: (res) => {
        this.categories = res;
      },
      error: (err) => {
        this.showMessage('error', 'Failed to load categories.');
        console.error(err);
      }
    });
  }

  submitForm() {
    const data = this.categoryForm.value;
    if (data.id) {
      // Update
      this.categoryService.updateCategory(data.id, data).subscribe({
        next: () => {
          this.showMessage('success', 'Category updated successfully!');
          this.getCategories();
          this.categoryForm.reset();
        },
        error: (err) => {
          this.showMessage('error', err.error.message || 'Failed to update category.');
          console.error(err);
          this.categoryForm.reset();
        }
      });
    } else {
      // Create
      this.categoryService.createCategory(data).subscribe({
        next: () => {
          this.showMessage('success', 'Category added successfully!');
          this.getCategories();
          this.categoryForm.reset();
        },
        error: (err) => {
          this.showMessage('error', err.error.message || 'Failed to add category.');
          console.error(err);
        }
      });
    }
  }

  editCategory(cat: any) {
    this.categoryForm.patchValue(cat);
  }

  deleteCategory(id: number) {
    this.categoryService.deleteCategory(id).subscribe({
      next: () => {
        this.showMessage('success', 'Category deleted successfully!');
        this.getCategories();
      },
      error: (err) => {
        this.showMessage('error', 'Failed to delete category.');
        console.error(err);
      }
    });
  }
}
