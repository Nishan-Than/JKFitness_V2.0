using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DataLayer.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ServiceLayer;
using ServiceLayer.Password;
using ServiceLayer.VMmodel;

namespace Jk_Fitness.Controllers
{
    [ValidCookie]
    public class MembershipController : Controller
    {
        private readonly MemberShipService MemberShip;
        private readonly SettingsService Setting;
        WebResponce webResponce = null;

        public MembershipController(MemberShipService MemberShip, SettingsService Setting)
        {
            this.MemberShip = MemberShip;
            this.Setting = Setting;
        }
        public IActionResult Index()
        {
            var userType = Request.Cookies["Role"];
            List<int> result1 = Setting.GetUserRightsbyUsertype(userType);
            if (result1.Count() > 0)
            {
                ViewBag.Add = result1[9];
                ViewBag.Edit = result1[10];
                ViewBag.Delete = result1[11];
                ViewBag.View = result1[12];
            }
            return View();
        }

        [HttpPost]
        public WebResponce SaveMember(MemberShip Member)
        {
            try
            {
                Member.CreatedBy = Crypto.DecryptString(Request.Cookies["jkfitness.cookie"]);
                webResponce = MemberShip.SaveMemberShipDetails(Member);
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
        public WebResponce GetMemberDetails(MemberShip Member)
        {
            try
            {
                webResponce = MemberShip.ListMemberShipDetails(Member);
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
        public WebResponce GetMemberShipById([FromBody] MemberShip Member)
        {
            try
            {
                webResponce = MemberShip.GetMemberShipDetailsById(Member.MemberId);
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
        public WebResponce UpdateMemberShip( MemberShip Member)
        {
            try
            {
                Member.ModifiedBy = Crypto.DecryptString(Request.Cookies["jkfitness.cookie"]);
                webResponce = MemberShip.UpdateMemberShipDetails(Member);
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
        public WebResponce DeleteMemberShip([FromBody] MemberShip member)
        {
            try
            {
                webResponce = MemberShip.DeleteMemberShpDetails(member);
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
        public WebResponce SearchMembers([FromBody] MemberShip member)
        {
            try
            {
                webResponce = MemberShip.SearchMemberShipDetails(member);
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
        public WebResponce GetBranchDetails()
        {
            try
            {
                webResponce = MemberShip.ListBranches(Crypto.DecryptString(Request.Cookies["jkfitness.cookie"]));
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

        public IActionResult MembersService()
        {
            return View();
        }

        #region MembersAttendance

        public IActionResult MembershipAttendance()
        {
            var userType = Request.Cookies["Role"];
            List<int> result1 = Setting.GetUserRightsbyUsertype(userType);
            if (result1.Count() > 0)
            {
                ViewBag.Edit = result1[14];
                ViewBag.Delete = result1[15];
            }
            return View();
        }

        public IActionResult ViewMembershipAttendance()
        {
            return View();
        }

        [HttpPost]
        public WebResponce ViewMemberShipAttendanceDetails(AttendancesVM attendances)
        {
            try
            {
                webResponce = MemberShip.ViewMemberShipAttendanceDetails(attendances);
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
        public WebResponce LoadMemberShipAttendanceDetails(AttendancesVM attendances)
        {
            try
            {
                webResponce = MemberShip.LoadMemberShipAttendanceDetails(attendances);
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
        public WebResponce SaveMemberAttendance(MembersAttendance Attendance)
        {
            try
            {
                Attendance.CreatedBy = Crypto.DecryptString(Request.Cookies["jkfitness.cookie"]);
                webResponce = MemberShip.SaveMemberShipAttendance(Attendance);
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
        public WebResponce UpdateMemberAttendance(MembersAttendance Attendance)
        {
            try
            {
                Attendance.ModifiedBy = Crypto.DecryptString(Request.Cookies["jkfitness.cookie"]);
                webResponce = MemberShip.UpdateMemberShipAttendance(Attendance);
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
        public WebResponce DeleteMemberAttendance([FromBody] MembersAttendance Attendance)
        {
            try
            {
                webResponce = MemberShip.DeleteMemberAttendance(Attendance);
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

        #region Temporary Membership
        public IActionResult ProvisionalMember()
        {
            var userType = Request.Cookies["Role"];
            List<int> result1 = Setting.GetUserRightsbyUsertype(userType);
            if (result1.Count() > 0)
            {
                ViewBag.Add = result1[55];
                ViewBag.Edit = result1[56];
                ViewBag.Delete = result1[57];
            }
            return View();
        }

        [HttpPost]
        public WebResponce SaveProvisionalMember(ProvisionalMember provisionalMember)
        {
            try
            {
                provisionalMember.CreatedBy = Crypto.DecryptString(Request.Cookies["jkfitness.cookie"]);
                webResponce = MemberShip.SaveProvisionalMemberShipDetails(provisionalMember);
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
        public WebResponce GetProvisionalMemberDetails(ProvisionalMember provisionalMember)
        {
            try
            {
                webResponce = MemberShip.ListProvisionalMemberShipDetails(provisionalMember);
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
        public WebResponce UpdateProvisionalMember(ProvisionalMember provisionalMember)
        {
            try
            {
                provisionalMember.ModifiedBy = Crypto.DecryptString(Request.Cookies["jkfitness.cookie"]);
                webResponce = MemberShip.UpdateProvisionalMember(provisionalMember);
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
        public WebResponce DeleteProvisionalMember([FromBody] ProvisionalMember provisionalMember)
        {
            try
            {
                webResponce = MemberShip.DeleteProvisionalMember(provisionalMember);
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

        public WebResponce SearchProvisionalMember([FromBody] ProvisionalMember provisionalMember)
        {
            try
            {
                webResponce = MemberShip.SearchProvisionalMember(provisionalMember);
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

        #region Membership Report
        public IActionResult MembershipReport()
        {
            var userType = Request.Cookies["Role"];
            List<int> result1 = Setting.GetUserRightsbyUsertype(userType);
            if (result1.Count() > 0)
            {
                ViewBag.Add = result1[9];
                ViewBag.Edit = result1[10];
                ViewBag.Delete = result1[11];
                ViewBag.View = result1[12];
            }
            return View();
        }
        #endregion

        #region Load Provinces and Districts
        [HttpGet]
        public WebResponce ListProvinces()
        {
            try
            {
                webResponce = MemberShip.ListProvinces();
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
        public WebResponce ListDistricts([FromBody] Districts districts)
        {
            try
            {
                webResponce = MemberShip.ListDistricts(districts);
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
