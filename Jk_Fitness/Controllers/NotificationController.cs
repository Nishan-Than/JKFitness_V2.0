using Microsoft.AspNetCore.Mvc;
using ServiceLayer;
using ServiceLayer.Password;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Jk_Fitness.Controllers
{
    [ValidCookie]
    public class NotificationController : Controller
    {
        private readonly NotificationService notificationService;
        WebResponce webResponce = null;

        public NotificationController(NotificationService notificationService) {
            this.notificationService = notificationService;
        }
        public IActionResult Index()
        {
            return View();
        }

        [HttpGet]
        public WebResponce GetNotifications()
        {
            try
            {
                webResponce = notificationService.ListNotification(Crypto.DecryptString(Request.Cookies["jkfitness.cookie"]));
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
