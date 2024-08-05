import { Component } from '@angular/core';
import { LoaderService } from '../services/loader.service';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-loader',
  standalone: true,
  imports: [
    AsyncPipe
  ],
  templateUrl: './loader.component.html',
  styleUrl: './loader.component.scss'
})
export class LoaderComponent {
  constructor(private loaderService: LoaderService) { }

  isLoading = this.loaderService.isLoading$;

  isContent = this.loaderService.isLoadingContent$;
}
