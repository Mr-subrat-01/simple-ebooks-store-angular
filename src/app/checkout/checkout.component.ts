import { Component, OnDestroy, OnInit } from '@angular/core';
import { Book } from '../Models/book';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { BookService } from '../services/book.service';
import { CurrencyPipe, DecimalPipe, NgIf } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { PaymentService } from '../services/payment.service';
import { LoaderService } from '../services/loader.service';
import { AuthService } from '../services/auth.service';
import { Subscription } from 'rxjs';
import { CurrencyService } from '../services/currency.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [
    CurrencyPipe,
    RouterLink,
    FormsModule,
    ReactiveFormsModule,
    NgIf,
    DecimalPipe,
  ],
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit, OnDestroy {
  selectedBook: Book = null;
  isPaymentSuccess: boolean = false;
  setName: string = '';
  setEmail: string = '';
  checkoutForm: FormGroup;
  isLoggedIn: boolean = false;
  uniq_id: string = '';
  isOrdered: boolean = false;
  orderBookTitle: string = '';
  // paymentMode: string = 'money';

  supportedCurrencies: string[] = [];
  paymentGatways: string[] = ["Cashfree"];
  selectedGateway: string = "";
  selectedCurrencyCode: string = 'INR';
  convertedPrice: number = 0;
  exchangeRates: any = {};

  token: string = '';

  checkLoading: boolean = false;

  private subscriptions: Subscription[] = [];

  constructor(
    private bookservice: BookService,
    private activatedRoute: ActivatedRoute,
    private paymentService: PaymentService,
    private loaderService: LoaderService,
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private currencyService: CurrencyService
  ) {
    if (authService.isLoggedIn()) {
      const userDetails = this.authService.getUserDetails();
      // console.log(userDetails);
      this.setName = userDetails.name;
      this.setEmail = userDetails.email;
      this.uniq_id = userDetails.id;
      this.isLoggedIn = true;
      this.checkoutForm = formBuilder.group({
        name: [{ value: this.setName, disabled: true }, Validators.required],
        email: [{ value: this.setEmail, disabled: true }, [Validators.required, Validators.email]],
        currency: [this.selectedCurrencyCode, Validators.required],
        pg: [this.selectedGateway, Validators.required],
        phone: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]]
      });
    } else {
      this.checkoutForm = formBuilder.group({
        name: ['', Validators.required],
        email: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)]],
        currency: [this.selectedCurrencyCode, Validators.required],
        pg: [this.selectedGateway, Validators.required],
        phone: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]]
      });
    }
  }
  ngOnInit(): void {
    this.setSelectedBook();
    this.findUserIdPrice();
  }
  findUserIdPrice() {
    const queryParamSub = this.activatedRoute.queryParams.subscribe({
      next: params => {
        if (params['token']) {
          // console.log(params['token'])
          this.token = params['token'];
        }
      }
    });
    this.subscriptions.push(queryParamSub);
  }
  setSelectedBook() {
    this.loaderService.show();
    const bookid: string = this.activatedRoute.snapshot.paramMap.get('id');
    const getBookByIdSub = this.bookservice.getBookById(bookid, this.uniq_id).subscribe({
      next: res => {
        if (res.message == 'ordered') {
          this.orderBookTitle = res.data.title;
          this.isOrdered = true;
        }
        // console.log(res.message);
        this.fetchCurrencies();
        this.selectedBook = res;
        this.loaderService.hide();
      },
      error: err => {
        this.selectedBook = null;
        this.loaderService.hide();
      }
    });
    this.subscriptions.push(getBookByIdSub);
  }
  OnOrderPlaced() {
    if (this.isLoggedIn) {
      const userDetails = this.authService.getUserDetails();
      this.setName = userDetails.name;
      this.setEmail = userDetails.email;
    }
    this.loaderService.showContent();
    this.loaderService.show();
    if (this.selectedBook && !this.checkoutForm.invalid) {
      const orderData = {
        name: this.checkoutForm.getRawValue().name,
        email: this.checkoutForm.getRawValue().email,
        phone: this.checkoutForm.getRawValue().phone,
        amount: this.selectedBook.price,
        bookId: this.selectedBook.id,
        currency: this.selectedCurrencyCode,
        token: this.token || null,
      //  mode:"dev"
      };
      if (this.selectedGateway == "Cashfree") {
        this.paymentService.handleCashfreePayment(orderData,this);
      } else if (this.selectedGateway == "Razorpay") {
        this.paymentService.handleRazorpayPayment(orderData, this);
      }
    } else {
      this.loaderService.hideContent();
      this.loaderService.hide();
      alert('Selected book is missing or checkout form is invalid');
    }
  }
  onPaymentSuccess() {
    if (!this.isLoggedIn) {
      const fetchUserDetailsSub = this.authService.fetchUserDetails(this.checkoutForm.value.email).subscribe({
        next: user => {
          // console.log(user);
          this.authService.storeUserDetails(user);
        },
        error: err => {
          console.log(err);
        }
      });
      this.subscriptions.push(fetchUserDetailsSub);
    }
    // console.log(res);
    this.isPaymentSuccess = true;
    this.loaderService.hideContent();
    this.loaderService.hide();
  }
  onPaymentFailure(error: any) {
    alert("Payment Verification failed..try again..");
    console.log(error);
    this.loaderService.hideContent();
    this.loaderService.hide();
  }
  onPaymentModalDismiss() {
    this.loaderService.hideContent();
    this.loaderService.hide();
  }
  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
  onCurrencyChange(event: any) {
    this.selectedCurrencyCode = event.target.value;
    this.updateConvertedPrice();
  }
  onPgChange(event: any) {
    this.selectedGateway = event.target.value;
    console.log(this.selectedGateway);
  }
  fetchCurrencies() {
    this.loaderService.show();
    const fetchCurrenciesSub = this.currencyService.getCurrencies().subscribe({
      next: data => {
        data.forEach((c_code: any) => {
          this.supportedCurrencies.push(c_code.currency_code);
          this.exchangeRates[c_code.currency_code] = c_code.exchange_rate;
        })
        this.updateConvertedPrice();
        this.loaderService.hide();
      }, error: err => {
        this.loaderService.hide();
        console.log(err);
      }
    });
    this.subscriptions.push(fetchCurrenciesSub);
  }
  updateConvertedPrice() {
    if (this.selectedBook && this.exchangeRates[this.selectedCurrencyCode]) {
      console.log("Update validate")
      this.convertedPrice = this.selectedBook.price * this.exchangeRates[this.selectedCurrencyCode];
    } else {
      console.log("Update invalid")
    }
  }
}
