using System;
using System.Collections.Generic;

namespace UserIdenetity.Model
{
    public partial class Project
    {
        public Project()
        {
            Credential = new HashSet<Credential>();
        }

        public Guid Id { get; set; }
        public string Name { get; set; }
        public bool? Status { get; set; }

        public ICollection<Credential> Credential { get; set; }
    }
}
