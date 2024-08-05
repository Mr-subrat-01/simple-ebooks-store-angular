import { Component, OnInit, inject } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { LoaderComponent } from './loader/loader.component';
import { LoaderService } from './services/loader.service';
import { TopbarComponent } from './topbar/topbar.component';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports:
    [
      RouterOutlet,
      HeaderComponent,
      FooterComponent,
      LoaderComponent,
      TopbarComponent
    ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'inkwellbooks';

  constructor(private loaderService: LoaderService, private authService: AuthService,private router:Router) {}

  // coins: number = 0;
  // id: string = "";
  email: string = '';
  isLoggedIn: boolean = false;


  ngOnInit() {
    if (this.authService.isLoggedIn()) {
      this.isLoggedIn = true;
      this.reloadUser();
    }
    this.loaderService.show();
    window.addEventListener('load', () => {
      this.loaderService.hide();
    });
  }

  reloadUser() {
     const userDetails = this.authService.getUserDetails();
      this.authService.fetchUserDetails(userDetails.email).subscribe({
        next: user => {
          if (user) {
            this.authService.storeUserDetails(user);
            // this.coins = user.coins;
            // this.id = user.id;
          } else {
            this.isLoggedIn = false;
          }
        }
      })
  }
}
