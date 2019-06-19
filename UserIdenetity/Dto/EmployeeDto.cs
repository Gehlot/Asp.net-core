using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using UserIdenetity.Model;
public class EmployeesDto {

    public Guid Id { get; set; }
    public string Name { get; set; }
    public string Email { get; set; }
    public string Password { get; set; }
    public Guid RoleId { get; set; }
    public bool Status { get; set; }
    public List<EmployeesDto> data { get; set; }
    public int draw { get; set; }
    public int recordsFiltered { get; set; }
    public int recordsTotal { get; set; }

    public Int32 TotalRows { get; set; }
}