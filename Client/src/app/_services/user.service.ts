import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../environments/environment";
import { User } from "../_models";
import { map } from "rxjs/operators";
@Injectable({ providedIn: "root" })
export class UserService {
  constructor(private http: HttpClient) {}

  getAll() {
    return this.http.get<User[]>(`${environment.apiEndpoint}/users`);
  }

  getById(id: number) {
    return this.http.get<User>(`${environment.apiEndpoint}/users/${id}`);
  }

  AddEmployee(employeeModel) {
    return this.http
      .post<any>(
        `${environment.apiEndpoint}/employee/register`,
        employeeModel
      )
      .pipe(
        map(data => {
          if (data) {
          }
          return data;
        })
      );
  }
}
