import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [],
  templateUrl: './topbar.component.html',
  styleUrl: './topbar.component.scss'
})
export class TopbarComponent {
  // @Input() userId: string ="########";
  // @Input() userCoins: number = 0;
  
  constructor(private router:Router){}
  goToUserDetails() {
     this.router.navigate(['/orders']);
  }


}
