using DataLayer;
using ServiceLayer.Email;
using ServiceLayer.Password;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ServiceLayer
{
    public class LogInService
    {
        private readonly UnitOfWork uow;
        WebResponce webResponce = null;
        private readonly IMailService mailService;

        public LogInService(UnitOfWork uow, IMailService mailService)
        {
            this.uow = uow;
            this.mailService = mailService;
        }

        public WebResponce ListLogInInfo(Employee employee)
        {
            try
            {
                var Empl = uow.DbContext.Employees.Where(x => x.Email == employee.Email.Trim()).FirstOrDefault();
                if (Empl != null)
                {
                    if (Empl.Active)
                    {
                        DateTime MoriningIntime = DateTime.Parse(Empl.MorningInTime);
                        DateTime MoriningOutTime = DateTime.Parse(Empl.MorningOutTime);
                        DateTime EveningIntime = DateTime.Parse(Empl.EveningInTime);
                        DateTime EveningOutTime = DateTime.Parse(Empl.EveningOutTime);

                        if ((MoriningIntime <= GetDateTimeByLocalZone.GetDateTime() && MoriningOutTime >= GetDateTimeByLocalZone.GetDateTime()) || (EveningIntime <= GetDateTimeByLocalZone.GetDateTime() && EveningOutTime >= GetDateTimeByLocalZone.GetDateTime())) {
                            if (string.Compare(Crypto.Hash(employee.Password.Trim()), Empl.Password) == 0)
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
                                    Message = "Incorrect Password",
                                };
                            }
                        }
                        else
                        {
                            webResponce = new WebResponce()
                            {
                                Code = 0,
                                Message = "You can not Access right now"
                            };
                        }

                    }
                    else {
                        webResponce = new WebResponce()
                        {
                            Code = 0,
                            Message = "Not Active Employee"
                        };
                    }
                    
                }
                else
                {
                    webResponce = new WebResponce()
                    {
                        Code = 0,
                        Message = "UserName Doesn't Exit"
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

        public WebResponce ConfirmPassword(Employee employee)
        {
            try
            {
                var Empl = uow.DbContext.Employees.Where(x => x.EmployeeId == employee.EmployeeId.Trim()).FirstOrDefault();
                if (Empl != null)
                {
                    if (string.Compare(Crypto.Hash(employee.Password.Trim()), Empl.Password) == 0)
                    {
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
                            Message = "Invalid",
                        };
                    }
                }
                else
                {
                    webResponce = new WebResponce()
                    {
                        Code = 0,
                        Message = "Invalid"
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

        public WebResponce UpdatePassword(Employee employee)
        {
            try
            {
                var Empl = uow.DbContext.Employees.Where(x => x.EmployeeId == employee.EmployeeId.Trim()).FirstOrDefault();
                if (Empl != null)
                {
                    Empl.Password = Crypto.Hash(employee.Password.Trim());
                    Empl.IsFirstTime = false;
                    Empl.ModifiedDate = GetDateTimeByLocalZone.GetDateTime();
                    Empl.ModifiedBy = employee.ModifiedBy;
                    uow.EmployeeRepository.Update(Empl);
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
                        Message = "Invalid"
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

        public WebResponce RequestNewPassword(Employee employee)
        {
            try
            {
                var Empl = uow.DbContext.Employees.Where(x => x.Email == employee.Email.Trim()).FirstOrDefault();
                if (Empl != null)
                {
                    if (Empl.Active)
                    {
                        PasswordGenerate password = new();
                        var EmpPwd = password.Generate();

                        Empl.Password = Crypto.Hash(EmpPwd);
                        Empl.IsFirstTime = true;
                        Empl.ModifiedDate = GetDateTimeByLocalZone.GetDateTime();
                        uow.EmployeeRepository.Update(Empl);
                        uow.Save();

                        var request = new MailRequest();
                        request.ToEmail = employee.Email;
                        request.Subject = "Request New Password";

                        StringBuilder body = new StringBuilder();

                        body.AppendLine("<p style='line - height: 18px; font - family: verdana; font - size: 12px;'>Dear " + employee.FirstName + ",</p>");
                        body.AppendLine("<p style='line - height: 18px; font - family: verdana; font - size: 12px;'>We Successufully Reset Your Password.</p>");
                        body.AppendLine("<p style='line - height: 18px; font - family: verdana; font - size: 12px;'>Website Url: https://jkfitness.lk/ </p>");
                        body.AppendLine("<p style='line - height: 18px; font - family: verdana; font - size: 12px;'>Username: " + employee.Email + "</p>");
                        body.AppendLine("<p style='line - height: 18px; font - family: verdana; font - size: 12px;'>New Password: " + EmpPwd + "</p>");
                        body.AppendLine("<p style='line - height: 18px; font - family: verdana; font - size: 12px;'>Regards,<br /> JK Fitness group </ p > ");

                        request.Body = body.ToString();
                        mailService.SendEmailAsync(request);

                        webResponce = new WebResponce()
                        {
                            Code = 1,
                            Message = "Success",
                            Data= Empl
                        };
                    }
                    else
                    {
                        webResponce = new WebResponce()
                        {
                            Code = 0,
                            Message = "Not Active Employee"
                        };
                    }

                }
                else
                {
                    webResponce = new WebResponce()
                    {
                        Code = 0,
                        Message = "UserName Doesn't Exit"
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
