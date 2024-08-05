import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CurrencyService {

  private api_url = environment.APIURL +'currencies';
  constructor(private http: HttpClient) { }

  getCurrencies():Observable<any> {
    return this.http.get(this.api_url);
  }
}
