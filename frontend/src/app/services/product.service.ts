import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private apiUrl = 'http://localhost:4000/api/products';

  constructor(private http: HttpClient) {}

  getProducts(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  createProduct(data: any): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }

  updateProduct(id: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, data);
  }

  deleteProduct(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
