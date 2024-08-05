import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { load } from "@cashfreepayments/cashfree-js";
declare var Razorpay: any;

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  constructor(private http: HttpClient) { }

  createOrder(orderData: any): Observable<any> {
    return this.http.post(environment.APIURL + 'create-order', orderData);
  }

  verifyPayment(paymentData: any): Observable<any> {
    return this.http.post(environment.APIURL + 'verify-payment', paymentData);
  }
  createCfOrder(orderData: any): Observable<any> {
    return this.http.post(environment.APIURL + 'create-cf-order', orderData);
  }

  verifyCfPayment(order_id: any): Observable<any> {
    return this.http.post(environment.APIURL + 'verify-cf-payment', order_id);
  }

  handleRazorpayPayment(orderData: any, componentInstance: any) {
    try {
      const createOrderSub = this.createOrder(orderData).subscribe({
        next: order => {
          console.log(order);
          const options = {
            key: environment.KEY_ID,
            amount: componentInstance.selectedBook.price * 100,
            currency: componentInstance.selectedCurrencyCode,
            name: 'INKWELLBOOKS',
            description: 'Purchase of Books',
            order_id: order.order_id,
            handler: (response: any) => {
              const paymentData = {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                name: componentInstance.checkoutForm.getRawValue().name,
                email: componentInstance.checkoutForm.getRawValue().email,
                amount: componentInstance.selectedBook.price,
                bookId: componentInstance.selectedBook.id,
                currency: componentInstance.selectedCurrencyCode,
                userid: componentInstance.id || null,
                price: componentInstance.price || null
              };
              const verifyPaymentSub = this.verifyPayment(paymentData).subscribe({
                next: res => {
                  componentInstance.onPaymentSuccess();
                },
                error: err => {
                  console.log(err);
                  componentInstance.onPaymentFailure();
                }
              });
              componentInstance.subscriptions.push(verifyPaymentSub);
            },
            prefill: {
              name: componentInstance.checkoutForm.getRawValue().name,
              email: componentInstance.checkoutForm.getRawValue().email,
              contact: componentInstance.checkoutForm.getRawValue().phone,
            },
            theme: {
              color: '#284246'
            },
            modal: {
              ondismiss: () => {
                componentInstance.onPaymentModalDismiss();
              }
            },
            readonly: {
              email: true,
              contact: true
            }
          };
          console.log(options);
          const razorpay = new Razorpay(options);
          razorpay.open();
        },
        error: err => {
          componentInstance.onPaymentFailure();
          console.log(err);
        }
      });
      componentInstance.subscriptions.push(createOrderSub);
    } catch (error) {
      console.error('Error loading Cashfree:', error);
      componentInstance.onPaymentFailure();
    }
  }

  handleCashfreePayment(orderData: any, componentInstance: any) {
    try {
      const createOrderSub = this.createCfOrder(orderData).subscribe({
        next: async order => {
          const cashfree = await load({ mode: "production" }); // or "" sandbox
          const cashfreeOptions = {
            paymentSessionId: order.payment_session_id,
            redirectTarget: '_modal',
            // returnUrl: `http://localhost:4200/checkout/${this.selectedBook.id}?cf=${order.order_id}`
          };
          cashfree.checkout(cashfreeOptions).then((result: any) => {
            console.log(result);
            if (result.error) {
              // This will be true whenever user clicks on close icon inside the modal or any error happens during the payment
              console.log("User has closed the popup or there is some payment error, Check for Payment Status");
              console.log(result.error);
              componentInstance.onPaymentFailure();
            }
            if (result.redirect) {
              // This will be true when the payment redirection page couldnt be opened in the same window
              // This is an exceptional case only when the page is opened inside an inAppBrowser
              // In this case the customer will be redirected to return url once payment is completed
              console.log("Payment will be redirected");
            }
            if (result.paymentDetails) {
              const paymentData = {
                order_id: order.order_id,
                amount: componentInstance.selectedBook.price,
                bookId: componentInstance.selectedBook.id,
                currency: componentInstance.selectedCurrencyCode,
                userid: componentInstance.id || null,
                price: componentInstance.price || null
              };
              const verifyPaymentSub = this.verifyCfPayment(paymentData).subscribe({
                next: res => {
                  // console.log(res);
                  if (res == "PAID") {
                    componentInstance.onPaymentSuccess();
                  }
                },
                error: err => {
                  console.log(err);
                  componentInstance.onPaymentFailure();
                }
              });
              componentInstance.subscriptions.push(verifyPaymentSub);
              // This will be called whenever the payment is completed irrespective of transaction status
              // console.log("Payment has been completed, Check for Payment Status");
              // console.log(result.paymentDetails.paymentMessage);
            }
          });
        },
        error: err => {
          console.error(err);
          componentInstance.onPaymentFailure();
        }
      });
      componentInstance.subscriptions.push(createOrderSub);
    } catch (error) {
      console.error('Error loading Cashfree:', error);
      componentInstance.onPaymentFailure();
    }
  }
}
