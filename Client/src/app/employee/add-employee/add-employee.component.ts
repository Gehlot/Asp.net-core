import { Component, OnInit } from "@angular/core";
import { Subject } from "rxjs";
import { BsModalRef } from "ngx-bootstrap";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { UserService } from "../../_services/index";
@Component({
  selector: "app-add-employee",
  templateUrl: "./add-employee.component.html",
  styleUrls: ["./add-employee.component.css"]
})
export class AddEmployeeComponent implements OnInit {
  employeeForm: FormGroup;
  submitted = false;
  errorAlert: boolean = false;
  errorMessage:string;
  constructor(
    private _bsModalRef: BsModalRef,
    private formBuilder: FormBuilder,
    private employeeService: UserService
  ) {}
  get f() {
    return this.employeeForm.controls;
  }
  public onClose: Subject<any>;
  ngOnInit() {
    this.employeeForm = this.formBuilder.group({
      name: ["", Validators.required],
      email: ["", [Validators.required, Validators.email]],
      password: ["", Validators.required]
    });
    this.onClose = new Subject();
  }
  public onSubmit(): void {
    this.submitted = true;
    if (!this.employeeForm.valid) {
      return;
    }
    this.employeeService.AddEmployee(this.employeeForm.value).subscribe(
      data => {
          this.onClose.next(data);
          if (data == 1) {
            this.errorMessage = "Email already exits";
            this.errorAlert = true;
          } else {
          
          }
        
      },
      error => {}
    );
  }
  hide() {
    this._bsModalRef.hide();
  }
}
