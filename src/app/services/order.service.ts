import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '@envs/environment.development';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private readonly baseUrl: string = environment.baseUrl;
  private http = inject(HttpClient);

  public ordersPredictions = signal<any[]>([]);
  public orders = signal<any[]>([]);

  constructor() { }

  getOrdersPredictions() {
    this.http.get(`${this.baseUrl}api/Order/sale-date-prediction`).subscribe((data: any) => {
      this.ordersPredictions.set(data);
    });
  }

  getOrdersPredictionsByCustomer(customerName: string) {
    this.http.get(`${this.baseUrl}api/Order/sale-date-prediction?companyName=${customerName}`).subscribe((data: any) => {
      this.ordersPredictions.set(data);
    });
  }

  getOrders(custId: number) {
    return this.http.get(`${this.baseUrl}api/Order?custId=${custId}`).subscribe((data: any) => {
      this.orders.set(data);
    });
  }

  createOrder(order: any) {
    return this.http.post(`${this.baseUrl}api/Order`, order).subscribe((data: any) => {
      console.log('Order created:', data);
    });
  }
}
