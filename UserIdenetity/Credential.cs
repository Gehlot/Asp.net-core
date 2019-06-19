using System;
using System.Collections.Generic;

namespace UserIdenetity
{
    public partial class Credential
    {
        public Guid Id { get; set; }
        public Guid? ProjectId { get; set; }
        public string Url { get; set; }
        public string UserName { get; set; }
        public string Password { get; set; }
        public string Description { get; set; }
        public bool? IsViewAdminOnly { get; set; }
        public bool? Status { get; set; }
    }
}
