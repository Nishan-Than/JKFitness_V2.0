using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DataLayer;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using ServiceLayer;
using ServiceLayer.Email;

namespace Jk_Fitness
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddDbContext<DatabaseContext>(opts => opts.UseSqlServer(Configuration["ConnetionString:JkFitness"]));
            services.AddControllersWithViews();
            services.AddScoped(typeof(UnitOfWork));
            //services.AddScoped(typeof(GenericRepository<>));
            services.AddScoped(typeof(EmployeeService));
            services.AddScoped(typeof(LogInService));
            services.AddScoped(typeof(SettingsService));
            services.AddScoped(typeof(MemberShipService));
            services.AddScoped(typeof(ScheduleTaskService));
            services.AddScoped(typeof(PaymentsExpensesService));
            services.AddScoped(typeof(NotificationService));
            services.AddScoped(typeof(MailBoxService));
            services.AddScoped(typeof(ProductService));
            services.AddScoped(typeof(AccountsService));
            services.Configure<MailSettings>(Configuration.GetSection("MailSettings"));
            services.AddTransient<IMailService, MailService>();
            //services.AddSession(options => {
            //    options.IdleTimeout = TimeSpan.FromMinutes(100);
            //});
            ////services.AddSession();
            //services.AddAuthentication("CookieAuth")
            //   .AddCookie("CookieAuth", config =>
            //   {
            //       config.Cookie.Name = "Jkfitness.Cookie";
            //       config.LoginPath = "/Login/Index";
            //       config.ExpireTimeSpan = TimeSpan.FromMinutes(10);
            //   });

            services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme).AddCookie();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseExceptionHandler("/Home/Error");
                // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
                app.UseHsts();
            }
            app.UseHttpsRedirection();
            app.UseStaticFiles();

            app.UseRouting();

            app.UseAuthentication();
            
            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllerRoute(
                    name: "default",
                    pattern: "{controller=Login}/{action=Initial}/{id?}");
            });
        }
    }
}
