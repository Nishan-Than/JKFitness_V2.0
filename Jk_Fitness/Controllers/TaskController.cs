using Microsoft.AspNetCore.Mvc;
using ServiceLayer;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Jk_Fitness.Controllers
{
    public class TaskController : Controller
    {
        private readonly ScheduleTaskService taskService;
        
        public TaskController(ScheduleTaskService taskService)
        {
            this.taskService = taskService;
        }
        public IActionResult Index()
        {
            taskService.DeactivateMembers();
            //Last 30 days of attendance records only will keep in DB.
            taskService.DeleteMembershipAttendance();
            //Send package expiration email on last 2 days and last 24 hours.
            taskService.SendPackageExpirationEmail();
            //Send membership expiration email on ast 7 days, 3 days and last 24 hours.
            taskService.SendMembershipExpirationEmail();
            return View();
        }

        [HttpPost]
        public bool AutoTask()
        {
            taskService.DeactivateMembers();
            //Last 30 days of attendance records only will keep in DB.
            taskService.DeleteMembershipAttendance();
            //Send package expiration email on last 2 days and last 24 hours.
            taskService.SendPackageExpirationEmail();
            //Send membership expiration email on ast 7 days, 3 days and last 24 hours.
            taskService.SendMembershipExpirationEmail();
 
            return true;
        }

    }
}
