import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '@envs/environment.development';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private readonly baseUrl = environment.baseUrl;
  private http = inject(HttpClient);

  public products = signal<any[]>([]);

  constructor() { }

  public getProducts() {
    this.http.get(`${this.baseUrl}api/Product`).subscribe((data: any) => {
      this.products.set(data);
    });
  }
}
