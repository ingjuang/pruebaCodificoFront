import { LiveAnnouncer } from '@angular/cdk/a11y';
import {
  AfterViewInit, Component, computed, effect, Inject, inject, Injector, Input, runInInjectionContext, signal, ViewChild,
} from '@angular/core';
import { MatSort, Sort, MatSortModule } from '@angular/material/sort';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { OrderService } from 'src/app/services/order.service';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  selector: 'app-table',
  imports: [
    MatTableModule,
    MatSortModule,
    MatTableModule,
    MatPaginatorModule,
    MatDialogModule,
    MatButtonModule,
    MatToolbarModule
  ],
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss',
})
export class TableComponent implements AfterViewInit {
  private readonly orderService = inject(OrderService);
  public orders = computed<any[]>(() => this.orderService.orders());
  public customerName = signal<string>('');

  private _liveAnnouncer = inject(LiveAnnouncer);

  displayedColumns: string[] = [
    'orderId',
    'requiredDate',
    'shipAddress',
    'shipCity',
    'shipName',
    'shippedDate',
  ];
  dataSource = new MatTableDataSource(this.orders());

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    public dialogRef: MatDialogRef<TableComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogData: any,
    private injector: Injector
  ) {
    runInInjectionContext(this.injector, () => {
      effect(() => {
        this.dataSource.data = this.orders();
      });
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.getOrders(this.dialogData.custId);
    this.customerName.set(this.dialogData.customerName);
  }

  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

  getOrders(custId: number) {
    this.orderService.getOrders(custId);
  }

  close(): void {
    this.dialogRef.close();
  }
}
