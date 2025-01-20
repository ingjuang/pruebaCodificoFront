import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '@envs/environment.development';

@Injectable({
  providedIn: 'root'
})
export class ShipperService {
  private readonly baseUrl = environment.baseUrl;
  private http = inject(HttpClient);

  public shippers = signal<any[]>([]);

  constructor() { }

  public getShippers() {
    this.http.get(`${this.baseUrl}api/Shipper`).subscribe((data: any) => {
      this.shippers.set(data);
    });
  }
}
