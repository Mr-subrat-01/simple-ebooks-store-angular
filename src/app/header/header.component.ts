import { NgClass, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    NgClass,
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent  {
  constructor(private router: Router) {
    router.events.subscribe((ev) => {
      if (ev instanceof NavigationEnd) {
        this.isNavbarOpen = false;
      }
    })
  }
  isNavbarOpen = false;
  
  toggleNavbar() {
    this.isNavbarOpen = !this.isNavbarOpen;
  }
}
