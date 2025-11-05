import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { CategoryService } from '../../services/category.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-products',
  templateUrl: './products.html',
  imports: [CommonModule, ReactiveFormsModule],
})
export class ProductsComponent implements OnInit {
  products: any[] = [];
  categories: any[] = [];
  productForm!: FormGroup;
  successMsg: string = '';
  errorMsg: string = '';

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private categoryService: CategoryService
  ) {}

  ngOnInit() {
    this.productForm = this.fb.group({
      id: [null],
      name: [''],
      price: [''],
      category_id: ['']
    });
    this.getProducts();
    this.getCategories();
  }

  /** Common function to show messages **/
  showMessage(type: 'success' | 'error', message: string) {
    if (type === 'success') {
      this.successMsg = message;
      this.errorMsg = '';
    } else {
      this.errorMsg = message;
      this.successMsg = '';
    }

    setTimeout(() => {
      this.successMsg = '';
      this.errorMsg = '';
    }, 3000);
  }

  /** Load products **/
  getProducts() {
    this.productService.getProducts().subscribe({
      next: (res) => {
        this.products = res;
      },
      error: (err) => {
        console.error(err);
        this.showMessage('error', 'Failed to load products.');
      }
    });
  }

  /** Load categories for dropdown **/
  getCategories() {
    this.categoryService.getCategories().subscribe({
      next: (res) => {
        this.categories = res;
      },
      error: (err) => {
        console.error(err);
        this.showMessage('error', 'Failed to load categories.');
      }
    });
  }

  /** Create or update product **/
  submitForm() {
    const data = this.productForm.value;
    if (data.id) {
      // Update
      this.productService.updateProduct(data.id, data).subscribe({
        next: () => {
          this.showMessage('success', 'Product updated successfully!');
          this.getProducts();
          this.productForm.reset();
        },
        error: (err) => {
          console.error(err);
          this.showMessage('error', 'Failed to update product.');
        }
      });
    } else {
      // Create
      this.productService.createProduct(data).subscribe({
        next: () => {
          this.showMessage('success', 'Product added successfully!');
          this.getProducts();
          this.productForm.reset();
        },
        error: (err) => {
          console.error(err);
          this.showMessage('error', 'Failed to add product.');
        }
      });
    }
  }

  /** Edit selected product **/
  editProduct(p: any) {
    this.productForm.patchValue(p);
  }

  /** Delete product **/
  deleteProduct(id: number) {
    this.productService.deleteProduct(id).subscribe({
      next: () => {
        this.showMessage('success', 'Product deleted successfully!');
        this.getProducts();
      },
      error: (err) => {
        console.error(err);
        this.showMessage('error', 'Failed to delete product.');
      }
    });
  }
}
