import { CurrencyPipe, NgFor } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { BookService } from '../services/book.service';
import { Book } from '../Models/book';
import { Router, RouterLink } from '@angular/router';
import { LoaderService } from '../services/loader.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    NgFor,
    RouterLink,
    CurrencyPipe
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  
  newBooks: Book[] = [];
  constructor(private booksServices: BookService,private loaderService:LoaderService) { }

  ngOnInit() {
    // this.newBooks = this.booksServices.getBooks();
    this.getLatestBooks();
  }

  getLatestBooks() {
    this.loaderService.show();
    this.booksServices.getLatestBooks().subscribe({
      next: res => {
        this.newBooks = res;
        this.loaderService.hide();
      }
    });
  }
}
