import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { AuthenticationService, navbarService } from "../_services";
import { Observable } from "rxjs";
@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"]
})
export class LoginComponent implements OnInit {
  isLoggedIn$: Observable<boolean>;
  loginForm: FormGroup;
  submitted = false;
  passwordAlert: boolean = false;
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authenticationService: AuthenticationService,
    public nav: navbarService
  ) {
    // redirect to home if already logged in

    if (this.authenticationService.isLoggedIn) {
      this.router.navigateByUrl("dashboard");
    }
  }
  // redirect to home if already logged in

  get f() {
    return this.loginForm.controls;
  }

  ngOnInit() {
    this.nav.hide();
    this.loginForm = this.formBuilder.group({
      email: ["", [Validators.required, Validators.email]],
      password: ["", Validators.required]
    });
  }

  onSubmit() {
    
    this.submitted = true;
    // stop here if form is invalid
    if (this.loginForm.invalid) {
      return;
    }
    this.authenticationService.login(this.loginForm.value).subscribe(
      data => {
        if (data) {
          this.router.navigate(["dashboard"]);
        } else {
          this.passwordAlert = true;
          return;
        }
      },
      error => {}
    );
  }
}
