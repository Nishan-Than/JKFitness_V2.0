using DataLayer.Models;
using Microsoft.AspNetCore.Mvc;
using ServiceLayer;
using ServiceLayer.Password;
using ServiceLayer.VMmodel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Jk_Fitness.Controllers
{
    public class MemberHomeController : Controller
    {
        private readonly EmployeeService employee;
        WebResponce webResponce = null;

        public MemberHomeController(EmployeeService employee)
        {
            this.employee = employee;
        }

        public IActionResult Index()
        {
            return View();
        }

        [HttpGet]
        public WebResponce GetTrainers()
        {
            try
            {
                webResponce = employee.ListTrainerDetails(Convert.ToInt32(Crypto.DecryptString(Request.Cookies["jkfitness.member"])));
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
        public WebResponce NewTrainingRequest(TrainingVM training)
        {
            try
            {
                webResponce = employee.NewTrainingRequest(training);
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
        public WebResponce SaveNewTrainingRequest(RequestTrainers requestTrainers)
        {
            try
            {
                webResponce = employee.SaveNewTrainingRequest(requestTrainers);
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
        public WebResponce TrainingHistroy(TrainingVM training)
        {
            try
            {
                webResponce = employee.MemberTrainingHistroy(training);
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

        [HttpGet]
        public WebResponce GetTrainingStartandEndYear()
        {
            try
            {
                webResponce = employee.GetTrainingStartandEndYear();
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
