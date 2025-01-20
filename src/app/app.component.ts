import {
  AfterViewInit,
  Component,
  computed,
  effect,
  inject,
  Injector,
  OnInit,
  runInInjectionContext,
  signal,
  ViewChild,
} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TableComponent } from '@components/table/table.component';
import { OrderService } from './services/order.service';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { FormComponent } from '@components/form/form.component';
import { MatToolbar } from '@angular/material/toolbar';
import { MatFormField, MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatIcon, MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-root',
  imports: [
    MatTableModule,
    MatSortModule,
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    MatDialogModule,
    MatToolbar,
    MatFormFieldModule,
    MatLabel,
    MatInput,
    MatIconModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit, AfterViewInit {
  private readonly orderService = inject(OrderService);
  private dialog = inject(MatDialog);
  private searchInput = signal<string>('');
  public ordersPredictions = computed<any[]>(() =>
    this.orderService.ordersPredictions()
  );

  private _liveAnnouncer = inject(LiveAnnouncer);

  displayedColumns: string[] = [
    'companyName',
    'lastOrderDate',
    'nextPredictedOrder',
    'action',
    'action2',
  ];
  dataSource = new MatTableDataSource(this.ordersPredictions());

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

  constructor(private injector: Injector) {
    runInInjectionContext(this.injector, () => {
      effect(() => {
        this.dataSource.data = this.ordersPredictions();
      });
    });
  }

  ngOnInit() {
    this.getOrdersPredictions();
  }

  viewOrders(custId: number, customerName: string) {
    const dialogRef = this.dialog.open(TableComponent, {
      width: '100%',
      maxWidth: '1000px',
      disableClose: true,
      data: { custId, customerName }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  createOrder(custId: number, customerName: string) {
    const dialogRef = this.dialog.open(FormComponent, {
      width: '100%',
      maxWidth: '1000px',
      disableClose: true,
      data: { custId, customerName }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  applyFilter(event: any) {
    this.searchInput.set(event.target.value);
    this.orderService.getOrdersPredictionsByCustomer(this.searchInput());
  }

  getOrdersPredictions() {
    this.orderService.getOrdersPredictions();
  }
}
