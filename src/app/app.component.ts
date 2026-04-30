import { Component, OnInit } from '@angular/core';
import * as AOS from 'aos';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'AlamanaMarket';

  ngOnInit() {
    AOS.init({
      duration: 2000,
      once: false, 
      mirror: true
    });
  }



}
