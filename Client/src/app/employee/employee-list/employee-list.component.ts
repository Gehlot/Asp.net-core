import {
  Component,
  OnInit,
  ViewChild,
  OnDestroy,
  AfterViewInit
} from "@angular/core";
import { DataTables } from "datatables.net-dt";
import { HttpClient } from "@angular/common/http";
import { DataTablesResponse } from "../../_models/index";
import { DataTableDirective } from "angular-datatables";
import { Subject } from "rxjs";
import { BsModalService, BsModalRef } from "ngx-bootstrap";
import { AddEmployeeComponent } from "../add-employee/add-employee.component";
@Component({
  selector: "app-employee-list",
  templateUrl: "./employee-list.component.html",
  styleUrls: ["./employee-list.component.css"]
})
export class EmployeeListComponent implements AfterViewInit, OnInit, OnDestroy {
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;

  public modalRef: BsModalRef;
  public employeeData = [];
  alert: Boolean;
  message: String;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<boolean> = new Subject();
 

  constructor(private http: HttpClient, private modalService: BsModalService) {}

  ngOnInit(): void {
    
    this.FillDataTable();
  }
  ngAfterViewInit(): void {
    this.dtTrigger.next();
  }
  openConfirmDialog() {
    this.modalRef = this.modalService.show(AddEmployeeComponent);
    this.close();
  }
  close() {
    this.modalRef.content.onClose.subscribe(result => {
      if (result == 0) {
        this.modalRef.hide();
        this.rerender();
        this.FillDataTable();
        this.alert = true;
        this.message = "Employee added successfully";
      }
    });
  }
  FillDataTable() {
    this.dtOptions = {
      pagingType: "full_numbers",
      pageLength: 5,
      serverSide: true,
      ajax: (dataTablesParameters: any, callback) => {
        this.http
          .post<DataTablesResponse>(
            "http://localhost:5000/api/employee/GetAllEmployee",
            dataTablesParameters,
            {}
          )
          .subscribe(resp => {
            this.employeeData = resp.data;
            callback({
              recordsTotal: resp.recordsTotal,
              recordsFiltered: resp.recordsFiltered,
              data: []
            });
          });
      },
      columns: [
        { data: "Name" },
        { data: "Email" },
        { data: "Status" },
        { data: "Action" }
      ]
    };
  }
  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first
      dtInstance.destroy();
      // Call the dtTrigger to rerender again
      this.dtTrigger.next();
    });
  }
  EditEmployee(Id) {
    this.modalRef = this.modalService.show(AddEmployeeComponent);
   
  }
  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }
}
