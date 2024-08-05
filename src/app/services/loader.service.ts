import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {

  private _isLoading = new BehaviorSubject<boolean>(false);
  public readonly isLoading$ = this._isLoading.asObservable();

  private _isLoadingContent = new BehaviorSubject<boolean>(false);
  public  readonly isLoadingContent$ = this._isLoadingContent.asObservable();

  show() {
    this._isLoading.next(true);
  }
  hide() {
    this._isLoading.next(false);
  }
  showContent() {
    this._isLoadingContent.next(true);
  }
  hideContent() {
    this._isLoadingContent.next(false);
  }

}
