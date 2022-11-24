using DataLayer;
using DataLayer.Models;
using ServiceLayer.Email;
using ServiceLayer.Password;
using ServiceLayer.VMmodel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ServiceLayer
{
    public class MemberShipService
    {
        private readonly UnitOfWork uow;
        WebResponce webResponce = null;
        private readonly IMailService mailService;

        public MemberShipService(UnitOfWork uow, IMailService mailService)
        {
            this.uow = uow;
            this.mailService = mailService;
        }

        public WebResponce SaveMemberShipDetails(MemberShip Member)
        {
            try
            {
                PasswordGenerate password = new();
                var MemPwd = password.Generate();
                var MemId = uow.DbContext.MemberShips.Where(x => x.Branch == Member.Branch.Trim()).OrderBy(x => x.MemberId).Select(x => x.MemberId).LastOrDefault();
                var PackageDetails = uow.MembershipTypesRepository.GetByID(Member.MemberPackage);
                var BranchDetail = uow.DbContext.Branches.Where(x => x.BranchCode == Member.Branch.Trim() && x.IsCurrent == true).FirstOrDefault();

                if (MemId != 0)
                {
                    if (MemId + 1 <= BranchDetail.MembershipInitialRangeTo)
                        Member.MemberId = MemId + 1;
                    else
                        Member.MemberId = ExtendNewBranch(BranchDetail);
                }
                else
                {
                    int InitialRange = uow.DbContext.Branches.Where(x => x.BranchCode == Member.Branch.Trim()).Select(x => x.MembershipInitialRangeFrom).FirstOrDefault();
                    Member.MemberId = InitialRange == 0 ? InitialRange + 1 : InitialRange;
                }

                Member.CreatedBy = Member.CreatedBy;
                Member.CreatedDate = GetDateTimeByLocalZone.GetDateTime();
                if (Member.IsFreeMembership)
                {
                    Member.PackageExpirationDate = GetDateTimeByLocalZone.GetDateTime().AddYears(100).Date;
                }
                else
                {
                    Member.PackageExpirationDate = Member.JoinDate.Date;
                }
                Member.MembershipExpirationDate = Member.PackageExpirationDate.AddMonths(1).Date;
                Member.Password= Crypto.Hash(MemPwd);
                Member.IsFirstTime = true;
                uow.MembershipRepository.Insert(Member);
                uow.Save();

                var request = new MailRequest();
                request.ToEmail = Member.Email;
                request.Subject = "Welcome";

                StringBuilder body = new StringBuilder();

                body.AppendLine("<p style='line - height: 18px; font - family: verdana; font - size: 12px;'>Dear <strong>" + Member.FirstName + "</strong>,</p>");
                body.AppendLine("<p style='line - height: 18px; font - family: verdana; font - size: 12px;'>Welcome to JK Fitness - " + BranchDetail.BranchName + "</p>");
                body.AppendLine("<p style='line - height: 18px; font - family: verdana; font - size: 12px;'>Membership Id: <strong> " + Member.MemberId + "</strong></p>");
                if (Member.IsFreeMembership)
                {
                    body.AppendLine("<p style='line - height: 18px; font - family: verdana; font - size: 12px;'>Your Fitness Package: <strong> Free Membership</strong></p>");
                }
                else
                {
                    body.AppendLine("<p style='line - height: 18px; font - family: verdana; font - size: 12px;'>Your Fitness Package: <strong>" + PackageDetails.MembershipName + "</strong></p>Package Amount: &nbsp;<strong>" + PackageDetails.MembershipAmount + "</strong><br />");
                }
                body.AppendLine("<p style='line - height: 18px; font - family: verdana; font - size: 12px;'>Package ExpirationDate: <strong> " + Member.PackageExpirationDate.ToString("dd.MM.yyyy") + "</strong></p>");
                body.AppendLine("<p style='line - height: 18px; font - family: verdana; font - size: 12px;'>Regards,<br /> JK Fitness group<br />0772395819 <br />jkfitness23@gmail.com</ p > ");

                request.Body = body.ToString();
                mailService.SendEmailAsync(request);

                #region Send password to Member's MailId

                var PwdMail = new MailRequest();
                PwdMail.ToEmail = Member.Email;
                PwdMail.Subject = "New Member Account";

                StringBuilder Pwdbody = new StringBuilder();

                Pwdbody.AppendLine("<p style='line - height: 18px; font - family: verdana; font - size: 12px;'>Dear " + Member.FirstName + ",</p>");
                Pwdbody.AppendLine("<p style='line - height: 18px; font - family: verdana; font - size: 12px;'>You can now login at JK Fitness web application.</p>");
                Pwdbody.AppendLine("<p style='line - height: 18px; font - family: verdana; font - size: 12px;'>Website Url: https://jkfitness.lk/ </p>");
                Pwdbody.AppendLine("<p style='line - height: 18px; font - family: verdana; font - size: 12px;'>Username: " + Member.Email + "</p>");
                Pwdbody.AppendLine("<p style='line - height: 18px; font - family: verdana; font - size: 12px;'>Password: " + MemPwd + "</p>");
                Pwdbody.AppendLine("<p style='line - height: 18px; font - family: verdana; font - size: 12px;'>Regards,<br /> JK Fitness group </ p > ");

                PwdMail.Body = Pwdbody.ToString();
                mailService.SendEmailAsync(PwdMail);
                #endregion

                webResponce = new WebResponce()
                {
                    Code = 1,
                    Message = "Success",
                    Data = Member
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

        public int ExtendNewBranch(Branch branch)
        {
            branch.IsCurrent = false;
            uow.BranchRepository.Update(branch);
            uow.Save();

            var membershiopLastToId = uow.DbContext.Branches.OrderByDescending(x => x.MembershipInitialRangeTo).Select(x => x.MembershipInitialRangeTo).FirstOrDefault();
            branch.Id = 0;
            branch.MembershipInitialRangeFrom = membershiopLastToId + 1;
            branch.MembershipInitialRangeTo = membershiopLastToId + 1000;
            branch.CreatedDate = GetDateTimeByLocalZone.GetDateTime();
            branch.IsCurrent = true;
            uow.BranchRepository.Insert(branch);
            uow.Save();

            return branch.MembershipInitialRangeFrom;
        }

        public WebResponce ListMemberShipDetails(MemberShip Mem)
        {
            try
            {
                List<MemberShip> Member = uow.MembershipRepository.GetAll().Where(x => x.Branch == Mem.Branch.Trim()).ToList();

                if (Member != null && Member.Count > 0)
                {
                    webResponce = new WebResponce()
                    {
                        Code = 1,
                        Message = "Success",
                        Data = Member
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

        public WebResponce GetMemberShipDetailsById(int Id)
        {
            try
            {
                var Member = uow.MembershipRepository.GetByID(Id);
                if (Member != null)
                {
                    webResponce = new WebResponce()
                    {
                        Code = 1,
                        Message = "Success",
                        Data = Member
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


        public WebResponce UpdateMemberShipDetails(MemberShip member)
        {
            try
            {
                var Mem = uow.DbContext.MemberShips.Where(x => x.MemberId == member.MemberId).FirstOrDefault();
                if (Mem != null)
                {
                    Mem.FirstName = member.FirstName.Trim();
                    Mem.LastName = member.LastName.Trim();
                    Mem.Gender = member.Gender.Trim();
                    Mem.NIC = member.NIC.Trim();
                    Mem.HouseNo = member.HouseNo;
                    Mem.Street = member.Street;
                    Mem.District = member.District;
                    Mem.Province = member.Province;
                    Mem.ContactNo = member.ContactNo.Trim();
                    Mem.DateofBirth = member.DateofBirth;
                    Mem.Email = member.Email.Trim();
                    Mem.Branch = member.Branch.Trim();
                    Mem.Age = member.Age;
                    Mem.Height = member.Height;
                    Mem.Weight = member.Weight;
                    Mem.BMI = member.BMI;
                    Mem.Payment = member.Payment;
                    Mem.EmergencyContactNo = member.EmergencyContactNo;
                    Mem.RelationShip = member.RelationShip;
                    Mem.IntroducedBy = member.IntroducedBy;
                    Mem.Active = member.Active;
                    Mem.Smoking = member.Smoking;
                    Mem.Discomfort = member.Discomfort;
                    Mem.Cholesterol = member.Cholesterol;
                    Mem.Herina = member.Herina;
                    Mem.Diabets = member.Diabets;
                    Mem.Pain = member.Pain;
                    Mem.Complaint = member.Complaint;
                    Mem.Incorrigible = member.Incorrigible;
                    Mem.Doctors = member.Doctors;
                    Mem.Pregnant = member.Pregnant;
                    Mem.Aliments = member.Aliments;
                    Mem.Surgery = member.Surgery;
                    Mem.Pressure = member.Pressure;
                    Mem.Trace = member.Trace;
                    Mem.Musele = member.Musele;
                    Mem.Fat = member.Fat;
                    Mem.Body = member.Body;
                    Mem.Fitness = member.Fitness;
                    Mem.Athletics = member.Athletics;
                    if(member.JoinDate.Date != Mem.JoinDate.Date)
                    {
                        Mem.PackageExpirationDate = member.JoinDate.Date;
                        Mem.JoinDate = member.JoinDate;
                    }                    
                    Mem.IsFreeMembership = member.IsFreeMembership;
                    var PackageDetails = uow.MembershipTypesRepository.GetByID(member.MemberPackage);
                    if (member.IsFreeMembership)
                    {
                        Mem.PackageExpirationDate = GetDateTimeByLocalZone.GetDateTime().AddYears(100).Date;
                    }
                    Mem.MembershipExpirationDate = Mem.PackageExpirationDate.AddMonths(1).Date;
                    if (Mem.MemberPackage != member.MemberPackage)
                    {
                        Mem.MemberPackage = member.MemberPackage;

                        var request = new MailRequest();
                        request.ToEmail = Mem.Email;
                        request.Subject = "Membership Package Change";

                        StringBuilder body = new StringBuilder();

                        body.AppendLine("<p style='line - height: 18px; font - family: verdana; font - size: 12px;'>Dear " + Mem.FirstName + ",</p>");
                        body.AppendLine("<p style='line - height: 18px; font - family: verdana; font - size: 12px;'>Your package got change successfully!.</p>");
                        if (Mem.IsFreeMembership)
                        {
                            body.AppendLine("<p style='line - height: 18px; font - family: verdana; font - size: 12px;'>Your Fitness Package: <strong> Free Membership</strong></p>");
                        }
                        else
                        {
                           // body.AppendLine("<p style='line - height: 18px; font - family: verdana; font - size: 12px;'>Your Fitness Package:" + PackageDetails.MembershipName + "</p>Package Amount: &nbsp;" + PackageDetails.MembershipAmount + "<br /><br />");
                        }
                        body.AppendLine("<p style='line - height: 18px; font - family: verdana; font - size: 12px;'>Package ExpirationDate: <strong> " + Mem.PackageExpirationDate.ToString("dd.MM.yyyy") + "</strong></p>");
                        body.AppendLine("<p style='line - height: 18px; font - family: verdana; font - size: 12px;'>Regards,<br /> JK Fitness group<br />0772395819 <br />jkfitness23@gmail.com</ p > ");

                        request.Body = body.ToString();
                        mailService.SendEmailAsync(request);

                    }
                    Mem.ModifiedDate = GetDateTimeByLocalZone.GetDateTime();
                    Mem.ModifiedBy = member.ModifiedBy;
                    uow.MembershipRepository.Update(Mem);
                    uow.Save();

                    webResponce = new WebResponce()
                    {
                        Code = 1,
                        Message = "Success",
                        Data = Mem
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

        public WebResponce DeleteMemberShpDetails(MemberShip Member)
        {
            try
            {
                var MeM = uow.DbContext.MemberShips.Where(x => x.MemberId == Member.MemberId).FirstOrDefault();
                if (MeM != null)
                {
                    uow.MembershipRepository.Delete(MeM);
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

        public WebResponce SearchMemberShipDetails(MemberShip member)
        {
            try
            {
                List<MemberShip> MeM = uow.DbContext.MemberShips.Where(x => x.Branch == member.Branch.Trim() && x.FirstName.Contains(member.FirstName)).ToList();
                if (MeM != null && MeM.Count > 0)
                {
                    webResponce = new WebResponce()
                    {
                        Code = 1,
                        Message = "Success",
                        Data = MeM
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

        public WebResponce ListBranches(string EmpId)
        {
            try
            {
                var employee = uow.EmployeeRepository.GetByID(EmpId);
                List<Branch> branch = uow.BranchRepository.GetAll().Where(x => x.IsCurrent == true).OrderBy(x => x.BranchCode).ToList();

                branch = employee.UserType == "Admin" || employee.UserType == "TemporaryStaff" ? branch : branch.Where(x => x.BranchCode == employee.Branch).ToList();

                if (branch != null && branch.Count > 0)
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

        public WebResponce ViewMemberShipAttendanceDetails(AttendancesVM attendances)
        {
            try
            {
                List<MembersAttendance> MemberAttendances = uow.MembersAttendanceRepository.GetAll().Where(x => x.AttendDate.Date == attendances.AttendanceDate).ToList();
                if (MemberAttendances != null && MemberAttendances.Count > 0)
                {
                    var records = (from b in uow.DbContext.MembersAttendances.Where(x => x.AttendDate.Date == attendances.AttendanceDate.Date)
                                   join m in uow.DbContext.MemberShips.Where(x => x.Branch == attendances.Branch.Trim()) on b.MembershipId equals m.MemberId
                                   select new { m.MemberId, m.FirstName, m.LastName, m.Branch,m.Active, b.MorningInTime, b.MorningOutTime, b.EveningInTime, b.EveningOutTime, 
                                       AttendDate = b.AttendDate.Date == DateTime.Now.Date ? b.AttendDate.Date : default, Id = b.Id > 0 ? b.Id : 0 }).ToList();

                    if(records.Count > 0)
                    {
                        webResponce = new WebResponce()
                        {
                            Code = 1,
                            Message = "Success",
                            Data = records
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

        public WebResponce SaveMemberShipAttendance(MembersAttendance Attendance)
        {

            try
            {
                Attendance.AttendDate = Attendance.AttendDate.Date;
                Attendance.CreatedDate = GetDateTimeByLocalZone.GetDateTime();
                uow.MembersAttendanceRepository.Insert(Attendance);
                uow.Save();
                webResponce = new WebResponce()
                {
                    Code = 1,
                    Message = "Success",
                    Data = Attendance
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

        public WebResponce UpdateMemberShipAttendance(MembersAttendance Attendance)
        {

            try
            {
                var Attend = uow.DbContext.MembersAttendances.Where(x => x.Id == Attendance.Id).FirstOrDefault();
                if (Attend != null)
                {
                    Attend.MorningInTime = Attendance.MorningInTime.Trim();
                    Attend.MorningOutTime = Attendance.MorningOutTime.Trim();
                    Attend.EveningInTime = Attendance.EveningInTime.Trim();
                    Attend.EveningOutTime = Attendance.EveningOutTime.Trim();
                    Attend.MembershipId = Attendance.MembershipId;
                    Attend.AttendDate = GetDateTimeByLocalZone.GetDateTime().Date;
                    Attend.ModifiedDate = GetDateTimeByLocalZone.GetDateTime();
                    Attend.ModifiedBy = Attendance.ModifiedBy;
                    uow.MembersAttendanceRepository.Update(Attend);
                    uow.Save();
                    webResponce = new WebResponce()
                    {
                        Code = 1,
                        Message = "Success",
                        Data = Attend
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

        public WebResponce DeleteMemberAttendance(MembersAttendance Attendance)
        {
            try
            {
                var Attend = uow.DbContext.MembersAttendances.Where(x => x.Id == Attendance.Id).FirstOrDefault();
                if (Attend != null)
                {
                    uow.MembersAttendanceRepository.Delete(Attend);
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

        public WebResponce LoadMemberShipAttendanceDetails(AttendancesVM attendances)
        {
            try
            {
                List<MembersAttendance> MemberAttendances = uow.MembersAttendanceRepository.GetAll().Where(x => x.AttendDate.Date == GetDateTimeByLocalZone.GetDateTime().Date).ToList();

                List<MemberShip> Member = uow.MembershipRepository.GetAll().Where(x => x.Active == true).ToList();

                var records = (from m in uow.DbContext.MemberShips.Where(x => x.Branch == attendances.Branch.Trim())
                               join b in uow.DbContext.MembersAttendances.Where(x => x.AttendDate.Date == attendances.AttendanceDate.Date) on m.MemberId equals b.MembershipId into lg
                               from x in lg.DefaultIfEmpty()
                               select new { m.MemberId, m.FirstName, m.LastName, m.Branch,m.Active, x.MorningInTime, x.MorningOutTime, x.EveningInTime, x.EveningOutTime, AttendDate = x.AttendDate.Date == GetDateTimeByLocalZone.GetDateTime().Date ? x.AttendDate.Date : default, Id = x.Id > 0 ? x.Id : 0 }).ToList();

                if (Member != null && Member.Count > 0)
                {
                    webResponce = new WebResponce()
                    {
                        Code = 1,
                        Message = "Success",
                        Data = records
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

        public WebResponce SaveProvisionalMemberShipDetails(ProvisionalMember provisionalMember)
        {
            try
            {   
                provisionalMember.CreatedDate = GetDateTimeByLocalZone.GetDateTime();
                uow.ProvisionalMemberRepository.Insert(provisionalMember);
                uow.Save();
                webResponce = new WebResponce()
                {
                    Code = 1,
                    Message = "Success",
                    Data = provisionalMember
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

        public WebResponce ListProvisionalMemberShipDetails(ProvisionalMember provisionalMember)
        {
            try
            {
                List<ProvisionalMember> provisionalMembers = uow.ProvisionalMemberRepository.GetAll().Where(x => x.Branch == provisionalMember.Branch.Trim()).ToList();

                if (provisionalMembers != null && provisionalMembers.Count > 0)
                {
                    webResponce = new WebResponce()
                    {
                        Code = 1,
                        Message = "Success",
                        Data = provisionalMembers
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

        public WebResponce UpdateProvisionalMember(ProvisionalMember provisionalMember)
        {
            try
            {
                provisionalMember.ModifiedDate = GetDateTimeByLocalZone.GetDateTime();
                uow.ProvisionalMemberRepository.Update(provisionalMember);
                uow.Save();

                webResponce = new WebResponce()
                {
                    Code = 1,
                    Message = "Success",
                    Data = provisionalMember
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

        public WebResponce DeleteProvisionalMember(ProvisionalMember provisionalMember)
        {
            try
            {
                var MeM = uow.DbContext.ProvisionalMembers.Where(x => x.Id == provisionalMember.Id).FirstOrDefault();
                if (MeM != null)
                {
                    uow.ProvisionalMemberRepository.Delete(MeM);
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

        public WebResponce SearchProvisionalMember(ProvisionalMember provisionalMember)
        {
            try
            {
                List<ProvisionalMember> provisionalMembers = uow.ProvisionalMemberRepository.GetAll().Where(x => x.NIC_PassportNo == provisionalMember.NIC_PassportNo.Trim()).ToList();

                if (provisionalMembers != null && provisionalMembers.Count > 0)
                {
                    webResponce = new WebResponce()
                    {
                        Code = 1,
                        Message = "Success",
                        Data = provisionalMembers
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
