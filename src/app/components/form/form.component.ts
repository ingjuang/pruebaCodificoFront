
import { CommonModule } from '@angular/common';
import { Component, computed, Inject, inject, OnInit, signal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatInputModule } from '@angular/material/input'; // Asegúrate de importar MatInputModule
import { MatNativeDateModule, provideNativeDateAdapter } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { EmployeeService } from 'src/app/services/employee.service';
import { ProductService } from 'src/app/services/product.service';
import { ShipperService } from 'src/app/services/shipper.service';
import { OrderService } from 'src/app/services/order.service';


@Component({
  selector: 'app-form',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatToolbarModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatIconModule,
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './form.component.html',
  styleUrl: './form.component.scss',
})
export class FormComponent implements OnInit {
  orderForm!: FormGroup;
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<FormComponent>);
  private employeeService = inject(EmployeeService);
  private productService = inject(ProductService);
  private shipperService = inject(ShipperService);
  private orderService = inject(OrderService);
  public customerName = signal<string>('');

  public employees = computed<any[]>(() =>
    this.employeeService.employees()
  );

  public shippers = computed<any[]>(() =>
    this.shipperService.shippers()
  );

  public products = computed<any[]>(() =>
    this.productService.products()
  );

  constructor(@Inject(MAT_DIALOG_DATA) public dialogData: any) {}

  ngOnInit(): void {
    this.initializeForm();
    this.getEmployees();
    this.getShippers();
    this.getProducts();
    this.customerName.set(this.dialogData.customerName);
  }

  initializeForm() {
    this.orderForm = this.fb.group({
      orderId: [0],
      empId: [null, Validators.required],
      shipperId: [null, Validators.required],
      shipName: ['', Validators.required],
      shipAddress: ['', Validators.required],
      shipCity: ['', Validators.required],
      shipCountry: ['', Validators.required],
      orderDate: [null, Validators.required],
      requiredDate: [null, Validators.required],
      shippedDate: [null, Validators.required],
      freight: [null, [Validators.required, Validators.min(0)]],
      custId: [this.dialogData.custId],
      orderDetail: this.fb.group({
        orderId: [0],
        productId: [null, Validators.required],
        unitPrice: [null, [Validators.required, Validators.min(0)]],
        qty: [null, [Validators.required, Validators.min(1)]],
        discount: [null, [Validators.required, Validators.min(0), Validators.max(100)]],
      }),
    });
  }

  onSubmit(): void {
    if (this.orderForm.valid) {
      console.log('Order saved:', this.orderForm.value);
      this.orderService.createOrder(this.orderForm.value);
      alert('Order saved successfully!');
      this.resetForm();
    } else {
      alert('Please fill all required fields correctly.');
    }
  }

  getEmployees() {
    this.employeeService.getEmployees();
  }
  getShippers() {
    this.shipperService.getShippers();
  }
  getProducts() {
    this.productService.getProducts();
  }

  createOrder() {
  }

  // Método para cerrar o resetear el formulario
  resetForm(): void {
    this.orderForm.reset();
    this.dialogRef.close();
  }


}
