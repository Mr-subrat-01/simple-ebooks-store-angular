import { NgClass, NgIf } from '@angular/common';
import { Component, OnDestroy, Renderer2 } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { Subscription } from 'rxjs';

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
export class HeaderComponent implements OnDestroy {

  isNavbarOpen = false;

  routerSubscription: Subscription;

  constructor(private router: Router, private render:Renderer2) {
   this.routerSubscription= router.events.subscribe((ev) => {
      if (ev instanceof NavigationEnd) {
        this.closeNavBar();
      }
    })
  }

  closeNavBar() {
    this.isNavbarOpen = false;
    this.SetBodyOverFlow(this.isNavbarOpen);
  }
  
  toggleNavbar() {
    this.isNavbarOpen = !this.isNavbarOpen;
    this.SetBodyOverFlow(this.isNavbarOpen);
  }
  
  SetBodyOverFlow(isNavOpen: boolean) {
    if (isNavOpen) {
      this.render.setStyle(document.body,'overflow','hidden')
    } else {
      this.render.setStyle(document.body,'overflow','auto')
    }
  }

  ngOnDestroy(): void {
    this.routerSubscription.unsubscribe();
    this.SetBodyOverFlow(this.isNavbarOpen);
  }
}
