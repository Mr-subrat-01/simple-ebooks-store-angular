import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  
  private apiUrl = `${environment.APIURL}`;

  constructor(private http:HttpClient) { }

  getOrders(userUniqueId:string,currentPage: number, numPerPage: number): Observable<any> {
    const params = { user_unique_id: userUniqueId, perPage: numPerPage.toString(),page:currentPage.toString()};
    return this.http.get<any>(`${this.apiUrl}orders`,{params});
  }

  handelDownload(bookId:string):Observable<any> {
    return this.http.get(`${this.apiUrl}download/?id=${bookId}`)
  }
  

}
