import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {

  private apiUrl = environment.APIURL + 'categories';
  constructor(private http:HttpClient) { }

  getCategories(): Observable<Array<{ id: number, name: string }>> {
    return this.http.get<Array<{ id: number, name: string }>>(this.apiUrl);
  }
}
