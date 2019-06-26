import { Component, OnInit } from "@angular/core";
import { AuthenticationService, navbarService } from "src/app/_services/index";

@Component({
  selector: "app-navbar",
  templateUrl: "./navbar.component.html",
  styleUrls: ["./navbar.component.css"]
})
export class NavbarComponent implements OnInit {
  userName: string;
  IsAdmin: boolean;
  constructor(
    public nav: navbarService,
    public authenticationService: AuthenticationService
  ) {}

  ngOnInit() {
    this.nav.show();
  }

  Logout() {
    this.authenticationService.logout();
  }
}
