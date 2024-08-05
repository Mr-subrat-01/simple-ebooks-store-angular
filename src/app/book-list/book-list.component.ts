import { Component, OnDestroy, OnInit } from '@angular/core';
import { Book } from '../Models/book';
import { BookService } from '../services/book.service';
import { CurrencyPipe, NgClass, NgFor, NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';
import { LoaderService } from '../services/loader.service';
import { CategoriesService } from '../services/categories.service';
import { FormsModule } from '@angular/forms';
import { MatSlider, MatSliderModule } from '@angular/material/slider';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-book-list',
  standalone: true,
  imports: [
    NgFor,
    RouterLink,
    NgIf,
    CurrencyPipe,
    NgClass,
    FormsModule,
    MatSliderModule,

  ],
  templateUrl: './book-list.component.html',
  styleUrl: './book-list.component.scss'
})
export class BookListComponent implements OnInit, OnDestroy {

  books: Book[] = [];
  categories = [];
  totalItems: number = 0;
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalPages: number = 0;
  isCategoryOpen: boolean = true;
  selectedCategoryId: number | null = null;

  minPrice: number = 100;
  maxPrice: number = 5000;

  private subscription: Subscription[] = []; 

  OnToggleCategory() {
    this.isCategoryOpen = !this.isCategoryOpen;
  }

  ngOnDestroy(): void {
    this.subscription.forEach(sub => sub.unsubscribe());
  }

  constructor(private bookService: BookService, private loader: LoaderService, private categoryService: CategoriesService) { }

  ngOnInit(): void {
    this.loadBooks();
    this.loadCategories();
  }

  loadBooks(): void {
    
    const filters = {
      categoryId: this.selectedCategoryId,
      minPrice: this.minPrice,
      maxPrice: this.maxPrice,
    };
    this.loader.show();
    const bookServiceSub = this.bookService.getBooks(this.currentPage, this.itemsPerPage, filters).subscribe(response => {
      this.books = response.data;
      this.totalItems = response.total;
      this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
      this.loader.hide();
    });
    this.subscription.push(bookServiceSub)
  }

  onPageChange(page: number): void {
    if (page < 1 || page > this.totalPages) {
      return;
    }
    this.currentPage = page;
    this.loadBooks();
  }

  loadCategories() {
    const categoryServiceSub = this.categoryService.getCategories().subscribe({
      next: response => {
        // console.log(response);
        this.categories = response;
      }
    });
    this.subscription.push(categoryServiceSub);
  }

  onCategoryChange(categoryId: number): void {
    this.selectedCategoryId = categoryId;
    this.totalPages = 0;
    this.currentPage = 1; // Reset to first page when category changes
    this.loadBooks();
  }
  applyPriceFilter() {
    this.totalPages = 0;
    this.currentPage = 1; // Reset to first page when category changes
    this.loadBooks();
  }
}
