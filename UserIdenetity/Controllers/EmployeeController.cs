using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Web;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using Newtonsoft.Json;
using UserIdenetity.Helpers;
using UserIdenetity.Model;
using UserIdenetity.Provider;
using UserIdenetity.Services;
namespace UserIdenetity.Controllers {
    [Authorize]
    [Route ("api/[controller]")]
    [EnableCors ("AllowCors")]
    public class EmployeeController : Controller {
        #region Dependency injection                 
        private IEmployeeService _employeeservice;
        private readonly IHttpContextAccessor _httpContextAccessor;
        public IConfiguration _configuration { get; }
        private IMapper _mapper;
        public EmployeeController (IEmployeeService employeeservice, IMapper mapper, IConfiguration configuration, IHttpContextAccessor httpContextAccessor) {
            _employeeservice = employeeservice;
            _configuration = configuration;
            _mapper = mapper;
            _httpContextAccessor = httpContextAccessor;

        }
        #endregion

        [AllowAnonymous]
        [HttpPost ("authenticate")]
        [EnableCors ("AllowAll")]
        public IActionResult Authenticate ([FromBody] LoginDto loginDto) {
            var user = _employeeservice.Authenticate (loginDto.email, loginDto.password);

            if (user == null)
                return new ObjectResult (null);
            //return Unauthorized ();

            var role = _employeeservice.GetRole (new Guid (user.RoleId.ToString ()));
            var tokenHandler = new JwtSecurityTokenHandler ();
            var key = Encoding.UTF8.GetBytes (_configuration["Jwt:Secret"]);
            var tokenDescriptor = new SecurityTokenDescriptor {
                Subject = new ClaimsIdentity (new Claim[] {
                new Claim (ClaimTypes.Name, user.Id.ToString ())
                }),
                Expires = DateTime.UtcNow.AddMinutes (2),
                SigningCredentials = new SigningCredentials (new SymmetricSecurityKey (key), SecurityAlgorithms.HmacSha256),
                Audience = _configuration["Jwt:Audience"],
                Issuer = _configuration["Jwt:Issuer"]
            };
            var token = tokenHandler.CreateToken (tokenDescriptor);
            var tokenString = tokenHandler.WriteToken (token);

            // return basic user info (without password) and token to store client side
            return new ObjectResult (new {
                Id = user.Id,
                    Email = user.Email,
                    UserName = user.Name,
                    Token = tokenString,
                    Role = role

            });
        }

        [AllowAnonymous]
        [HttpPost]
        [EnableCors ("AllowAll")]
        [Route ("register")]
        public IActionResult Register ([FromBody] Employeecls cls) {
            // Employee objEmployees = _mapper.Map<Employee> (employeesDto);
            Employee objEmployees = new Employee ();
            objEmployees.Email = cls.Email;
            objEmployees.Password = cls.Password;
            objEmployees.Name = cls.Name;
            try {
                // save 
                int result;
                result = _employeeservice.Create (objEmployees);
               
                    return new ObjectResult (result);
            
            } catch (AppException ex) {
                // return error message if there was an exception
                return BadRequest (ex.Message);
            }
        }

        [HttpPost]
        [Route ("GetAllEmployee")]
        [AllowAnonymous]
        [EnableCors ("AllowAll")]
        public IActionResult GetAll ([FromBody] DataTablecls objDataTablecls) {

            DataTablecls obj = objDataTablecls;

            // get Start (paging start index) and length (page size for paging)
            var draw = obj.draw;
            var start = obj.start;
            var length = obj.length;

            ////Get Sort columns value
            var sortColumnDir = obj.order.FirstOrDefault ().dir;
            var index = obj.order.FirstOrDefault ().column;
            var sortColumn = obj.columns[index].data;

            string search = obj.search.value;

            int pageSize = length != null ? Convert.ToInt32 (length) : 0;
            int skip = start != null ? Convert.ToInt32 (start) : 0;
            int totalRecords = 0;

            var sEcho1 = Convert.ToInt32 ((Convert.ToInt32 (start) + Convert.ToInt32 (length)) / Convert.ToInt32 (length));
            int pageNo = !string.IsNullOrEmpty (search) ? 1 : sEcho1;
            IEnumerable<Employee> lstEmployees = _employeeservice.GetAll (skip, pageSize, search);
            IEnumerable<EmployeesDto> objCustomer = (from item in lstEmployees select new EmployeesDto {
                Id = item.Id,
                    Email = item.Email,
                    Name = item.Name,

            }).ToList ();
            var count = _employeeservice.GetEmployeeCount (search);
            EmployeesDto UserDetails = new EmployeesDto ();
            UserDetails.data = objCustomer.ToList ();
            UserDetails.draw = draw;
            UserDetails.recordsFiltered = count;
            if (objCustomer.Count () > 0)
                UserDetails.recordsTotal = count;

            return new ObjectResult (UserDetails);
        }

        [HttpGet ("{id}")]
        [EnableCors ("AllowAll")] public IActionResult GetById (int id) {
            Employee objEmployees = _employeeservice.GetById (id);
            EmployeesDto objEmployeesDto = _mapper.Map<EmployeesDto> (objEmployees);
            return Ok (objEmployeesDto);
        }

        [HttpPut ("{id}")]
        [EnableCors ("AllowAll")] public IActionResult Update (string id, [FromBody] EmployeesDto employeesDto) {
            // map dto to entity and set id
            Employee objEmployees = _mapper.Map<Employee> (employeesDto);
            objEmployees.Id = new Guid (id);

            try {
                // save 
                _employeeservice.Update (objEmployees, employeesDto.Password);
                return Ok ();
            } catch (AppException ex) {
                // return error message if there was an exception
                return BadRequest (ex.Message);
            }
        }

        [HttpDelete ("{id}")]
        [EnableCors ("AllowAll")] public IActionResult Delete (int id) {
            _employeeservice.Delete (id);
            return Ok ();
        }
    }

}
public class Employeecls {
    public string Email { get; set; }
    public string Name { get; set; }
    public string Password { get; set; }
}