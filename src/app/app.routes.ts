import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { BookListComponent } from './book-list/book-list.component';
import { AboutComponent } from './about/about.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { ReturnCancellationComponent } from './return-cancellation/return-cancellation.component';
import { NotfoundComponent } from './notfound/notfound.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { OrdersComponent } from './orders/orders.component';
import { ProfileComponent } from './profile/profile.component';
import { TermsAndConditionsComponent } from './terms-and-conditions/terms-and-conditions.component';
import { DisclaimerComponent } from './disclaimer/disclaimer.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'books', component: BookListComponent },
    { path: 'about', component: AboutComponent },
    { path: 'privacy-policy', component: PrivacyPolicyComponent },
    { path: 'contact-us', component: ContactUsComponent },
    { path: 'return-cancellation', component: ReturnCancellationComponent },
    { path: 'checkout/:id', component: CheckoutComponent },
    { path: 'orders', component: OrdersComponent },
    { path: 'profile', component: ProfileComponent },
    { path: 'terms-and-conditions', component: TermsAndConditionsComponent },
    { path: 'disclaimer',component:DisclaimerComponent},
    { path: 'not-found', component: NotfoundComponent },
    { path: '**', redirectTo: 'not-found' } 
];
