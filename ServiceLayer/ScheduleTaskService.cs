using DataLayer;
using DataLayer.Models;
using ServiceLayer.Email;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ServiceLayer
{
    public class ScheduleTaskService
    {
        private readonly UnitOfWork uow;
        private readonly IMailService mailService;
        public ScheduleTaskService(UnitOfWork uow, IMailService mailService)
        {
            this.uow = uow;
            this.mailService = mailService;
        }
        public void DeleteMembershipAttendance()
        {
            try
            {
                List<MembersAttendance> MemberAttendances = uow.MembersAttendanceRepository.GetAll().Where(x => x.AttendDate.Date < GetDateTimeByLocalZone.GetDateTime().Date.AddMonths(-1)).ToList();
                if (MemberAttendances.Count > 0)
                {
                    uow.MembersAttendanceRepository.DeleteRange(MemberAttendances);
                    uow.Save();
                }
            }
            catch (Exception ex)
            {
                throw;
            }
        }

        public void SendPackageExpirationEmail()
        {
            try
            {
                #region 2days before

                List<MemberShip> membershipsForTwo = uow.MembershipRepository.GetAll().Where(x => x.PackageExpirationDate == GetDateTimeByLocalZone.GetDateTime().Date.AddDays(2)).ToList();

                if (membershipsForTwo.Count > 0)
                {
                    foreach (var Member in membershipsForTwo)
                    {
                        var Branch = uow.BranchRepository.GetAll().Where(x => x.BranchCode == Member.Branch).FirstOrDefault();
                        var request = new MailRequest();
                        request.ToEmail = Member.Email;
                        request.Subject = "Reminder of Package Expiration";

                        StringBuilder body = new StringBuilder();

                        body.AppendLine("<p style='line - height: 18px; font - family: verdana; font - size: 12px;'>Dear <strong>" + Member.FirstName + "</strong>,</p>");
                        body.AppendLine("<p style='line - height: 18px; font - family: verdana; font - size: 12px;'>Welcome to JK Fitness - " + Branch.BranchName + "</p>");
                        body.AppendLine("<p style='line - height: 18px; font - family: verdana; font - size: 12px;'>Membership Id: <strong> " + Member.MemberId + "</strong></p>");

                        body.AppendLine("<p style='line - height: 18px; font - family: verdana; font - size: 12px;'>As a friendly reminder, your fitness package is expiring on <strong> " + Member.PackageExpirationDate.ToString("dd.MM.yyyy") + ".</strong> Please renew your package and keep yourself fit with us.</p>");
                        body.AppendLine("<p style='line - height: 18px; font - family: verdana; font - size: 12px;'>Regards,<br /> JK Fitness group<br />0772395819 <br />jkfitness23@gmail.com</ p > ");

                        request.Body = body.ToString();
                        mailService.SendEmailAsync(request);
                    }
                }
                #endregion

                #region Same day

                List<MemberShip> memberships = uow.MembershipRepository.GetAll().Where(x => x.PackageExpirationDate == GetDateTimeByLocalZone.GetDateTime().Date).ToList();

                if (memberships.Count > 0)
                {
                    foreach (var Member in memberships)
                    {
                        var Branch = uow.BranchRepository.GetAll().Where(x => x.BranchCode == Member.Branch).FirstOrDefault();
                        var request = new MailRequest();
                        request.ToEmail = Member.Email;
                        request.Subject = "Reminder of Package Expiration";

                        StringBuilder body = new StringBuilder();

                        body.AppendLine("<p style='line - height: 18px; font - family: verdana; font - size: 12px;'>Dear <strong>" + Member.FirstName + "</strong>,</p>");
                        body.AppendLine("<p style='line - height: 18px; font - family: verdana; font - size: 12px;'>Welcome to JK Fitness - " + Branch.BranchName + "</p>");
                        body.AppendLine("<p style='line - height: 18px; font - family: verdana; font - size: 12px;'>Membership Id: <strong> " + Member.MemberId + "</strong></p>");

                        body.AppendLine("<p style='line - height: 18px; font - family: verdana; font - size: 12px;'>Last call! Your fitness package is expiring in <strong>24 hours.</strong> Please renew your package and keep yourself fit with us.</p>");
                        body.AppendLine("<p style='line - height: 18px; font - family: verdana; font - size: 12px;'>Regards,<br /> JK Fitness group<br />0772395819 <br />jkfitness23@gmail.com</ p > ");

                        request.Body = body.ToString();
                        mailService.SendEmailAsync(request);
                    }
                }
                #endregion
            }
            catch (Exception ex)
            {
                throw;
            }
        }

        public void SendMembershipExpirationEmail()
        {

            try
            {
                #region 7days before
                List<MemberShip> membershipsForSeven = uow.MembershipRepository.GetAll().Where(x => x.MembershipExpirationDate == GetDateTimeByLocalZone.GetDateTime().Date.AddDays(7)).ToList();

                if (membershipsForSeven.Count > 0)
                {
                    foreach (var Member in membershipsForSeven)
                    {
                        var Branch = uow.BranchRepository.GetAll().Where(x => x.BranchCode == Member.Branch).FirstOrDefault();
                        var request = new MailRequest();
                        request.ToEmail = Member.Email;
                        request.Subject = "Reminder of Membership Expiration";

                        StringBuilder body = new StringBuilder();

                        body.AppendLine("<p style='line - height: 18px; font - family: verdana; font - size: 12px;'>Dear <strong>" + Member.FirstName + "</strong>,</p>");
                        body.AppendLine("<p style='line - height: 18px; font - family: verdana; font - size: 12px;'>Welcome to JK Fitness - " + Branch.BranchName + "</p>");
                        body.AppendLine("<p style='line - height: 18px; font - family: verdana; font - size: 12px;'>Membership Id: <strong> " + Member.MemberId + "</strong></p>");

                        body.AppendLine("<p style='line - height: 18px; font - family: verdana; font - size: 12px;'>As a friendly reminder, your membership with JK Fitness is expiring on <strong> " + Member.MembershipExpirationDate.ToString("dd.MM.yyyy") + ".</strong> Please renew your package and keep yourself fit with us.</p>");
                        body.AppendLine("<p style='line - height: 18px; font - family: verdana; font - size: 12px;'>Regards,<br /> JK Fitness group<br />0772395819 <br />jkfitness23@gmail.com</ p > ");

                        request.Body = body.ToString();
                        mailService.SendEmailAsync(request);
                    }
                }
                #endregion
                #region 3days before
                List<MemberShip> membershipsForThree = uow.MembershipRepository.GetAll().Where(x => x.MembershipExpirationDate == GetDateTimeByLocalZone.GetDateTime().Date.AddDays(3)).ToList();

                if (membershipsForThree.Count > 0)
                {
                    foreach (var Member in membershipsForThree)
                    {
                        var Branch = uow.BranchRepository.GetAll().Where(x => x.BranchCode == Member.Branch).FirstOrDefault();
                        var request = new MailRequest();
                        request.ToEmail = Member.Email;
                        request.Subject = "Reminder of Membership Expiration";

                        StringBuilder body = new StringBuilder();

                        body.AppendLine("<p style='line - height: 18px; font - family: verdana; font - size: 12px;'>Dear <strong>" + Member.FirstName + "</strong>,</p>");
                        body.AppendLine("<p style='line - height: 18px; font - family: verdana; font - size: 12px;'>Welcome to JK Fitness - " + Branch.BranchName + "</p>");
                        body.AppendLine("<p style='line - height: 18px; font - family: verdana; font - size: 12px;'>Membership Id: <strong> " + Member.MemberId + "</strong></p>");

                        body.AppendLine("<p style='line - height: 18px; font - family: verdana; font - size: 12px;'>As a friendly reminder, your membership with JK Fitness is expiring on <strong> " + Member.MembershipExpirationDate.ToString("dd.MM.yyyy") + ".</strong> Please renew your package and keep yourself fit with us.</p>");
                        body.AppendLine("<p style='line - height: 18px; font - family: verdana; font - size: 12px;'>Regards,<br /> JK Fitness group<br />0772395819 <br />jkfitness23@gmail.com</ p > ");

                        request.Body = body.ToString();
                        mailService.SendEmailAsync(request);
                    }
                }
                #endregion
                #region Same day

                List<MemberShip> memberships = uow.MembershipRepository.GetAll().Where(x => x.MembershipExpirationDate == GetDateTimeByLocalZone.GetDateTime().Date).ToList();

                if (memberships.Count > 0)
                {
                    foreach (var Member in memberships)
                    {
                        var Branch = uow.BranchRepository.GetAll().Where(x => x.BranchCode == Member.Branch).FirstOrDefault();
                        var request = new MailRequest();
                        request.ToEmail = Member.Email;
                        request.Subject = "Reminder of Membership Expiration";

                        StringBuilder body = new StringBuilder();

                        body.AppendLine("<p style='line - height: 18px; font - family: verdana; font - size: 12px;'>Dear <strong>" + Member.FirstName + "</strong>,</p>");
                        body.AppendLine("<p style='line - height: 18px; font - family: verdana; font - size: 12px;'>Welcome to JK Fitness - " + Branch.BranchName + "</p>");
                        body.AppendLine("<p style='line - height: 18px; font - family: verdana; font - size: 12px;'>Membership Id: <strong> " + Member.MemberId + "</strong></p>");

                        body.AppendLine("<p style='line - height: 18px; font - family: verdana; font - size: 12px;'>Last call! Your membership with JK Fitness is expiring in <strong>24 hours.</strong> Please renew your package and keep yourself fit with us.</p>");
                        body.AppendLine("<p style='line - height: 18px; font - family: verdana; font - size: 12px;'>Regards,<br /> JK Fitness group<br />0772395819 <br />jkfitness23@gmail.com</ p > ");

                        request.Body = body.ToString();
                        mailService.SendEmailAsync(request);
                    }
                }
                #endregion
            }
            catch (Exception ex)
            {
                throw;
            }
        }

        public void DeactivateMembers()
        {
            try
            {
                List<MemberShip> deactivatingMembers = uow.MembershipRepository.GetAll().Where(x => x.MembershipExpirationDate == GetDateTimeByLocalZone.GetDateTime().Date.AddDays(-1)).ToList();

                if (deactivatingMembers.Count > 0)
                {
                    foreach (var member in deactivatingMembers)
                    {
                        var advancePayment = uow.MembershipPaymentsRepository.GetAll().Where(x => x.MemberId == member.MemberId & x.IsAdvancePay == true).LastOrDefault();
                        if (advancePayment != null)
                        {
                            var PackageDetails = uow.MembershipTypesRepository.GetByID(advancePayment.PackageType);
                            member.MemberPackage = advancePayment.PackageType != member.MemberPackage ? advancePayment.PackageType : member.MemberPackage;

                            member.PackageExpirationDate = member.PackageExpirationDate.AddMonths(PackageDetails.MonthsPerPackage).Date;

                            member.MembershipExpirationDate = member.PackageExpirationDate.AddMonths(1).Date;

                            member.Active = true;
                        }
                        else
                        {
                            member.Active = false;
                        }

                        member.ModifiedDate = GetDateTimeByLocalZone.GetDateTime();
                        uow.MembershipRepository.Update(member);
                        uow.Save();
                    }
                }
            }
            catch (Exception ex)
            {
                throw;
            }
        }

        public void TestMethod()
        {
            var request = new MailRequest();
            request.ToEmail = "kugabalanparthipan94@gmail.com";
            request.Subject = "Reminder of Membership Expiration";

            StringBuilder body = new StringBuilder();

            body.AppendLine("<p style='line - height: 18px; font - family: verdana; font - size: 12px;'>Dear <strong>Nishanthan</strong>,</p>");
            body.AppendLine("<p style='line - height: 18px; font - family: verdana; font - size: 12px;'>Welcome to JK Fitness - Test</p>");
            body.AppendLine("<p style='line - height: 18px; font - family: verdana; font - size: 12px;'>Membership Id: <strong> 123</strong></p>");

            body.AppendLine("<p style='line - height: 18px; font - family: verdana; font - size: 12px;'>Last call! Your membership with JK Fitness is expiring in <strong>24 hours.</strong> Please renew your package and keep yourself fit with us.</p>");
            body.AppendLine("<p style='line - height: 18px; font - family: verdana; font - size: 12px;'>Regards,<br /> JK Fitness group<br />0772395819 <br />jkfitness23@gmail.com</ p > ");

            request.Body = body.ToString();
            mailService.SendEmailAsync(request);
        }


    }
}
