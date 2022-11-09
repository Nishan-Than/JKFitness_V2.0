using DataLayer;
using DataLayer.Models;
using ServiceLayer.VMmodel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ServiceLayer
{
    public class NotificationService
    {
        private readonly UnitOfWork uow;
        WebResponce webResponce = null;

        public NotificationService(UnitOfWork uow) {
            this.uow = uow;
        }
        public WebResponce ListNotification(string EmpId)
        {
            try
            {
                var employee = uow.EmployeeRepository.GetByID(EmpId);
                NotificationVM notificationVM = new NotificationVM();
                notificationVM.PackageExpirationThisMonth = uow.MembershipRepository.GetAll().Where(x => x.PackageExpirationDate.Date.Month == GetDateTimeByLocalZone.GetDateTime().Date.Month && x.PackageExpirationDate.Date.Year == GetDateTimeByLocalZone.GetDateTime().Date.Year).ToList();
                notificationVM.PackageExpirationNextMonth = uow.MembershipRepository.GetAll().Where(x => x.PackageExpirationDate.Date.Month == GetDateTimeByLocalZone.GetDateTime().Date.AddMonths(1).Month && x.PackageExpirationDate.Date.Year == GetDateTimeByLocalZone.GetDateTime().Date.Year).ToList();
                notificationVM.PackageExpirationLastMonth = uow.MembershipRepository.GetAll().Where(x => x.PackageExpirationDate.Date.Month == GetDateTimeByLocalZone.GetDateTime().Date.AddMonths(-1).Month && x.PackageExpirationDate.Date.Year == GetDateTimeByLocalZone.GetDateTime().Date.Year).ToList();

                notificationVM.MemberShipExpirationThisMonth = uow.MembershipRepository.GetAll().Where(x => x.MembershipExpirationDate.Date.Month == GetDateTimeByLocalZone.GetDateTime().Date.Month && x.MembershipExpirationDate.Date.Year == GetDateTimeByLocalZone.GetDateTime().Date.Year).ToList();
                notificationVM.MemberShipExpirationNextMonth = uow.MembershipRepository.GetAll().Where(x => x.MembershipExpirationDate.Date.Month == GetDateTimeByLocalZone.GetDateTime().AddMonths(1).Month && x.MembershipExpirationDate.Date.Year == GetDateTimeByLocalZone.GetDateTime().Date.Year).ToList();
                notificationVM.MemberShipExpirationLastMonth = uow.MembershipRepository.GetAll().Where(x => x.MembershipExpirationDate.Date.Month == GetDateTimeByLocalZone.GetDateTime().AddMonths(-1).Month && x.MembershipExpirationDate.Date.Year == GetDateTimeByLocalZone.GetDateTime().Date.Year).ToList();

                notificationVM.PackageExpirationThisMonth = employee.UserType == "Admin" ? notificationVM.PackageExpirationThisMonth : notificationVM.PackageExpirationThisMonth.Where(x => x.Branch == employee.Branch).ToList();
                notificationVM.PackageExpirationNextMonth = employee.UserType == "Admin" ? notificationVM.PackageExpirationNextMonth : notificationVM.PackageExpirationNextMonth.Where(x => x.Branch == employee.Branch).ToList();
                notificationVM.PackageExpirationLastMonth = employee.UserType == "Admin" ? notificationVM.PackageExpirationLastMonth : notificationVM.PackageExpirationLastMonth.Where(x => x.Branch == employee.Branch).ToList();

                notificationVM.MemberShipExpirationThisMonth = employee.UserType == "Admin" ? notificationVM.MemberShipExpirationThisMonth : notificationVM.MemberShipExpirationThisMonth.Where(x => x.Branch == employee.Branch).ToList();
                notificationVM.MemberShipExpirationNextMonth = employee.UserType == "Admin" ? notificationVM.MemberShipExpirationNextMonth : notificationVM.MemberShipExpirationNextMonth.Where(x => x.Branch == employee.Branch).ToList();
                notificationVM.MemberShipExpirationLastMonth = employee.UserType == "Admin" ? notificationVM.MemberShipExpirationLastMonth : notificationVM.MemberShipExpirationLastMonth.Where(x => x.Branch == employee.Branch).ToList();
               
                if (notificationVM != null )
                {
                    webResponce = new WebResponce()
                    {
                        Code = 1,
                        Message = "Success",
                        Data = notificationVM
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
    }
}
