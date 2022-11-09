using DataLayer;
using DataLayer.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ServiceLayer;
using ServiceLayer.Password;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Jk_Fitness.Controllers
{
    [ValidCookie]
    public class SettingsController : Controller
    {
        private readonly SettingsService Setting;
        WebResponce webResponce = null;

        public SettingsController(SettingsService Setting) {
            this.Setting = Setting;
        }

        #region - Branch
        public IActionResult Branch()
        {
            var userType = Request.Cookies["Role"];
            List<int> result1 = Setting.GetUserRightsbyUsertype(userType);
            if (result1.Count() > 0) {
                ViewBag.Add = result1[17];
                ViewBag.Edit= result1[18];
                ViewBag.Delete = result1[19];
            }
            return View();
        }

        [HttpPost]
        public WebResponce SaveBranch([FromBody] Branch branch)
        {
            try
            {
                branch.CreatedBy = Crypto.DecryptString(Request.Cookies["jkfitness.cookie"]);
                webResponce = Setting.SaveBranch(branch);
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
                webResponce = Setting.ListBranchDetails();
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
        public WebResponce GetBranchById([FromBody] Branch branch)
        {
            try
            {
                webResponce = Setting.GetBranchById(branch.Id);
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
        public WebResponce Updatebranch([FromBody] Branch branch)
        {
            try
            {
                branch.ModifiedBy = Crypto.DecryptString(Request.Cookies["jkfitness.cookie"]);
                webResponce = Setting.UpdateBranch(branch);
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
        public WebResponce DeleteBranch([FromBody] Branch branch)
        {
            try
            {
                webResponce = Setting.DeleteBranch(branch);
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
        public WebResponce SearchBranch([FromBody] Branch branch)
        {
            try
            {
                webResponce = Setting.SearchBranch(branch);
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

        #region Expenses Types
        public IActionResult ExpensesType()
        {
            var userType = Request.Cookies["Role"];
            List<int> result1 = Setting.GetUserRightsbyUsertype(userType);
            if (result1.Count() > 0)
            {
                ViewBag.Add = result1[21];
                ViewBag.Edit = result1[22];
                ViewBag.Delete = result1[23];
            }
            return View();
        }
        [HttpGet]
        public WebResponce GetExpensesDetails()
        {
            try
            {
                webResponce = Setting.ListExpensesDetails();
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
        public WebResponce SaveExpensesType([FromBody] ExpensesTypes expenseType)
        {
            try
            {
                expenseType.CreatedBy = Crypto.DecryptString(Request.Cookies["jkfitness.cookie"]);
                webResponce = Setting.SaveExpensesType(expenseType);
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
        public WebResponce DeleteExpenseType([FromBody] ExpensesTypes expenseType)
        {
            try
            {
                webResponce = Setting.DeleteExpeseType(expenseType);
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
        public WebResponce GetExpenseTypeById([FromBody] ExpensesTypes expenseType)
        {
            try
            {
                webResponce = Setting.GetExpenseTypeById(expenseType.Id);
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
        public WebResponce UpdateExpenseType([FromBody] ExpensesTypes expenseType)
        {
            try
            {
                expenseType.ModifiedBy = Crypto.DecryptString(Request.Cookies["jkfitness.cookie"]);
                webResponce = Setting.UpdateExpenseType(expenseType);
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
        public WebResponce SearchExpensesType([FromBody] ExpensesTypes expenseType)
        {
            try
            {
                webResponce = Setting.SearchExpenseTypes(expenseType);
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

        #region Memebership Types
        public IActionResult MembershipType()
        {
            var userType = Request.Cookies["Role"];
            List<int> result1 = Setting.GetUserRightsbyUsertype(userType);
            if (result1.Count() > 0)
            {
                ViewBag.Add = result1[25];
                ViewBag.Edit = result1[26];
                ViewBag.Delete = result1[27];
            }
            return View();
        }
        [HttpGet]
        public WebResponce GetMembershipTypeDetails()
        {
            try
            {
                webResponce = Setting.ListMembershipTypesDetails();
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
        public WebResponce GetEnabledMembershipTypeDetails()
        {
            try
            {
                webResponce = Setting.ListMembershipTypesDetails(true);
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
        public WebResponce SaveMembershipType([FromBody] MembershipTypes membershipType)
        {
            try
            {
                membershipType.CreatedBy = Crypto.DecryptString(Request.Cookies["jkfitness.cookie"]);
                webResponce = Setting.SaveMembershipType(membershipType);
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
        public WebResponce DeleteMembershipType([FromBody] MembershipTypes membershipType)
        {
            try
            {
                webResponce = Setting.DeleteMembershipType(membershipType);
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
        public WebResponce GetMembershipTypeById([FromBody] MembershipTypes membershipType)
        {
            try
            {
                webResponce = Setting.GetMembershipTypeById(membershipType.Id);
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
        public WebResponce UpdateMembershipType([FromBody] MembershipTypes membershipType)
        {
            try
            {
                membershipType.ModifiedBy = Crypto.DecryptString(Request.Cookies["jkfitness.cookie"]);
                webResponce = Setting.UpdateMembershipType(membershipType);
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
        public WebResponce SearchMembershipType([FromBody] MembershipTypes membershipType)
        {
            try
            {
                webResponce = Setting.SearchMembershipType(membershipType);
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

        #region Roles and Access Rights
        public IActionResult MenuRights()
        {
            return View();
        }

        [HttpGet]
        public WebResponce GetMenuRights()
        {
            try
            {
                webResponce = Setting.GetMenuRights();
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
        public WebResponce UpdateMenuRights([FromBody] MenuRights menu)
        {
            try
            {
                webResponce = Setting.UpdateMenuRights(menu);
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
        public WebResponce GetUserRights()
        {
            try
            {
                var userType = Request.Cookies["Role"];
                webResponce = Setting.GetUserRights(userType);
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

        #region InternalExpenses
        public IActionResult InternalExpenses()
        {
            var userType = Request.Cookies["Role"];
            List<int> result1 = Setting.GetUserRightsbyUsertype(userType);
            if (result1.Count() > 0)
            {
                ViewBag.Add = result1[50];
                ViewBag.Edit = result1[51];
                ViewBag.Delete = result1[52];
            }
            return View();
        }

        [HttpGet]
        public WebResponce GetEmployeeDetails(string employeeid)
        {
            try
            {
                webResponce = Setting.GetEmployeeDetails(employeeid);
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
        public WebResponce LoadExpensesType()
        {
            try
            {
                webResponce = Setting.ListExpensesDetails();
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
        public WebResponce SaveInternalExpenses(InternalExpenses internalExpenses)
        {
            try
            {
                internalExpenses.CreatedBy = Crypto.DecryptString(Request.Cookies["jkfitness.cookie"]);
                webResponce = Setting.SaveInternalExpenses(internalExpenses);
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
        public WebResponce LoadInternalExpenses()
        {
            try
            {
                webResponce = Setting.LoadInternalExpenses();
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
        public WebResponce DeleteInternalExpense(int internalExpensesId)
        {
            try
            {
                webResponce = Setting.DeleteInternalExpenses(internalExpensesId);
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
        public WebResponce UpdateInternalExpenses(InternalExpenses internalExpenses)
        {
            try
            {
                internalExpenses.ModifiedBy = Crypto.DecryptString(Request.Cookies["jkfitness.cookie"]);
                webResponce = Setting.UpdateInternalExpenses(internalExpenses);
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
