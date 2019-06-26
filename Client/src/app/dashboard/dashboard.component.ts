import { Component, OnInit } from '@angular/core';
import { AuthenticationService,navbarService } from "../_services";
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  
  constructor( public nav: navbarService, public authenticationService: AuthenticationService, ) { }

  ngOnInit() {
   this.nav.show();

  }

}
