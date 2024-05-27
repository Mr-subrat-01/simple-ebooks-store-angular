import { NgFor } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { BookService } from '../services/book.service';
import { Book } from '../Models/book';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    NgFor
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  newBooks:Book[] = [];
  constructor(private books: BookService) { }
  
  ngOnInit() {
    this.newBooks = this.books.getBooks();
  }
}
