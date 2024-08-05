import { Injectable } from '@angular/core';
import { Book } from '../Models/book';
import { environment } from '../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BookService {

  private apiUrl = `${environment.APIURL}`;

  constructor(private http: HttpClient) { }

  getLatestBooks(): Observable<Book[]> {
    return this.http.get<Book[]>(`${this.apiUrl}latest-books`);
  }

  getBooks(page: number, itemsPerPage: number, filters: any): Observable<any> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('itemsPerPage', itemsPerPage.toString());

    if (filters.categoryId) {
      params = params.set('categoryId', filters.categoryId.toString());
    }
    if (filters.minPrice) {
      params = params.set('minPrice', filters.minPrice.toString());
    }
    if (filters.maxPrice) {
      params = params.set('maxPrice', filters.maxPrice.toString());
    }

    return this.http.get(`${this.apiUrl}ebooks`, { params });
  }

  getBooksByCategory(categoryId: number,page:number, perPage: number = 10): Observable<any> {
    let params = new HttpParams()
      .set('perPage', perPage.toString())
      .set('page',page.toString());
    return this.http.get(`${this.apiUrl}getebooks/category/${categoryId}`,{params});
  }


  getBookById(id: string, userid: string): Observable<Book> {
    if (userid) {
      return this.http.get<Book>(`${this.apiUrl}ebooks/${id}/${userid}`);
    } else {
      return this.http.get<Book>(`${this.apiUrl}ebooks/${id}`);
    }
  }

  purchaseWithCoins(userId: string, bookId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}buywithcoins`, { userId,bookId });
  }

  downloadBook(bookId: string, userId: string, orderId: string): Observable<any> {
    const params = new HttpParams()
      .set('bookId', bookId)
      .set('userId', userId)
      .set('orderId', orderId);
    return this.http.get(`${this.apiUrl}ebook/download`, { params, responseType: 'blob' });
  }
  
}
