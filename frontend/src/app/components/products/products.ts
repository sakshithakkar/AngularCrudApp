import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { CategoryService } from '../../services/category.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // 👈 For ngModel
import { HttpEventType } from '@angular/common/http';
import { ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-products',
  templateUrl: './products.html',
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
})
export class ProductsComponent implements OnInit {
  products: any[] = [];
  categories: any[] = [];
  productForm!: FormGroup;
  selectedFile: File | null = null;
  uploadProgress = 0;

  successMsg = '';
  errorMsg = '';

  @ViewChild('fileInput') fileInput!: ElementRef;


  // pagination + sorting + search
  pagination = { total: 0, page: 1, limit: 5, totalPages: 1 };
  sortOrder: 'asc' | 'desc' = 'desc';
  searchTerm: string = '';

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private categoryService: CategoryService
  ) { }

  ngOnInit() {
    this.productForm = this.fb.group({
      id: [null],
      name: [''],
      price: [''],
      category_id: [''],
    });
    this.getProducts();
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
    setTimeout(() => {
      this.successMsg = '';
      this.errorMsg = '';
    }, 3000);
  }

  getProducts() {
    this.productService
      .getProducts(this.pagination.page, this.pagination.limit, this.sortOrder, this.searchTerm)
      .subscribe({
        next: (res) => {
          this.products = res.data;
          this.pagination = res.pagination;
        },
        error: (err) => {
          console.error(err);
          this.showMessage('error', 'Failed to load products.');
        },
      });
  }

  getCategories() {
    this.categoryService.getCategories().subscribe({
      next: (res) => (this.categories = res),
      error: (err) => this.showMessage('error', 'Failed to load categories.'),
    });
  }

  submitForm() {
    const data = this.productForm.value;
    if (data.id) {
      this.productService.updateProduct(data.id, data).subscribe({
        next: () => {
          this.showMessage('success', 'Product updated successfully!');
          this.getProducts();
          this.productForm.reset();
        },
        error: (err) =>
          this.showMessage('error', err.error.message || 'Failed to update product.'),
      });
    } else {
      this.productService.createProduct(data).subscribe({
        next: () => {
          this.showMessage('success', 'Product added successfully!');
          this.getProducts();
          this.productForm.reset();
        },
        error: (err) =>
          this.showMessage('error', err.error.message || 'Failed to add product.'),
      });
    }
  }

  editProduct(p: any) {
    this.productForm.patchValue(p);
  }

  deleteProduct(id: number) {
    this.productService.deleteProduct(id).subscribe({
      next: () => {
        this.showMessage('success', 'Product deleted successfully!');
        this.getProducts();
      },
      error: () => this.showMessage('error', 'Failed to delete product.'),
    });
  }

  toggleSort() {
    this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    this.getProducts();
  }

  changePage(page: number) {
    if (page < 1 || page > this.pagination.totalPages) return;
    this.pagination.page = page;
    this.getProducts();
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  uploadFile() {
    if (!this.selectedFile) return;

    const formData = new FormData();
    formData.append('file', this.selectedFile);

    this.productService.uploadProducts(formData).subscribe({
      next: (event: any) => {
        if (event.type === HttpEventType.UploadProgress && event.total) {
          this.uploadProgress = Math.round((100 * event.loaded) / event.total);
        } else if (event.type === HttpEventType.Response) {
          this.showMessage('success', 'Bulk upload completed successfully!');
          this.uploadProgress = 0;
          this.getProducts();

          // ✅ Clear file input and selected file
          this.selectedFile = null;
          if (this.fileInput) {
            this.fileInput.nativeElement.value = '';
          }
        }
      },
      error: (err) => {
        console.error(err);
        this.showMessage('error', 'Upload failed.');
        this.uploadProgress = 0;
      }
    });
  }
}
