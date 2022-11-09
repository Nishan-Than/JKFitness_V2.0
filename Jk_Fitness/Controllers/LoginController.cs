using DataLayer;
using Microsoft.AspNetCore.Mvc;
using ServiceLayer;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using System.Text.Json;
using System.Runtime.Serialization;
using System.Security.Claims;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using ServiceLayer.Password;
using System.Text;

namespace Jk_Fitness.Controllers
{
    public class LoginController : Controller
    {
        private readonly LogInService logInService;
        WebResponce webResponce = null;
        public LoginController(LogInService logInService)
        {
            this.logInService = logInService;
        }
        public IActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public ActionResult<WebResponce> ValidateLogIn([FromBody] Employee employe)
        {
            webResponce = logInService.ListLogInInfo(employe);
            if(webResponce.Code == 1)
            {
                Response.Cookies.Append("jkfitness.cookie", Crypto.EncryptString(((Employee)webResponce.Data).EmployeeId));
                Response.Cookies.Append("Role", ((Employee)webResponce.Data).UserType);
            }
            return webResponce;
        }

        [HttpPost]
        public ActionResult<WebResponce> ConfirmPassword([FromBody] Employee employe)
        {
            webResponce = logInService.ConfirmPassword(employe);
            return webResponce;
        }

        [HttpPost]
        public ActionResult<WebResponce> UpdatePassword([FromBody] Employee employe)
        {
            try
            {
                employe.ModifiedBy = Crypto.DecryptString(Request.Cookies["jkfitness.cookie"]);
                webResponce = logInService.UpdatePassword(employe);
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
        public ActionResult<WebResponce> SignOutLogin()
        {
            try
            {
                Response.Cookies.Delete("jkfitness.cookie");
                webResponce = new WebResponce()
                {
                    Code = 1,
                    Message = "Success"
                };
                return webResponce;
            }
            catch (Exception ex)
            {
                webResponce = new WebResponce()
                {
                    Code = -1,
                    Message = ex.Message.ToString()
                };
                return webResponce;
            }
        }

        #region ForgotPassword
        public IActionResult ForgotPassword()
        {
            return View();
        }


        [HttpPost]
        public ActionResult<WebResponce> RequestPassword([FromBody] Employee employe)
        {
            try
            {
                webResponce = logInService.RequestNewPassword(employe);
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
        #endregion
    }
}
