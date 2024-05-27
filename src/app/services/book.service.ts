import { Injectable } from '@angular/core';
import { Book } from '../Models/book';

@Injectable({
  providedIn: 'root'
})
export class BookService {

  constructor() { }
  getBooks():Book[] {
    return [
      { title: 'Book 1', author: 'Author 1', imageUrl: '/cover.jpg' },
      { title: 'Book 2', author: 'Author 2', imageUrl: '/cover.jpg' },
      { title: 'Book 3', author: 'Author 3', imageUrl: '/cover.jpg' },
      { title: 'Book 1', author: 'Author 1', imageUrl: '/cover.jpg' },
      { title: 'Book 2', author: 'Author 2', imageUrl: '/cover.jpg' },
      { title: 'Book 3', author: 'Author 3', imageUrl: '/cover.jpg' },
      { title: 'Book 1', author: 'Author 1', imageUrl: '/cover.jpg' },
      { title: 'Book 2', author: 'Author 2', imageUrl: '/cover.jpg' },
      { title: 'Book 3', author: 'Author 3', imageUrl: '/cover.jpg' },
      { title: 'Book 1', author: 'Author 1', imageUrl: '/cover.jpg' },
      // Add more books as needed
    ];
  }
}
