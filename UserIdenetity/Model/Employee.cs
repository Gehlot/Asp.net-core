using System;
using System.Collections.Generic;

namespace UserIdenetity.Model {
    public partial class Employee {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public Guid? RoleId { get; set; }
        public bool? Status { get; set; }

        public Role Role { get; set; }

       
    }
}