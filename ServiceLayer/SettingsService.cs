using DataLayer;
using DataLayer.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ServiceLayer
{
    public class SettingsService
    {
        private readonly UnitOfWork uow;
        WebResponce webResponce = null;

        public SettingsService(UnitOfWork uow)
        {
            this.uow = uow;
        }
        #region Branch
        public WebResponce SaveBranch(Branch branch)
        {
            try
            {
                var BranchCode = uow.DbContext.Branches.OrderBy(x => x.BranchCode).Select(x => x.BranchCode).LastOrDefault();
                if (BranchCode != null)
                {
                    double subs = double.Parse(BranchCode.Split(' ')[1]);
                    double val = subs + (double)1;
                    branch.BranchCode = BranchCode.Split(' ')[0] + " " + String.Format("{0:0.0}", val);
                }
                else
                {
                    branch.BranchCode = "JKF 1.0";
                }
                branch.BranchName = branch.BranchName.Trim();
                branch.CreatedDate = GetDateTimeByLocalZone.GetDateTime();
                branch.CreatedBy = branch.CreatedBy;
                branch.IsCurrent = true;
                uow.BranchRepository.Insert(branch);
                uow.Save();

                webResponce = new WebResponce()
                {
                    Code = 1,
                    Message = "Success",
                    Data = branch
                };
            }
            catch (Exception ex)
            {
                webResponce = new WebResponce()
                {
                    Code = -1,
                    Message = ex.Message.ToString()
                };
            }
            return webResponce;
        }

        public WebResponce ListBranchDetails()
        {
            try
            {
                List<Branch> branches = uow.BranchRepository.GetAll().OrderBy(x => x.BranchCode).ToList();

                if (branches != null && branches.Count > 0)
                {
                    List<Employee> employees = uow.EmployeeRepository.GetAll().ToList();
                    List<MemberShip> members = uow.MembershipRepository.GetAll().ToList();
                    foreach (var branch in branches)
                    {
                        branch.IsDeleteble = (employees.Where(x => x.Branch == branch.BranchName).Count() > 0 || members.Where(z => z.Branch == branch.BranchName).Count() > 0) ? false : true;
                    }

                    webResponce = new WebResponce()
                    {
                        Code = 1,
                        Message = "Success",
                        Data = branches
                    };
                }
                else
                {
                    webResponce = new WebResponce()
                    {
                        Code = 0,
                        Message = "Seems Like Doesn't have Records!"
                    };
                }
            }
            catch (Exception ex)
            {
                webResponce = new WebResponce()
                {
                    Code = -1,
                    Message = ex.Message.ToString()
                };
            }
            return webResponce;
        }

        public WebResponce GetBranchById(int Id)
        {
            try
            {
                var branch = uow.BranchRepository.GetByID(Id);
                if (branch != null)
                {
                    webResponce = new WebResponce()
                    {
                        Code = 1,
                        Message = "Success",
                        Data = branch
                    };
                }
                else
                {
                    webResponce = new WebResponce()
                    {
                        Code = 0,
                        Message = "Seems Like Doesn't have Records!"
                    };
                }
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

        public WebResponce UpdateBranch(Branch branch)
        {
            try
            {
                var Branches = uow.DbContext.Branches.Where(x => x.BranchCode == branch.BranchCode).ToList();
                if (Branches.Count > 0)
                {
                    foreach (var Brch in Branches)
                    {
                        Brch.BranchName = branch.BranchName.Trim();
                        Brch.MembershipInitialRangeFrom = branch.MembershipInitialRangeFrom;
                        Brch.MembershipInitialRangeTo = branch.MembershipInitialRangeTo;
                        Brch.MembershipActiveMonthRange = branch.MembershipActiveMonthRange;

                        Brch.ModifiedDate = GetDateTimeByLocalZone.GetDateTime();
                        Brch.ModifiedBy = branch.ModifiedBy;
                        uow.BranchRepository.Update(Brch);
                        uow.Save();
                    }
                   
                    webResponce = new WebResponce()
                    {
                        Code = 1,
                        Message = "Success",
                    };
                }
                else
                {
                    webResponce = new WebResponce()
                    {
                        Code = 0,
                        Message = "Seems Like Doesn't have Records!"
                    };
                }

            }
            catch (Exception ex)
            {
                webResponce = new WebResponce()
                {
                    Code = -1,
                    Message = ex.Message.ToString()
                };
            }
            return webResponce;
        }

        public WebResponce DeleteBranch(Branch branch)
        {
            try
            {
                var Brch = uow.DbContext.Branches.Where(x => x.Id == branch.Id).FirstOrDefault();
                if (Brch != null)
                {
                    uow.BranchRepository.Delete(Brch);
                    uow.Save();
                    webResponce = new WebResponce()
                    {
                        Code = 1,
                        Message = "Success"
                    };
                }
                else
                {
                    webResponce = new WebResponce()
                    {
                        Code = 0,
                        Message = "Seems Like Doesn't have Records!"
                    };
                }
            }
            catch (Exception ex)
            {
                webResponce = new WebResponce()
                {
                    Code = -1,
                    Message = ex.Message.ToString()
                };
            }
            return webResponce;
        }

        public WebResponce SearchBranch(Branch branch)
        {
            try
            {
                List<Branch> Branches = uow.DbContext.Branches.Where(x => x.BranchCode.Contains(branch.BranchCode) && x.BranchName.Contains(branch.BranchName)).ToList();
                if (Branches != null && Branches.Count > 0)
                {
                    List<Employee> employees = uow.EmployeeRepository.GetAll().ToList();
                    foreach (var bran in Branches)
                    {
                        bran.IsDeleteble = (employees.Where(x => x.Branch == bran.BranchName).Count() > 0) ? false : true;
                    }

                    webResponce = new WebResponce()
                    {
                        Code = 1,
                        Message = "Success",
                        Data = Branches
                    };
                }
                else
                {
                    webResponce = new WebResponce()
                    {
                        Code = 0,
                        Message = "Seems Like Doesn't have Records!"
                    };
                }
            }
            catch (Exception ex)
            {
                webResponce = new WebResponce()
                {
                    Code = -1,
                    Message = ex.Message.ToString()
                };
            }
            return webResponce;
        }
        #endregion

        #region ExpensesTypes
        public WebResponce ListExpensesDetails()
        {
            try
            {
                List<ExpensesTypes> expenses = uow.ExpensesTypeRepository.GetAll().ToList();

                if (expenses != null && expenses.Count > 0)
                {
                    webResponce = new WebResponce()
                    {
                        Code = 1,
                        Message = "Success",
                        Data = expenses
                    };
                }
                else
                {
                    webResponce = new WebResponce()
                    {
                        Code = 0,
                        Message = "Seems Like Doesn't have Records!"
                    };
                }
            }
            catch (Exception ex)
            {
                webResponce = new WebResponce()
                {
                    Code = -1,
                    Message = ex.Message.ToString()
                };
            }
            return webResponce;
        }

        public WebResponce SaveExpensesType(ExpensesTypes expenseType)
        {
            try
            {
                var ExpenseCode = uow.DbContext.ExpensesTypes.OrderBy(x => x.Id).Select(x => x.ExpenseCode).LastOrDefault();
                if (ExpenseCode != null)
                {
                    int subs = int.Parse(ExpenseCode.Split('-')[1]);
                    int val = subs + 1;
                    expenseType.ExpenseCode = ExpenseCode.Split('-')[0] + "-" + val;
                }
                else
                {
                    expenseType.ExpenseCode = "Exp-1";
                }
                expenseType.ExpenseName = expenseType.ExpenseName.Trim();
                expenseType.CreatedDate = GetDateTimeByLocalZone.GetDateTime();
                expenseType.CreatedBy = expenseType.CreatedBy;
                uow.ExpensesTypeRepository.Insert(expenseType);
                uow.Save();

                webResponce = new WebResponce()
                {
                    Code = 1,
                    Message = "Success",
                    Data = expenseType
                };
            }
            catch (Exception ex)
            {
                webResponce = new WebResponce()
                {
                    Code = -1,
                    Message = ex.Message.ToString()
                };
            }
            return webResponce;
        }

        public WebResponce DeleteExpeseType(ExpensesTypes expenseType)
        {
            try
            {
                var expense = uow.DbContext.ExpensesTypes.Where(x => x.Id == expenseType.Id).FirstOrDefault();
                if (expense != null)
                {
                    uow.ExpensesTypeRepository.Delete(expense);
                    uow.Save();
                    webResponce = new WebResponce()
                    {
                        Code = 1,
                        Message = "Success"
                    };
                }
                else
                {
                    webResponce = new WebResponce()
                    {
                        Code = 0,
                        Message = "Seems Like Doesn't have Records!"
                    };
                }
            }
            catch (Exception ex)
            {
                webResponce = new WebResponce()
                {
                    Code = -1,
                    Message = ex.Message.ToString()
                };
            }
            return webResponce;
        }

        public WebResponce GetExpenseTypeById(int Id)
        {
            try
            {
                var expenseType = uow.ExpensesTypeRepository.GetByID(Id);
                if (expenseType != null)
                {
                    webResponce = new WebResponce()
                    {
                        Code = 1,
                        Message = "Success",
                        Data = expenseType
                    };
                }
                else
                {
                    webResponce = new WebResponce()
                    {
                        Code = 0,
                        Message = "Seems Like Doesn't have Records!"
                    };
                }
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
        public WebResponce UpdateExpenseType(ExpensesTypes expenseType)
        {
            try
            {
                var expense = uow.DbContext.ExpensesTypes.Where(x => x.Id == expenseType.Id).FirstOrDefault();
                if (expense != null)
                {
                    expense.ExpenseName = expenseType.ExpenseName.Trim();
                    expense.IsEnable = expenseType.IsEnable;

                    expense.ModifiedDate = GetDateTimeByLocalZone.GetDateTime();
                    expense.ModifiedBy = expenseType.ModifiedBy;
                    uow.ExpensesTypeRepository.Update(expense);
                    uow.Save();

                    webResponce = new WebResponce()
                    {
                        Code = 1,
                        Message = "Success",
                    };
                }
                else
                {
                    webResponce = new WebResponce()
                    {
                        Code = 0,
                        Message = "Seems Like Doesn't have Records!"
                    };
                }

            }
            catch (Exception ex)
            {
                webResponce = new WebResponce()
                {
                    Code = -1,
                    Message = ex.Message.ToString()
                };
            }
            return webResponce;
        }

        public WebResponce SearchExpenseTypes(ExpensesTypes types)
        {
            try
            {
                List<ExpensesTypes> Expenses = uow.DbContext.ExpensesTypes.Where(x => x.ExpenseCode.Contains(types.ExpenseCode) && x.ExpenseName.Contains(types.ExpenseName)).ToList();
                if (Expenses != null && Expenses.Count > 0)
                {
                    webResponce = new WebResponce()
                    {
                        Code = 1,
                        Message = "Success",
                        Data = Expenses
                    };
                }
                else
                {
                    webResponce = new WebResponce()
                    {
                        Code = 0,
                        Message = "Seems Like Doesn't have Records!"
                    };
                }
            }
            catch (Exception ex)
            {
                webResponce = new WebResponce()
                {
                    Code = -1,
                    Message = ex.Message.ToString()
                };
            }
            return webResponce;
        }
        #endregion

        #region MembershipTypes
        public WebResponce ListMembershipTypesDetails(bool isEnabled = false)
        {
            try
            {
                List<MembershipTypes> memberships = uow.MembershipTypesRepository.GetAll().ToList();
            
                if (memberships != null && memberships.Count > 0)
                {
                    List<MemberShip> membershipsDetails = uow.MembershipRepository.GetAll().ToList();
                    foreach (var membership in memberships)
                    {
                        membership.IsDeleteble = (membershipsDetails.Where(x => x.MemberPackage == membership.Id).Count() > 0) ? false : true;
                    }

                    if (isEnabled)
                        memberships = memberships.Where(x => x.IsEnable == true).ToList();

                    webResponce = new WebResponce()
                    {
                        Code = 1,
                        Message = "Success",
                        Data = memberships
                    };
                }
                else
                {
                    webResponce = new WebResponce()
                    {
                        Code = 0,
                        Message = "Seems Like Doesn't have MembershipTypesDetails!"
                    };
                }
            }
            catch (Exception ex)
            {
                webResponce = new WebResponce()
                {
                    Code = -1,
                    Message = ex.Message.ToString()
                };
            }
            return webResponce;
        }

        public WebResponce SaveMembershipType(MembershipTypes membershipType)
        {
            try
            {
                var membershipCode = uow.DbContext.MembershipTypes.OrderBy(x => x.Id).Select(x => x.MembershipCode).LastOrDefault();
                if (membershipCode != null)
                {
                    int subs = int.Parse(membershipCode.Split('-')[1]);
                    int val = subs + 1;
                    membershipType.MembershipCode = membershipCode.Split('-')[0] + "-" + val;
                }
                else
                {
                    membershipType.MembershipCode = "Mem-1";
                }
                membershipType.MembershipName = membershipType.MembershipName.Trim();
                membershipType.CreatedDate = GetDateTimeByLocalZone.GetDateTime();
                membershipType.CreatedBy = membershipType.CreatedBy;
                uow.MembershipTypesRepository.Insert(membershipType);
                uow.Save();

                webResponce = new WebResponce()
                {
                    Code = 1,
                    Message = "Success",
                    Data = membershipType
                };
            }
            catch (Exception ex)
            {
                webResponce = new WebResponce()
                {
                    Code = -1,
                    Message = ex.Message.ToString()
                };
            }
            return webResponce;
        }

        public WebResponce DeleteMembershipType(MembershipTypes membershipType)
        {
            try
            {
                var membership = uow.DbContext.MembershipTypes.Where(x => x.Id == membershipType.Id).FirstOrDefault();
                if (membership != null)
                {
                    uow.MembershipTypesRepository.Delete(membership);
                    uow.Save();
                    webResponce = new WebResponce()
                    {
                        Code = 1,
                        Message = "Success"
                    };
                }
                else
                {
                    webResponce = new WebResponce()
                    {
                        Code = 0,
                        Message = "Seems Like Doesn't have Records!"
                    };
                }
            }
            catch (Exception ex)
            {
                webResponce = new WebResponce()
                {
                    Code = -1,
                    Message = ex.Message.ToString()
                };
            }
            return webResponce;
        }

        public WebResponce GetMembershipTypeById(int Id)
        {
            try
            {
                var membershipType = uow.MembershipTypesRepository.GetByID(Id);
                if (membershipType != null)
                {
                    webResponce = new WebResponce()
                    {
                        Code = 1,
                        Message = "Success",
                        Data = membershipType
                    };
                }
                else
                {
                    webResponce = new WebResponce()
                    {
                        Code = 0,
                        Message = "Seems Like Doesn't have Records!"
                    };
                }
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
        public WebResponce UpdateMembershipType(MembershipTypes membershipType)
        {
            try
            {
                var membership = uow.DbContext.MembershipTypes.Where(x => x.Id == membershipType.Id).FirstOrDefault();
                if (membership != null)
                {
                    membership.MembershipName = membershipType.MembershipName.Trim();
                    membership.MembershipAmount = membershipType.MembershipAmount;
                    membership.IsEnable = membershipType.IsEnable;
                    membership.MonthsPerPackage = membershipType.MonthsPerPackage;

                    membership.ModifiedDate = GetDateTimeByLocalZone.GetDateTime();
                    membership.ModifiedBy = membershipType.ModifiedBy;
                    uow.MembershipTypesRepository.Update(membership);
                    uow.Save();

                    webResponce = new WebResponce()
                    {
                        Code = 1,
                        Message = "Success",
                    };
                }
                else
                {
                    webResponce = new WebResponce()
                    {
                        Code = 0,
                        Message = "Seems Like Doesn't have Records!"
                    };
                }

            }
            catch (Exception ex)
            {
                webResponce = new WebResponce()
                {
                    Code = -1,
                    Message = ex.Message.ToString()
                };
            }
            return webResponce;
        }

        public WebResponce SearchMembershipType(MembershipTypes types)
        {
            try
            {
                List<MembershipTypes> memberships = uow.DbContext.MembershipTypes.Where(x => x.MembershipCode.Contains(types.MembershipCode) && x.MembershipName.Contains(types.MembershipName)).ToList();
                if (memberships != null && memberships.Count > 0)
                {
                    webResponce = new WebResponce()
                    {
                        Code = 1,
                        Message = "Success",
                        Data = memberships
                    };
                }
                else
                {
                    webResponce = new WebResponce()
                    {
                        Code = 0,
                        Message = "Seems Like Doesn't have Records!"
                    };
                }
            }
            catch (Exception ex)
            {
                webResponce = new WebResponce()
                {
                    Code = -1,
                    Message = ex.Message.ToString()
                };
            }
            return webResponce;
        }
        #endregion

        #region MenuRights
        public WebResponce GetMenuRights()
        {
            try
            {
                var MenuRights = uow.DbContext.MenusRights.Select(s => new
                {
                    ParentId = s.ParentId,
                    Id = s.Id,
                    SortOrder = s.SortOrder,
                    MenuName = s.MenuName,
                    Staff = s.Staff == 1 ? "checked" : s.Staff == 2 ? "checked disabled" : s.Staff == 3 ? "disabled" : " ",
                    Admin = s.Admin == 1 ? "checked" : s.Admin == 2 ? "checked disabled" : s.Admin == 3 ? "disabled" : " ",
                    TemporaryStaff = s.TemporaryStaff == 1 ? "checked" : s.TemporaryStaff == 2 ? "checked disabled" : s.TemporaryStaff == 3 ? "disabled" : " "
                }).OrderBy(x => x.SortOrder).ToList();
                if (MenuRights != null)
                {
                    webResponce = new WebResponce()
                    {
                        Code = 1,
                        Message = "Success",
                        Data = MenuRights
                    };
                }
                else
                {
                    webResponce = new WebResponce()
                    {
                        Code = 0,
                        Message = "Seems Like Doesn't have Records!"
                    };
                }
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

        public WebResponce UpdateMenuRights(MenuRights menu)
        {
            try
            {
                var Menu = uow.DbContext.MenusRights.Where(x => x.Id == menu.Id).FirstOrDefault();
                if (Menu != null)
                {
                    Menu.Staff = menu.Staff;
                    //Menu.TemporaryStaff = menu.TemporaryStaff;
                   
                    uow.MenuRightsRepository.Update(Menu);
                    uow.Save();

                    webResponce = new WebResponce()
                    {
                        Code = 1,
                        Message = "Success",
                    };
                }
                else
                {
                    webResponce = new WebResponce()
                    {
                        Code = 0,
                        Message = "Seems Like Doesn't have Records!"
                    };
                }

            }
            catch (Exception ex)
            {
                webResponce = new WebResponce()
                {
                    Code = -1,
                    Message = ex.Message.ToString()
                };
            }
            return webResponce;
        }

        public WebResponce GetUserRights(string UserType)
        {
            try
            {
                 
                var RoleRights = uow.DbContext.MenusRights.Select(s => new { Role = UserType == "Admin" ? s.Admin : s.Staff }).ToList();
               
                if (RoleRights != null)
                {
                    var re = RoleRights[5].Role;
                    webResponce = new WebResponce()
                    {
                        Code = 1,
                        Message = "Success",
                        Data = RoleRights
                    };
                }
                else
                {
                    webResponce = new WebResponce()
                    {
                        Code = 0,
                        Message = "Seems Like Doesn't have Records!"
                    };
                }
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

        public List<int> GetUserRightsbyUsertype(string UserType)
        {
            try
            {
                var RoleRights = uow.DbContext.MenusRights.Select(s => new { x = UserType == "Admin" ? s.Admin : s.Staff }).ToList();
                List<int> menuRights = uow.MenuRightsRepository.GetAll().Select(x => UserType == "Admin" ? x.Admin : x.Staff).ToList();
                List<Branch> branches = uow.BranchRepository.GetAll().OrderBy(x => x.BranchCode).ToList();
                return menuRights;
            }
            catch (Exception ex)
            {

                throw;
            }
        }

        #endregion

        #region Internal Expenses

        public WebResponce GetEmployeeDetails(string employeeid)
        {
            try
            {
                var employeedetails = uow.EmployeeRepository.GetByID(employeeid);
                if (employeedetails != null)
                {
                    webResponce = new WebResponce()
                    {
                        Code = 1,
                        Message = "Success",
                        Data = employeedetails
                    };
                }
                else
                {
                    webResponce = new WebResponce()
                    {
                        Code = 0,
                        Message = "Invalid Employee ID"
                    };
                }
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

        public WebResponce SaveInternalExpenses(InternalExpenses internalExpenses)
        {
            try
            {               
                internalExpenses.CreatedDate = GetDateTimeByLocalZone.GetDateTime();
                uow.InternalExpensesRepository.Insert(internalExpenses);
                uow.Save();

                webResponce = new WebResponce()
                {
                    Code = 1,
                    Message = "Success",
                    Data = internalExpenses
                };
            }
            catch (Exception ex)
            {
                webResponce = new WebResponce()
                {
                    Code = -1,
                    Message = ex.Message.ToString()
                };
            }
            return webResponce;
        }
        public WebResponce UpdateInternalExpenses(InternalExpenses internalExpenses)
        {

            try
            {
                internalExpenses.PaymentDate = internalExpenses.PaymentDate.Date;
                internalExpenses.ModifiedDate = GetDateTimeByLocalZone.GetDateTime();
                uow.InternalExpensesRepository.Update(internalExpenses);
                uow.Save();            

                webResponce = new WebResponce()
                {
                    Code = 1,
                    Message = "Success",
                    Data = internalExpenses
                };
            }
            catch (Exception ex)
            {
                webResponce = new WebResponce()
                {
                    Code = -1,
                    Message = ex.Message.ToString()
                };
            }
            return webResponce;
        }

        public WebResponce LoadInternalExpenses()
        {
            try
            {
                List<InternalExpenses> expenses = uow.InternalExpensesRepository.GetAll().ToList();

                if (expenses != null && expenses.Count > 0)
                {
                    webResponce = new WebResponce()
                    {
                        Code = 1,
                        Message = "Success",
                        Data = expenses
                    };
                }
                else
                {
                    webResponce = new WebResponce()
                    {
                        Code = 0,
                        Message = "Seems Like Doesn't have Records!"
                    };
                }
            }
            catch (Exception ex)
            {
                webResponce = new WebResponce()
                {
                    Code = -1,
                    Message = ex.Message.ToString()
                };
            }
            return webResponce;
        }

        public WebResponce DeleteInternalExpenses(int internalExpensesID)
        {
            try
            {
                var expense = uow.DbContext.InternalExpenses.Where(x => x.Id == internalExpensesID).FirstOrDefault();
                if (expense != null)
                {
                    uow.InternalExpensesRepository.Delete(expense);
                    uow.Save();
                    webResponce = new WebResponce()
                    {
                        Code = 1,
                        Message = "Success"
                    };
                }
                else
                {
                    webResponce = new WebResponce()
                    {
                        Code = 0,
                        Message = "Seems Like Doesn't have Records!"
                    };
                }
            }
            catch (Exception ex)
            {
                webResponce = new WebResponce()
                {
                    Code = -1,
                    Message = ex.Message.ToString()
                };
            }
            return webResponce;
        }
        #endregion

    }
}
