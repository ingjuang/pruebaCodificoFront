import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '@envs/environment.development';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private readonly baseUrl = environment.baseUrl;
  private http = inject(HttpClient);

  public employees = signal<any[]>([]);

  constructor() { }

  public getEmployees() {
    this.http.get(`${this.baseUrl}api/Employee`).subscribe((data: any) => {
      this.employees.set(data);
    });
  }

}
