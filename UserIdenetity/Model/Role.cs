using System;
using System.Collections.Generic;

namespace UserIdenetity.Model
{
    public partial class Role
    {
        public Role()
        {
            Employee = new HashSet<Employee>();
        }

        public Guid Id { get; set; }
        public string Name { get; set; }

        public ICollection<Employee> Employee { get; set; }
    }
}
