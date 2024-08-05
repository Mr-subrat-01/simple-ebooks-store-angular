import { CurrencyPipe, DatePipe, DecimalPipe, NgFor, UpperCasePipe } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { OrderService } from '../services/order.service';
import { LoaderService } from '../services/loader.service';
import { BookService } from '../services/book.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [
    NgFor,
    DatePipe,
    DecimalPipe,
    UpperCasePipe,
    CurrencyPipe
  ],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.scss'
})
export class OrdersComponent implements OnInit,OnDestroy {
  orders = [];
  
  totalItems: number = 0;
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalPages: number = 0
  userUniqueId: string;
  private subscriptions: Subscription[] = [];
  constructor(private authService: AuthService, private router: Router, private orderService: OrderService, private loader: LoaderService,private bookService:BookService) { }
  ngOnInit(): void {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/']);
    }
    this.userUniqueId = this.authService.getUserDetails().id;
    this.loadOrders();
  }
  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  downloadBook(order) {
    this.loader.show();
    const bookServiceSub=  this.bookService.downloadBook(order.book_id, order.user_unique_id, order.order_id).subscribe({
        next: blob => {
          this.loader.hide();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = order.title; // Use the book title or another identifier for the filename
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        },
        error: err => {
          alert(err.statusText);
          console.log(err);
          this.loader.hide();
        }
    });
    this.subscriptions.push(bookServiceSub);
    }


  loadOrders() {
    this.loader.show();
    const orderServiceSub = this.orderService.getOrders(this.userUniqueId, this.currentPage, this.itemsPerPage).subscribe({
      next: res => {
        this.orders = res.data;
        // console.log(this.orders);
        this.totalItems = res.total;
        this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
        this.loader.hide();
      },
      error: err => {
        console.log(err);
        this.loader.hide();
      }
    });
    this.subscriptions.push(orderServiceSub);
  }

  onPageChange(page: number): void {
    if (page < 1 || page > this.totalPages) {
      return;
    }
    this.currentPage = page;
    this.loadOrders();
  }
}
