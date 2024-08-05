import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-contact-us',
  standalone: true,
  imports: [
    FormsModule
  ],
  templateUrl: './contact-us.component.html',
  styleUrl: './contact-us.component.scss'
})
export class ContactUsComponent {
  constructor(private http: HttpClient) { }
  api_url = environment.APIURL;
  onSubmit(form: any) {
    const contactData = {
      name: form.value.name,
      email: form.value.email,
      message: form.value.message
    };
    // console.log(contactData);

    this.http.post(this.api_url + 'contact', contactData).subscribe({
      next: response => {
        console.log(response);
        alert("Message Send Successfully We will reach out soon..")
        form.resetForm();
      },
      error: err => {
        console.log(err);
        alert("Faild To Send Message!!");
      }
    });
  }
}
