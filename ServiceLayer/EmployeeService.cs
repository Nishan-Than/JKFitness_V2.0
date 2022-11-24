using DataLayer;
using DataLayer.Models;
using ServiceLayer.Email;
using ServiceLayer.Password;
using ServiceLayer.VMmodel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;

namespace ServiceLayer
{
    public class EmployeeService
    {
        private readonly UnitOfWork uow;
        WebResponce webResponce = null;
        private readonly IMailService mailService;

        public EmployeeService(UnitOfWork uow, IMailService mailService)
        {
            this.uow = uow;
            this.mailService = mailService;
        }

        public WebResponce ListBranches()
        {
            try
            {
                List<Branch> branch = uow.BranchRepository.GetAll().Where(x => x.IsCurrent == true).OrderBy(x => x.BranchCode).ToList();
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
                        Message = "Seems Like Doesn't have Branch Dtails!"
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

        public WebResponce ListUserType()
        {
            try
            {
                List<UserType> userType = uow.UserTypeRepository.GetAll().ToList();
                if (userType != null && userType.Count > 0)
                {
                    webResponce = new WebResponce()
                    {
                        Code = 1,
                        Message = "Success",
                        Data = userType
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

        public WebResponce SaveEmployees(Employee employee)
        {
            try
            {
                var CopiedEmail = uow.DbContext.Employees.Where(x => x.Email == employee.Email.Trim()).FirstOrDefault();
                if (CopiedEmail == null)
                {
                    PasswordGenerate password = new();
                    var EmpPwd = password.Generate();
                    var empl = uow.DbContext.Employees.Where(x => x.Branch == employee.Branch.Trim()).OrderBy(x => x.EmployeeId).Select(x => x.EmployeeId).LastOrDefault();
                    var branchCode = uow.DbContext.Branches.Where(x => x.BranchCode == employee.Branch.Trim()).Select(i => i.BranchCode).FirstOrDefault();
                    if (empl != null)
                    {
                        double subs = double.Parse(empl.Split(' ')[1]);
                        double val = subs + (double)0.0001;
                        employee.EmployeeId = branchCode.Split(' ')[0] + " " + String.Format("{0:0.0000}", val);
                    }
                    else
                    {
                        employee.EmployeeId = branchCode + "001";
                    }

                    //employee.Salutation = employee.Salutation.Trim();
                    //employee.FirstName = employee.FirstName.Trim();
                    //employee.LastName = employee.LastName.Trim();
                    //employee.Email = employee.Email.Trim();
                    //employee.PhoneNo = employee.PhoneNo.Trim();
                    //employee.Branch = employee.Branch.Trim();
                    //employee.UserType = employee.UserType.Trim();
                    employee.CreatedDate = GetDateTimeByLocalZone.GetDateTime();
                    employee.CreatedBy = employee.CreatedBy;
                    employee.Password = Crypto.Hash(EmpPwd);
                    employee.IsFirstTime = true;
                    uow.EmployeeRepository.Insert(employee);
                    uow.Save();

                    var request = new MailRequest();
                    request.ToEmail = employee.Email;
                    request.Subject = "New Office Account";

                    StringBuilder body = new StringBuilder();

                    body.AppendLine("<p style='line - height: 18px; font - family: verdana; font - size: 12px;'>Dear " + employee.FirstName + ",</p>");
                    body.AppendLine("<p style='line - height: 18px; font - family: verdana; font - size: 12px;'>You can now login at JK Fitness Backoffice web application.</p>");
                    body.AppendLine("<p style='line - height: 18px; font - family: verdana; font - size: 12px;'>Website Url: https://jkfitness.lk/ </p>");
                    body.AppendLine("<p style='line - height: 18px; font - family: verdana; font - size: 12px;'>Username: " + employee.Email + "</p>");
                    body.AppendLine("<p style='line - height: 18px; font - family: verdana; font - size: 12px;'>Password: " + EmpPwd + "</p>");
                    body.AppendLine("<p style='line - height: 18px; font - family: verdana; font - size: 12px;'>Regards,<br /> JK Fitness group </ p > ");

                    request.Body = body.ToString();
                    mailService.SendEmailAsync(request);

                    webResponce = new WebResponce()
                    {
                        Code = 1,
                        Message = "Success",
                        Data = employee
                    };
                }
                else
                {
                    webResponce = new WebResponce()
                    {
                        Code = 0,
                        Message = "Duplicate"
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

        public WebResponce ListEmployeeDetails()
        {
            try
            {
                List<Employee> employe = uow.EmployeeRepository.GetAll().ToList();
                if (employe != null && employe.Count > 0)
                {
                    webResponce = new WebResponce()
                    {
                        Code = 1,
                        Message = "Success",
                        Data = employe
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

        //public byte[] GetImage(string sBase64String)
        //{
        //    byte[] bytes = null;
        //    if (!string.IsNullOrEmpty(sBase64String))
        //    {
        //        bytes = Convert.FromBase64String(sBase64String);
        //    }
        //    return bytes;
        //}

        public WebResponce GetEmployeeById(string Id)
        {
            try
            {
                var employee = uow.EmployeeRepository.GetByID(Id);
                if (employee != null)
                {
                    webResponce = new WebResponce()
                    {
                        Code = 1,
                        Message = "Success",
                        Data = employee
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

        public WebResponce UpdateEmployees(Employee employee)
        {
            try
            {
                var Empl = uow.DbContext.Employees.Where(x => x.EmployeeId == employee.EmployeeId.Trim()).FirstOrDefault();
                if (Empl != null)
                {
                    Empl.Salutation = employee.Salutation.Trim();
                    Empl.FirstName = employee.FirstName.Trim();
                    Empl.LastName = employee.LastName.Trim();
                    Empl.HouseNo = employee.HouseNo.Trim();
                    Empl.Street = employee.Street.Trim();
                    Empl.District = employee.District;
                    Empl.Province = employee.Province;
                    if (employee.Image != null)
                    {
                        Empl.Image = employee.Image;
                    }
                    Empl.Email = employee.Email.Trim();
                    Empl.PhoneNo = employee.PhoneNo.Trim();
                    Empl.Branch = employee.Branch.Trim();
                    Empl.UserType = employee.UserType.Trim();
                    Empl.Active = employee.Active;
                    Empl.IsTrainer = employee.IsTrainer;
                    Empl.MorningInTime = employee.MorningInTime;
                    Empl.MorningOutTime = employee.MorningOutTime;
                    Empl.EveningInTime = employee.EveningInTime;
                    Empl.EveningOutTime = employee.EveningOutTime;
                    Empl.ModifiedDate = GetDateTimeByLocalZone.GetDateTime();
                    Empl.ModifiedBy = employee.ModifiedBy;
                    uow.EmployeeRepository.Update(Empl);
                    uow.Save();

                    webResponce = new WebResponce()
                    {
                        Code = 1,
                        Message = "Success",
                        Data = employee
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

        public WebResponce DeleteEmployee(Employee employee)
        {
            try
            {
                var Empl = uow.DbContext.Employees.Where(x => x.EmployeeId == employee.EmployeeId.Trim()).FirstOrDefault();
                if (Empl != null)
                {
                    uow.EmployeeRepository.Delete(Empl);
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

        public WebResponce SearchEmployee(Employee employee)
        {
            try
            {
                List<Employee> Empl = uow.DbContext.Employees.Where(x => x.Branch == employee.Branch.Trim() && x.FirstName.Contains(employee.FirstName)).ToList();
                if (Empl != null && Empl.Count > 0)
                {
                    webResponce = new WebResponce()
                    {
                        Code = 1,
                        Message = "Success",
                        Data = Empl
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

        public WebResponce UpdateSalary(Employee employee)
        {
            try
            {
                var Empl = uow.DbContext.Employees.Where(x => x.EmployeeId == employee.EmployeeId.Trim()).FirstOrDefault();
                if (Empl != null)
                {
                    Empl.Salary = employee.Salary;
                    Empl.ModifiedDate = GetDateTimeByLocalZone.GetDateTime();
                    Empl.ModifiedBy = employee.ModifiedBy;
                    uow.EmployeeRepository.Update(Empl);
                    uow.Save();

                    webResponce = new WebResponce()
                    {
                        Code = 1,
                        Message = "Success",
                        Data = employee
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

        public WebResponce GetMembershipDetails(int memberId)
        {
            try
            {
                var memberdetails = uow.MembershipRepository.GetByID(memberId);
                if (memberdetails != null)
                {
                    webResponce = new WebResponce()
                    {
                        Code = 1,
                        Message = "Success",
                        Data = memberdetails
                    };
                }
                else
                {
                    webResponce = new WebResponce()
                    {
                        Code = 0,
                        Message = "Invalid Membership ID"
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

        #region Training Request and Histroy
        public WebResponce ListTrainerDetails(int memberId)
        {
            try
            {
                var member = uow.MembershipRepository.GetByID(memberId);
                List<Employee> employe = uow.DbContext.Employees.Where(x => x.IsTrainer == true && x.Branch == member.Branch).ToList();
                if (employe != null && employe.Count > 0)
                {
                    webResponce = new WebResponce()
                    {
                        Code = 1,
                        Message = "Success",
                        Data = employe
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

        public WebResponce NewTrainingRequest(TrainingVM training)
        {
            try
            {
                var Empl = uow.DbContext.Employees.Where(x => x.EmployeeId == training.EmployeeId.Trim()).FirstOrDefault();
                if (Empl != null)
                {
                    List<TrainingVM> TrainingList = new List<TrainingVM>();

                    int intime = Int32.Parse(Empl.MorningInTime.Split(":")[0]);
                    int outtime = Int32.Parse(Empl.MorningOutTime.Split(":")[0]);

                    while (intime < outtime)
                    {
                        string timeSlot = intime + "AM" + " - " + (intime + 1) + "AM";
                        var traning = new TrainingVM();
                        traning.TimeSlot = timeSlot;

                        var ReqTrainer = uow.DbContext.RequestTrainers.Where(x => x.MemberId == training.MemberId && x.TrainingTimeSlot == timeSlot && x.TrainingDate == training.Date && x.EmployeeId == training.EmployeeId.Trim()).FirstOrDefault();
                        if (ReqTrainer != null)
                        {
                            traning.Status = ReqTrainer.RequestStatus;
                        }
                        else
                        {
                            ReqTrainer = uow.DbContext.RequestTrainers.Where(x => x.TrainingTimeSlot == timeSlot && x.TrainingDate == training.Date && x.EmployeeId == training.EmployeeId.Trim() && x.RequestStatus != "Declined").FirstOrDefault();
                            if (ReqTrainer != null)
                            {
                                traning.Status = "Not Available";
                            }
                            else
                            {
                                traning.Status = "Available";
                            }

                        }

                        TrainingList.Add(traning);
                        intime++;
                    }
                    intime = Int32.Parse(Empl.EveningInTime.Split(":")[0]);
                    outtime = Int32.Parse(Empl.EveningOutTime.Split(":")[0]);

                    while (intime < outtime)
                    {
                        string timeSlot1 = intime + "PM" + " - " + (intime + 1) + "PM";
                        var traning1 = new TrainingVM();
                        traning1.TimeSlot = timeSlot1;

                        var ReqTrainer1 = uow.DbContext.RequestTrainers.Where(x => x.MemberId == training.MemberId && x.TrainingTimeSlot == timeSlot1 && x.TrainingDate == training.Date).FirstOrDefault();
                        if (ReqTrainer1 != null)
                        {
                            traning1.Status = ReqTrainer1.RequestStatus;
                        }
                        else
                        {
                            ReqTrainer1 = uow.DbContext.RequestTrainers.Where(x => x.TrainingTimeSlot == timeSlot1 && x.TrainingDate == training.Date).FirstOrDefault();
                            if (ReqTrainer1 != null)
                            {
                                traning1.Status = "Not Available";
                            }
                            else
                            {
                                traning1.Status = "Available";
                            }

                        }

                        TrainingList.Add(traning1);
                        intime++;
                    }

                    webResponce = new WebResponce()
                    {
                        Code = 1,
                        Message = "Success",
                        Data = TrainingList
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

        public WebResponce SaveNewTrainingRequest(RequestTrainers requestTrainers)
        {
            try
            {
                var Empl = uow.DbContext.Employees.Where(x => x.EmployeeId == requestTrainers.EmployeeId.Trim()).FirstOrDefault();
                var member = uow.MembershipRepository.GetByID(requestTrainers.MemberId);

                requestTrainers.RequestStatus = "Pending";
                requestTrainers.CreatedDate = GetDateTimeByLocalZone.GetDateTime();
                requestTrainers.CreatedBy = requestTrainers.EmployeeId;
               
                uow.RequestTrainersRepository.Insert(requestTrainers);
                uow.Save();

                var request = new MailRequest();
                request.ToEmail = Empl.Email;
                request.Subject = "New Personal Training Request";

                StringBuilder body = new StringBuilder();

                body.AppendLine("<p style='line - height: 18px; font - family: verdana; font - size: 12px;'>Dear " + Empl.FirstName + ",</p>");
                body.AppendLine("<p style='line - height: 18px; font - family: verdana; font - size: 12px;'>You get a new personal training request from a member of your branch.</p>");
                body.AppendLine("<p style='line - height: 18px; font - family: verdana; font - size: 12px;'>Member: " + member.FirstName + member.LastName + " </p>");
                body.AppendLine("<p style='line - height: 18px; font - family: verdana; font - size: 12px;'>Date: " + requestTrainers.TrainingDate.ToShortDateString() + "</p>");
                body.AppendLine("<p style='line - height: 18px; font - family: verdana; font - size: 12px;'>Time: " + requestTrainers.TrainingTimeSlot + "</p>");
                body.AppendLine("<p style='line - height: 18px; font - family: verdana; font - size: 12px;'>Regards,<br /> JK Fitness group </ p > ");

                request.Body = body.ToString();
                mailService.SendEmailAsync(request);

                webResponce = new WebResponce()
                {
                    Code = 1,
                    Message = "Success",
                    Data = requestTrainers
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

        public WebResponce MemberTrainingHistroy(TrainingVM training)
        {
            try
            {
                var TrainingHis = uow.DbContext.RequestTrainers.Where(x => x.MemberId == training.MemberId && x.TrainingDate.Year == training.Year && x.TrainingDate.Month==training.Month).ToList();
                if (TrainingHis.Count != 0)
                {
                    List<TrainingVM> TrainingList = new List<TrainingVM>();
                    foreach (var item in TrainingHis)
                    {
                        var REtraning = new TrainingVM();
                        REtraning.Date = item.TrainingDate;
                        REtraning.TimeSlot = item.TrainingTimeSlot;
                        REtraning.Trainer = uow.DbContext.Employees.Where(x => x.EmployeeId == item.EmployeeId).Select(x => x.FirstName + " " + x.LastName).FirstOrDefault();
                        REtraning.Status = item.RequestStatus;
                        TrainingList.Add(REtraning);
                    }
                    webResponce = new WebResponce()
                    {
                        Code = 1,
                        Message = "Success",
                        Data = TrainingList
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

        #region Employee Traning
        public WebResponce EmployeeTrainingRequest(TrainingVM training)
        {
            try
            {
                var Empl = uow.DbContext.Employees.Where(x => x.EmployeeId == training.EmployeeId.Trim()).FirstOrDefault();
                if (Empl != null)
                {
                    List<TrainingVM> TrainingList = new List<TrainingVM>();

                    int intime = Int32.Parse(Empl.MorningInTime.Split(":")[0]);
                    int outtime = Int32.Parse(Empl.MorningOutTime.Split(":")[0]);

                    while (intime < outtime)
                    {
                        string timeSlot = intime + "AM" + " - " + (intime + 1) + "AM";
                        var traning = new TrainingVM();
                        traning.TimeSlot = timeSlot;

                        var ReqTrainer = uow.DbContext.RequestTrainers.Where(x => x.EmployeeId == training.EmployeeId.Trim() && x.TrainingTimeSlot == timeSlot && x.TrainingDate == training.Date).FirstOrDefault();
                        if (ReqTrainer != null)
                        {
                            traning.Status = ReqTrainer.RequestStatus;
                            traning.MemberId = ReqTrainer.MemberId;
                            traning.MemberName = uow.DbContext.MemberShips.Where(x => x.MemberId == ReqTrainer.MemberId).Select(x => x.FirstName + " " + x.LastName).FirstOrDefault();
                            traning.Id = ReqTrainer.RequestId;
                        }
                        else
                        {
                            traning.Status = "Available";
                        }

                        TrainingList.Add(traning);
                        intime++;
                    }
                    intime = Int32.Parse(Empl.EveningInTime.Split(":")[0]);
                    outtime = Int32.Parse(Empl.EveningOutTime.Split(":")[0]);

                    while (intime < outtime)
                    {
                        string timeSlot1 = intime + "PM" + " - " + (intime + 1) + "PM";
                        var traning1 = new TrainingVM();
                        traning1.TimeSlot = timeSlot1;

                        var ReqTrainer1 = uow.DbContext.RequestTrainers.Where(x => x.EmployeeId == training.EmployeeId && x.TrainingTimeSlot == timeSlot1 && x.TrainingDate == training.Date).FirstOrDefault();
                        if (ReqTrainer1 != null)
                        {
                            traning1.Status = ReqTrainer1.RequestStatus;
                            traning1.MemberId = ReqTrainer1.MemberId;
                            traning1.MemberName = uow.DbContext.MemberShips.Where(x => x.MemberId == ReqTrainer1.MemberId).Select(x => x.FirstName + " " + x.LastName).FirstOrDefault();
                            traning1.Id = ReqTrainer1.RequestId;
                        }
                        else
                        {
                            traning1.Status = "Available";
                        }

                        TrainingList.Add(traning1);
                        intime++;
                    }

                    webResponce = new WebResponce()
                    {
                        Code = 1,
                        Message = "Success",
                        Data = TrainingList
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

        public WebResponce EmployeeTrainingHistroy(TrainingVM trainers)
        {
            try
            {
                var TrainingRequest = uow.DbContext.RequestTrainers.Where(x => x.EmployeeId == trainers.EmployeeId && x.TrainingDate.Year == trainers.Year && x.TrainingDate.Month == trainers.Month).ToList();
                if (TrainingRequest.Count != 0)
                {
                    List<TrainingVM> TrainingList = new List<TrainingVM>();
                    foreach (var item in TrainingRequest)
                    {
                        var REtraning = new TrainingVM();
                        REtraning.Date = item.TrainingDate;
                        REtraning.MemberId = item.MemberId;
                        REtraning.TimeSlot = item.TrainingTimeSlot;
                        REtraning.MemberName = uow.DbContext.MemberShips.Where(x => x.MemberId == item.MemberId).Select(x => x.FirstName + " " + x.LastName).FirstOrDefault();
                        REtraning.Status = item.RequestStatus;
                        TrainingList.Add(REtraning);
                    }
                    webResponce = new WebResponce()
                    {
                        Code = 1,
                        Message = "Success",
                        Data = TrainingList
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

        public WebResponce UpdateRequestTrainerStatus(TrainingVM trainers)
        {
            try
            {
                var Empl = uow.DbContext.Employees.Where(x => x.EmployeeId == trainers.EmployeeId.Trim()).FirstOrDefault();
                var ReTrainer = uow.DbContext.RequestTrainers.Where(x => x.RequestId == trainers.Id).FirstOrDefault();
                if (ReTrainer != null)
                {
                    var member = uow.MembershipRepository.GetByID(ReTrainer.MemberId);
                    ReTrainer.RequestStatus = trainers.Status;
                    ReTrainer.ModifiedDate = GetDateTimeByLocalZone.GetDateTime();
                    ReTrainer.ModifiedBy = trainers.EmployeeId;
                    uow.RequestTrainersRepository.Update(ReTrainer);
                    uow.Save();

                    if (ReTrainer.RequestStatus != "Pending") {
                        var request = new MailRequest();
                        request.ToEmail = member.Email;
                        request.Subject = "New Personal Training Request";

                        StringBuilder body = new StringBuilder();

                        body.AppendLine("<p style='line - height: 18px; font - family: verdana; font - size: 12px;'>Dear " + member.FirstName + member.LastName + ",</p>");
                        body.AppendLine("<p style='line - height: 18px; font - family: verdana; font - size: 12px;'>You got an update for your new training request from your trainer.</p>");
                        body.AppendLine("<p style='line - height: 18px; font - family: verdana; font - size: 12px;'>Trainer: " + Empl.FirstName + Empl.LastName + " </p>");
                        body.AppendLine("<p style='line - height: 18px; font - family: verdana; font - size: 12px;'>Date: " + ReTrainer.TrainingDate.ToShortDateString() + "</p>");
                        body.AppendLine("<p style='line - height: 18px; font - family: verdana; font - size: 12px;'>Time: " + ReTrainer.TrainingTimeSlot + "</p>");

                        if(ReTrainer.RequestStatus == "Declined")
                            body.AppendLine("<p style='line - height: 18px; font - family: verdana; font - size: 12px; color:red;'>Status: " + ReTrainer.RequestStatus + "</p>");
                        else
                            body.AppendLine("<p style='line - height: 18px; font - family: verdana; font - size: 12px; color:green;'>Status: " + ReTrainer.RequestStatus + "</p>");

                        body.AppendLine("<p style='line - height: 18px; font - family: verdana; font - size: 12px;'>Regards,<br /> JK Fitness group </ p > ");

                        request.Body = body.ToString();
                        mailService.SendEmailAsync(request);
                    }

                    webResponce = new WebResponce()
                    {
                        Code = 1,
                        Message = "Success",
                        Data = ReTrainer
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

        public WebResponce GetTrainingStartandEndYear()
        {
            try
            {
                var trainingHistory = uow.RequestTrainersRepository.GetAll().OrderBy(x => x.TrainingDate).ToList();
                var trainingYears = new TrainingYears();

                if (trainingHistory.Count > 0)
                {
                    trainingYears.StartYear = trainingHistory.First().TrainingDate.Year;
                    trainingYears.EndYear = trainingHistory.Last().TrainingDate.Year;
                }
                else
                {
                    trainingYears.StartYear = GetDateTimeByLocalZone.GetDateTime().Year;
                    trainingYears.EndYear = GetDateTimeByLocalZone.GetDateTime().Year;
                }

                webResponce = new WebResponce()
                {
                    Code = 1,
                    Message = "Success",
                    Data = trainingYears
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

        public WebResponce AllTrainingHistroyPerBranch(TrainingVM trainers)
        {
            try
            {
                var TrainingRequest = (from b in uow.DbContext.RequestTrainers.Where(x => x.TrainingDate.Year == trainers.Year && x.TrainingDate.Month == trainers.Month)
                                       join m in uow.DbContext.Employees.Where(x => x.Branch == trainers.Branch.Trim()) on b.EmployeeId equals m.EmployeeId
                                       select b).ToList();

                if (TrainingRequest.Count != 0)
                {
                    List<TrainingVM> TrainingList = new List<TrainingVM>();
                    foreach (var item in TrainingRequest)
                    {
                        var REtraning = new TrainingVM();
                        REtraning.Date = item.TrainingDate;
                        REtraning.MemberId = item.MemberId;
                        REtraning.TimeSlot = item.TrainingTimeSlot;
                        REtraning.EmployeeName = uow.DbContext.Employees.Where(x => x.EmployeeId == item.EmployeeId).Select(x => x.FirstName + " " + x.LastName).FirstOrDefault();
                        REtraning.MemberName = uow.DbContext.MemberShips.Where(x => x.MemberId == item.MemberId).Select(x => x.FirstName + " " + x.LastName).FirstOrDefault();
                        REtraning.Status = item.RequestStatus;
                        TrainingList.Add(REtraning);
                    }
                    webResponce = new WebResponce()
                    {
                        Code = 1,
                        Message = "Success",
                        Data = TrainingList
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
