using System;
using System.Collections.Generic;
using System.Linq;
using UserIdenetity.Helpers;
using UserIdenetity.Model;

namespace UserIdenetity.Services {
    public interface IEmployeeService {
        Employee Authenticate (string username, string password);
        IEnumerable<Employee> GetAll (int skip, int pageSize, string search);
        int GetEmployeeCount (string search);
        Employee GetById (int id);
        int Create (Employee user);
        void Update (Employee user, string password = null);
        void Delete (int id);

        string GetRole (Guid userId);
    }

    public class EmployeeService : IEmployeeService {
        private synsoftpcContext _context;

        public EmployeeService (synsoftpcContext context) {
            _context = context;
        }

        public Employee Authenticate (string username, string password) {
            if (string.IsNullOrEmpty (username) || string.IsNullOrEmpty (password))
                return null;

            var user = _context.Employee.SingleOrDefault (x => x.Email == username);

            // check if username exists
            if (user == null)
                return null;

            // check if password is correct
            if (!VerifyPasswordHash (password, user.Password))
                return null;

            // authentication successful
            return user;
        }

        public IEnumerable<Employee> GetAll (int skip, int pageSize, string search) {
            var employeeList = _context.Employee
                .Where (a => (search == "" || a.Email == search) || (search == "" || a.Name == search))
                .Skip (skip)
                .Take (pageSize)
                .ToArray ();
            return employeeList;

        }
        public int GetEmployeeCount (string search) {
            var Count = _context.Employee.Where (a => (search == "" || a.Email == search) || (search == "" || a.Name == search)).Count ();
            return Count;
        }

        public Employee GetById (int id) {
            return _context.Employee.Find (id);
        }

        public int Create (Employee user) {
            // validation
            // if (string.IsNullOrWhiteSpace (user.Password))
            //     throw new AppException ("Password is required");

            // if (_context.Employee.Any (x => x.Email == user.Email))
            //     throw new AppException ("Username " + user.Email + " is already taken");
            try {

                var userData = _context.Employee.Where (a => a.Email == user.Email).FirstOrDefault ();
                if (userData == null) {
                    user.Id = Guid.NewGuid ();
                    user.Password = Security.FunForEncrypt (user.Password);
                    user.RoleId = new Guid ("EF953A77-03B3-43A1-AF67-ADCFFAF907B8");
                    user.Status = true;
                    _context.Employee.Add (user);
                    _context.SaveChanges ();
                    return 0;
                } else {
                    return 1;
                }
            } catch (Exception ex) {
                return 2;
            }
        }

        public void Update (Employee userParam, string password = null) {
            var user = _context.Employee.Find (userParam.Id);

            if (user == null)
                throw new AppException ("User not found");

            if (userParam.Email != user.Email) {
                // username has changed so check if the new username is already taken
                if (_context.Employee.Any (x => x.Email == userParam.Email))
                    throw new AppException ("Username " + userParam.Email + " is already taken");
            }

            // update user properties
            // user.FirstName = userParam.FirstName;
            // user.LastName = userParam.LastName;
            // user.Username = userParam.Username;

            // update password if it was entered
            if (!string.IsNullOrWhiteSpace (password)) {
                // byte[] passwordHash, passwordSalt;
                // CreatePasswordHash(password, out passwordHash, out passwordSalt);

                // user.PasswordHash = passwordHash;
                // user.PasswordSalt = passwordSalt;
            }

            _context.Employee.Update (user);
            _context.SaveChanges ();
        }

        public void Delete (int id) {
            var user = _context.Employee.Find (id);
            if (user != null) {
                _context.Employee.Remove (user);
                _context.SaveChanges ();
            }
        }

        // private helper methods

        // private static void CreatePasswordHash (string password, out byte[] passwordHash, out byte[] passwordSalt) {
        //     if (password == null) throw new ArgumentNullException ("password");
        //     if (string.IsNullOrWhiteSpace (password)) throw new ArgumentException ("Value cannot be empty or whitespace only string.", "password");

        //     using (var hmac = new System.Security.Cryptography.HMACSHA512 ()) {
        //         passwordSalt = hmac.Key;
        //         passwordHash = hmac.ComputeHash (System.Text.Encoding.UTF8.GetBytes (password));
        //     }
        // }

        private static bool VerifyPasswordHash (string password, string Encrytpassword) {
            // decrypt Password 

            string descryptPassword = Security.FunForDecrypt (Encrytpassword);
            if (descryptPassword == password) return true;

            return false;
        }

        public string GetRole (Guid userId) {

            var role = _context.Role.SingleOrDefault (x => x.Id == userId);

            // check if username exists
            if (role == null)
                return null;

            // check if password is correct

            return role.Name;
        }
    }
}