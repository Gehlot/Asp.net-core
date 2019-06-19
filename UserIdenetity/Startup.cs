using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using Swashbuckle.AspNetCore.Swagger;
using UserIdenetity.Model;
using UserIdenetity.Provider;
using UserIdenetity.Services;
namespace UserIdenetity {
    public class Startup {

        //public synsoftpcContext (DbContextOptions<synsoftpcContext> options) : base (options) { }
        public Startup (IConfiguration configuration) {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices (IServiceCollection services) {
            services.AddCors (options => options.AddPolicy ("AllowAll", p => p.AllowAnyOrigin ()
                .AllowAnyMethod ()
                .AllowAnyHeader ()));
            services.AddMvc ();
            services.AddSingleton<IHttpContextAccessor, HttpContextAccessor> ();
            services.AddDbContext<synsoftpcContext> (options => options.UseSqlServer (Configuration["ConnectionStrings:EmployeeContext"]));
            services.AddScoped<IEmployeeService, EmployeeService> ();
            services.AddAutoMapper ();
            services.AddAuthentication (options => {
                    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
                })
                .AddJwtBearer (options => {
                    options.TokenValidationParameters = new TokenValidationParameters {
                    ValidateIssuer = false,
                    ValidateAudience = true,
                    ValidateLifetime = true,
                    ValidateIssuerSigningKey = true,
                    ValidIssuer = Configuration["Jwt:Issuer"],
                    ValidAudience = Configuration["Jwt:Audience"],
                    IssuerSigningKey = new SymmetricSecurityKey (Encoding.UTF8.GetBytes (Configuration["Jwt:Secret"])),
                    ClockSkew = TimeSpan.Zero
                    };
                }).AddCookie (cfg => cfg.SlidingExpiration = true);

            services.AddMvc (options => {
                // All endpoints need authorization using our custom authorization filter
                options.Filters.Add (new CustomAuthorizeFilter (new AuthorizationPolicyBuilder ().RequireAuthenticatedUser ().Build ()));
            });
            // Register the Swagger generator, defining one or more Swagger documents  
            services.AddSwaggerGen (c => {
                c.SwaggerDoc ("v1", new Info { Title = "My API", Version = "v1" });
            });
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure (IApplicationBuilder app, IHostingEnvironment env) {
            if (env.IsDevelopment ()) {
                app.UseDeveloperExceptionPage ();
            }
            //app.UseCors(corsPolicyBuilder =>corsPolicyBuilder.WithOrigins(Configuration["Origins:Value"]).AllowAnyMethod().AllowAnyHeader().AllowCredentials());
            app.UseCors ("AllowAll");
            app.UseAuthentication ();
            app.UseMvc ();

            app.UseSwagger ();
            // Enable middleware to serve swagger-ui (HTML, JS, CSS, etc.), specifying the Swagger JSON endpoint.  
            app.UseSwaggerUI (c => {
                c.SwaggerEndpoint ("/swagger/v1/swagger.json", "My API V1");
            });

        }

    }
}