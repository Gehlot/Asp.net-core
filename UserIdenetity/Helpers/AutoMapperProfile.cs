using AutoMapper;
using UserIdenetity.Model;

namespace UserIdenetity.Helpers
{
    public class AutoMapperProfile : Profile
    {
        public AutoMapperProfile()
        {
             CreateMap<Employee, EmployeesDto>();
             CreateMap<EmployeesDto, Employee>();
        }
    }
}