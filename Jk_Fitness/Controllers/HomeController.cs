using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Jk_Fitness.Models;
using Microsoft.AspNetCore.Authorization;
using ServiceLayer;
using ServiceLayer.VMmodel;
using ServiceLayer.Password;

namespace Jk_Fitness.Controllers
{
    [ValidCookie]
    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;
        private readonly EmployeeService employee;
        WebResponce webResponce = null;
        public HomeController(ILogger<HomeController> logger, EmployeeService employee)
        {
            _logger = logger;
            this.employee = employee;
        }

        public IActionResult Index()
        {
            return View();
        }

        public IActionResult Privacy()
        {
            return View();
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }

        [HttpPost]
        public WebResponce NewTrainingRequest(TrainingVM training)
        {
            try
            {
                training.EmployeeId = Crypto.DecryptString(Request.Cookies["jkfitness.cookie"]);
                webResponce = employee.EmployeeTrainingRequest(training);
                return webResponce;
            }
            catch (Exception Ex)
            {
                webResponce = new WebResponce()
                {
                    Code = -1,
                    Message = Ex.Message
                };
                return webResponce;
            }
        }

        [HttpPost]
        public WebResponce TrainingRequestHistroy(TrainingVM training)
        {
            try
            {
                training.EmployeeId = Crypto.DecryptString(Request.Cookies["jkfitness.cookie"]);
                webResponce = employee.EmployeeTrainingHistroy(training);
                return webResponce;
            }
            catch (Exception Ex)
            {
                webResponce = new WebResponce()
                {
                    Code = -1,
                    Message = Ex.Message
                };
                return webResponce;
            }
        }
    }
}
