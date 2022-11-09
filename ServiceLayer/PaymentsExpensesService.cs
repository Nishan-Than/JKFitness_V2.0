using DataLayer;
using DataLayer.Models;
using ServiceLayer.Email;
using ServiceLayer.VMmodel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ServiceLayer
{
    public class PaymentsExpensesService
    {
        private readonly UnitOfWork uow;
        private readonly IMailService mailService;
        WebResponce webResponce = null;
        public PaymentsExpensesService(UnitOfWork uow, IMailService mailService)
        {
            this.uow = uow;
            this.mailService = mailService;
        }

        public WebResponce GetMembershipDetails(int memberId)
        {
            try
            {
                var memberdetails = uow.MembershipRepository.GetByID(memberId);
                var AdvancePayment = uow.MembershipPaymentsRepository.GetAll().Where(x => x.MemberId == memberId & x.IsAdvancePay == true).ToList();
                if (memberdetails != null)
                {
                    if (!memberdetails.IsFreeMembership && AdvancePayment.Count == 0)
                    {
                        var membershipVM = new MembershipVM();
                        //if (memberdetails.PackageExpirationDate.Date <= GetDateTimeByLocalZone.GetDateTime().Date)
                        if (memberdetails.PackageExpirationDate.Date >= GetDateTimeByLocalZone.GetDateTime().Date)
                        {
                            membershipVM.IsAdvancePayment = true;
                        }

                        membershipVM.FirstName = memberdetails.FirstName;
                        membershipVM.LastName = memberdetails.LastName;
                        membershipVM.PackageAmount = memberdetails.Payment;
                        membershipVM.PackageId = memberdetails.MemberPackage;
                        membershipVM.PackageExpirationDate = memberdetails.PackageExpirationDate.Date;
                        membershipVM.PackageType = uow.MembershipTypesRepository.GetByID(memberdetails.MemberPackage).MembershipName;
                        membershipVM.Branch = uow.BranchRepository.GetAll().Where(x => x.BranchCode == memberdetails.Branch).Select(x => x.BranchName).FirstOrDefault();
                        membershipVM.BranchId = memberdetails.Branch;
                        var Paydetails = uow.MembershipPaymentsRepository.GetAll().Where(x => x.MemberId == memberId & x.IsPartialPay == true).LastOrDefault();

                        if (Paydetails != null)
                        {
                            var partialPayments = uow.PartialPaymentsRepository.GetAll().Where(x => x.PaymentId == Paydetails.Id).OrderBy(x => x.PaymentDate).ToList();
                            if (memberdetails.PackageExpirationDate <= GetDateTimeByLocalZone.GetDateTime().Date && memberdetails.MembershipExpirationDate >= GetDateTimeByLocalZone.GetDateTime().Date)
                                membershipVM.IsPartialPayment = Paydetails.IsPartialPay;
                            else if (partialPayments.Count > 0)
                            {
                                membershipVM.IsPartialPayment = partialPayments[0].PaymentDate.AddMonths(1) >= GetDateTimeByLocalZone.GetDateTime().Date ? Paydetails.IsPartialPay : false;
                            }
                            else
                                membershipVM.IsPartialPayment = false;
                        }
                        else
                            membershipVM.IsPartialPayment = false;

                        if (membershipVM.IsPartialPayment == true)
                        {
                            membershipVM.IsPartialPayment = true;
                            membershipVM.PaymentDetails = Paydetails;
                            membershipVM.PartialPayments = uow.PartialPaymentsRepository.GetAll().Where(x => x.PaymentId == Paydetails.Id).ToList();
                        }



                        webResponce = new WebResponce()
                        {
                            Code = 1,
                            Message = "Success",
                            Data = membershipVM
                        };
                    }
                    else if (AdvancePayment.Count > 0) {
                        webResponce = new WebResponce()
                        {
                            Code = 0,
                            Message = "Already Done Advance Payment"
                        };
                    }
                    else
                    {
                        webResponce = new WebResponce()
                        {
                            Code = 0,
                            Message = "Free MemberShip Package Holder"
                        };
                    }
                }
                else
                {
                    webResponce = new WebResponce()
                    {
                        Code = 0,
                        Message = "Invalid membership ID"
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

        public WebResponce SaveMemberShipPayment(MembershipPayments payment)
        {
            try
            {
                payment.PaymentDate = payment.PaymentDate.Date;
                payment.Branch = uow.MembershipRepository.GetByID(payment.MemberId).Branch;
                payment.CreatedDate = GetDateTimeByLocalZone.GetDateTime();
                uow.MembershipPaymentsRepository.Insert(payment);
                uow.Save();
                var memberdetails = uow.MembershipRepository.GetByID(payment.MemberId);
                var PackageDetails = uow.MembershipTypesRepository.GetByID(payment.PackageType);
                memberdetails.MemberPackage = payment.PackageType;
                memberdetails.Payment = payment.PackageAmount;

                if (payment.BalanceAmount == 0 && !payment.IsAdvancePay)
                {                                     
                    if (payment.PaymentDate > memberdetails.MembershipExpirationDate && !payment.IsPastPay)
                        memberdetails.PackageExpirationDate = payment.PaymentDate.AddMonths(PackageDetails.MonthsPerPackage).Date;
                    else
                        memberdetails.PackageExpirationDate = memberdetails.PackageExpirationDate.AddMonths(PackageDetails.MonthsPerPackage).Date;

                    memberdetails.MembershipExpirationDate = memberdetails.PackageExpirationDate.AddMonths(1).Date;

                    if (memberdetails.PackageExpirationDate > GetDateTimeByLocalZone.GetDateTime().Date)
                        memberdetails.Active = true;                   

                    var request = new MailRequest();
                    request.ToEmail = memberdetails.Email;
                    request.Subject = "Membership Package Payment Statement";

                    StringBuilder body = new StringBuilder();

                    body.AppendLine("<p style='line - height: 18px; font - family: verdana; font - size: 12px;'>Dear " + memberdetails.FirstName + ",</p>");
                    body.AppendLine("<p style='line - height: 18px; font - family: verdana; font - size: 12px;'>Your paid the full amount of the package and your packge renewed successfully!.</p>");

                    body.AppendLine("<p style='line - height: 18px; font - family: verdana; font - size: 12px;'>Your Fitness Package:" + PackageDetails.MembershipName + "</p>Package Amount: &nbsp;" + PackageDetails.MembershipAmount + "<br /><br />");
                    body.AppendLine("<p style='line - height: 18px; font - family: verdana; font - size: 12px;'>Package ExpirationDate: <strong> " + memberdetails.PackageExpirationDate.ToString("dd.MM.yyyy") + "</strong></p>");
                    body.AppendLine("<p style='line - height: 18px; font - family: verdana; font - size: 12px;'>Regards,<br /> JK Fitness group<br />0772395819 <br />jkfitness23@gmail.com</ p > ");

                    request.Body = body.ToString();
                    mailService.SendEmailAsync(request);
                }
                else if (payment.IsPartialPay)
                {
                    if(payment.PaymentDate > memberdetails.MembershipExpirationDate)
                    {
                        memberdetails.PackageExpirationDate = payment.PaymentDate.Date;
                        memberdetails.MembershipExpirationDate = memberdetails.PackageExpirationDate.AddMonths(1).Date;
                    }

                }
                else {
                    var request = new MailRequest();
                    request.ToEmail = memberdetails.Email;
                    request.Subject = "Membership Package Advance Payment Statement";

                    StringBuilder body = new StringBuilder();

                    body.AppendLine("<p style='line - height: 18px; font - family: verdana; font - size: 12px;'>Dear " + memberdetails.FirstName + ",</p>");
                    body.AppendLine("<p style='line - height: 18px; font - family: verdana; font - size: 12px;'>Your paid the full amount of the package and your packge will be renewed immediately after the expiration of the existing package!.</p>");

                    body.AppendLine("<p style='line - height: 18px; font - family: verdana; font - size: 12px;'>Your Fitness Package:" + PackageDetails.MembershipName + "</p>Package Amount: &nbsp;" + PackageDetails.MembershipAmount + "<br /><br />");
                    body.AppendLine("<p style='line - height: 18px; font - family: verdana; font - size: 12px;'>Current Package ExpirationDate: <strong> " + memberdetails.PackageExpirationDate.ToString("dd.MM.yyyy") + "</strong></p>");
                    body.AppendLine("<p style='line - height: 18px; font - family: verdana; font - size: 12px;'>Regards,<br /> JK Fitness group<br />0772395819 <br />jkfitness23@gmail.com</ p > ");

                    request.Body = body.ToString();
                    mailService.SendEmailAsync(request);
                }

                uow.MembershipRepository.Update(memberdetails);
                uow.Save();

                webResponce = new WebResponce()
                {
                    Code = 1,
                    Message = "Success",
                    Data = payment
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
        public WebResponce SaveMemberShipPartialPayment(PartialPayments payment)
        {

            try
            {
                payment.PaymentDate = payment.PaymentDate.Date;
                payment.CreatedDate = GetDateTimeByLocalZone.GetDateTime();
                uow.PartialPaymentsRepository.Insert(payment);
                uow.Save();
                webResponce = new WebResponce()
                {
                    Code = 1,
                    Message = "Success",
                    Data = payment
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
        public WebResponce UpdateMemberShipPayment(MembershipPayments payment)
        {

            try
            {
                payment.PaymentDate = payment.PaymentDate.Date;
                payment.ModifiedDate = GetDateTimeByLocalZone.GetDateTime();
                uow.MembershipPaymentsRepository.Update(payment);
                uow.Save();

                if (payment.BalanceAmount == 0)
                {
                    var memberdetails = uow.MembershipRepository.GetByID(payment.MemberId);
                    var PackageDetails = uow.MembershipTypesRepository.GetByID(payment.PackageType);

                    memberdetails.MemberPackage = payment.PackageType != memberdetails.MemberPackage ? payment.PackageType : memberdetails.MemberPackage;

                    memberdetails.PackageExpirationDate = memberdetails.PackageExpirationDate.AddMonths(PackageDetails.MonthsPerPackage).Date;
                    memberdetails.MembershipExpirationDate = memberdetails.PackageExpirationDate.AddMonths(1).Date;

                    if (memberdetails.PackageExpirationDate > GetDateTimeByLocalZone.GetDateTime().Date)
                        memberdetails.Active = true;

                    uow.MembershipRepository.Update(memberdetails);
                    uow.Save();

                    var request = new MailRequest();
                    request.ToEmail = memberdetails.Email;
                    request.Subject = "Membership Package Payment Statement";

                    StringBuilder body = new StringBuilder();

                    body.AppendLine("<p style='line - height: 18px; font - family: verdana; font - size: 12px;'>Dear " + memberdetails.FirstName + ",</p>");
                    body.AppendLine("<p style='line - height: 18px; font - family: verdana; font - size: 12px;'>Your paid the full amount of the package and your packge renewed successfully!.</p>");

                    body.AppendLine("<p style='line - height: 18px; font - family: verdana; font - size: 12px;'>Your Fitness Package: &nbsp;" + PackageDetails.MembershipName + "</p>Package Amount: &nbsp;" + PackageDetails.MembershipAmount + "<br /><br />");
                    body.AppendLine("<p style='line - height: 18px; font - family: verdana; font - size: 12px;'>New Package ExpirationDate: <strong> " + memberdetails.PackageExpirationDate.ToString("dd.MM.yyyy") + "</strong></p>");
                    body.AppendLine("<p style='line - height: 18px; font - family: verdana; font - size: 12px;'>Regards,<br /> JK Fitness group<br />0772395819 <br />jkfitness23@gmail.com</ p > ");

                    request.Body = body.ToString();
                    mailService.SendEmailAsync(request);
                }

                webResponce = new WebResponce()
                {
                    Code = 1,
                    Message = "Success",
                    Data = payment
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
        public WebResponce DeleteMemberShipPartialPayment(MembershipPayments paymentDetail)
        {

            try
            {
                paymentDetail.IsPartialPay = false;
                uow.MembershipPaymentsRepository.Update(paymentDetail);

                var partialPaymentsList = uow.PartialPaymentsRepository.GetAll().Where(x => x.PaymentId == paymentDetail.Id).ToList();

                if (partialPaymentsList.Count > 0)
                    uow.PartialPaymentsRepository.DeleteRange(partialPaymentsList);

                uow.Save();
                webResponce = new WebResponce()
                {
                    Code = 1,
                    Message = "Success",
                    Data = paymentDetail
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

        public WebResponce LoadMembershipPayments(string branch, int year, int month)
        {
            try
            {
                var paymentDetails = uow.MembershipPaymentsRepository.GetAll().Where(x => x.Branch == branch && x.PaymentDate.Year == year && x.PaymentDate.Month == month).OrderBy(x => x.PaymentDate).ToList();

                var membershipVMList = new List<MembershipVM>();

                foreach (var paymentDetail in paymentDetails)
                {
                    var membershipVM = new MembershipVM();

                    var memberdetails = uow.MembershipRepository.GetByID(paymentDetail.MemberId);

                    membershipVM.FirstName = memberdetails.FirstName;
                    membershipVM.LastName = memberdetails.LastName;
                    membershipVM.PackageAmount = memberdetails.Payment;
                    membershipVM.PackageType = uow.MembershipTypesRepository.GetByID(memberdetails.MemberPackage).MembershipName;
                    membershipVM.Branch = paymentDetail.Branch;

                    membershipVM.PaymentDetails = paymentDetail;
                    membershipVM.IsPartialPayment = paymentDetail.IsPartialPay;
                    membershipVM.IsAdvancePayment = paymentDetail.IsAdvancePay;

                    if (membershipVM.IsPartialPayment == true)
                    {
                        membershipVM.PartialPayments = uow.PartialPaymentsRepository.GetAll().Where(x => x.PaymentId == paymentDetail.Id).ToList();
                    }

                    membershipVMList.Add(membershipVM);
                }
                webResponce = new WebResponce()
                {
                    Code = 1,
                    Message = "Success",
                    Data = membershipVMList
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

        public WebResponce DeletePartialPaymentById(int id)
        {
            try
            {
                var partialPayment = uow.PartialPaymentsRepository.GetByID(id);
                var paymentDetails = uow.MembershipPaymentsRepository.GetByID(partialPayment.PaymentId);

                paymentDetails.BalanceAmount = paymentDetails.BalanceAmount + partialPayment.PaidAmount;

                uow.MembershipPaymentsRepository.Update(paymentDetails);
                uow.PartialPaymentsRepository.Delete(partialPayment);
                uow.Save();

                webResponce = new WebResponce()
                {
                    Code = 1,
                    Message = "Success"
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

        public WebResponce DeleteMembershipPaymentById(int id)
        {
            try
            {
                var paymentDetails = uow.MembershipPaymentsRepository.GetByID(id);

                if (paymentDetails.IsPartialPay == true)
                {
                    var partialPayments = uow.PartialPaymentsRepository.GetAll().Where(x => x.PaymentId == id).ToList();

                    uow.PartialPaymentsRepository.DeleteRange(partialPayments);
                }
                else
                {
                    var memberdetails = uow.MembershipRepository.GetByID(paymentDetails.MemberId);
                    var PackageDetails = uow.MembershipTypesRepository.GetByID(memberdetails.MemberPackage);

                    memberdetails.PackageExpirationDate = memberdetails.PackageExpirationDate.AddMonths(-PackageDetails.MonthsPerPackage).Date;
                    memberdetails.MembershipExpirationDate = memberdetails.PackageExpirationDate.AddMonths(1).Date;
                    memberdetails.Active = false;

                    uow.MembershipRepository.Update(memberdetails);
                }

                uow.MembershipPaymentsRepository.Delete(paymentDetails);
                uow.Save();

                webResponce = new WebResponce()
                {
                    Code = 1,
                    Message = "Success"
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

        public WebResponce GetStartandEndYear()
        {
            try
            {
                var paymentDetails = uow.MembershipPaymentsRepository.GetAll().OrderBy(x => x.PaymentDate).ToList();
                var PaymentYears = new PaymentYears();

                if (paymentDetails.Count > 0)
                {
                    PaymentYears.StartYear = paymentDetails.First().PaymentDate.Year;
                    PaymentYears.EndYear = paymentDetails.Last().PaymentDate.Year;
                }
                else
                {
                    PaymentYears.StartYear = GetDateTimeByLocalZone.GetDateTime().Year;
                    PaymentYears.EndYear = GetDateTimeByLocalZone.GetDateTime().Year;
                }

                webResponce = new WebResponce()
                {
                    Code = 1,
                    Message = "Success",
                    Data = PaymentYears
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


        public WebResponce GetEmployeeDetails(string employeeid, int Month)
        {
            try
            {
                var employeedetails = uow.EmployeeRepository.GetByID(employeeid);
                if (employeedetails != null)
                {
                    var salaryDetails = uow.SalaryPaymentStaffRepository.GetAll().Where(x => x.EmployeeId == employeeid && x.SalaryDate.Month == Month && x.SalaryDate.Year == DateTime.Now.Year).FirstOrDefault();
                    if (salaryDetails == null)
                    {
                        var employeeVM = new EmployeeSalaryVM();

                        employeeVM.FirstName = employeedetails.FirstName;
                        employeeVM.LastName = employeedetails.LastName;
                        employeeVM.FixedSalary = employeedetails.Salary;
                        employeeVM.BranchCode = employeedetails.Branch;
                        employeeVM.Branch = uow.BranchRepository.GetAll().Where(x => x.BranchCode == employeedetails.Branch).Select(x => x.BranchName).FirstOrDefault();

                        var details = uow.AdvancePaymentStaffRepository.GetAll().Where(x => x.EmployeeId == employeeid & x.PaymentDate.Month == Month).ToList();

                        if (details != null)
                        {
                            employeeVM.AdvancePaymentStaffs = details;
                            employeeVM.TotalAdvanceAmount = details.Sum(d => d.AdvancePayment);
                        }

                        var SalaryPaymentdetails = uow.SalaryPaymentStaffRepository.GetAll().Where(x => x.EmployeeId == employeeid & x.SalaryDate.Month == Month).FirstOrDefault();
                        if (SalaryPaymentdetails != null)
                        {
                            employeeVM.CommishanAmount = SalaryPaymentdetails.CommishanAmount;
                            employeeVM.PTAmount = SalaryPaymentdetails.PTAmount;
                            employeeVM.SupplimentCommission = SalaryPaymentdetails.SupplimentCommission;
                            employeeVM.TotalAmount = SalaryPaymentdetails.TotalAmount;
                            employeeVM.SalaryDate = SalaryPaymentdetails.SalaryDate;
                        }
                        else
                        {
                            employeeVM.TotalAmount = employeeVM.FixedSalary - employeeVM.TotalAdvanceAmount;
                        }

                        webResponce = new WebResponce()
                        {
                            Code = 1,
                            Message = "Success",
                            Data = employeeVM
                        };
                    }
                    else
                    {
                        webResponce = new WebResponce()
                        {
                            Code = 0,
                            Message = "Salary is already paid for this staff on " + salaryDetails.SalaryDate.ToShortDateString()
                        };
                    }
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

        public WebResponce SaveAdvanceSalaryPayment(AdvancePaymentStaff advancePaymentStaff)
        {
            try
            {
                advancePaymentStaff.CreatedDate = GetDateTimeByLocalZone.GetDateTime();
                uow.AdvancePaymentStaffRepository.Insert(advancePaymentStaff);
                uow.Save();

                webResponce = new WebResponce()
                {
                    Code = 1,
                    Message = "Success",
                    Data = advancePaymentStaff
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

        public WebResponce LoadAdvanceSalaryPayment(string empId)
        {
            try
            {
                var paymentStaffs = new List<AdvancePaymentStaff>();

                if (empId == null)
                    paymentStaffs = uow.AdvancePaymentStaffRepository.GetAll().ToList();
                else
                    paymentStaffs = uow.AdvancePaymentStaffRepository.GetAll().Where(x => x.EmployeeId == empId).ToList();

                if (paymentStaffs != null && paymentStaffs.Count > 0)
                {
                    webResponce = new WebResponce()
                    {
                        Code = 1,
                        Message = "Success",
                        Data = paymentStaffs
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

        public WebResponce UpdateAdvanceSalaryPayment(AdvancePaymentStaff advancePaymentStaff)
        {

            try
            {
                advancePaymentStaff.PaymentDate = advancePaymentStaff.PaymentDate.Date;
                advancePaymentStaff.ModifiedDate = GetDateTimeByLocalZone.GetDateTime();
                uow.AdvancePaymentStaffRepository.Update(advancePaymentStaff);
                uow.Save();

                webResponce = new WebResponce()
                {
                    Code = 1,
                    Message = "Success",
                    Data = advancePaymentStaff
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

        public WebResponce DeleteAdvanceSalaryPayment(int Id)
        {
            try
            {
                var advancesalary = uow.DbContext.AdvancePaymentStaff.Where(x => x.Id == Id).FirstOrDefault();
                if (advancesalary != null)
                {
                    uow.AdvancePaymentStaffRepository.Delete(advancesalary);
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

        public WebResponce SaveStaffSalaryPayment(SalaryPaymentStaff salaryPaymentStaff)
        {

            try
            {
                salaryPaymentStaff.SalaryDate = salaryPaymentStaff.SalaryDate.Date;
                salaryPaymentStaff.CreatedDate = GetDateTimeByLocalZone.GetDateTime();
                uow.SalaryPaymentStaffRepository.Insert(salaryPaymentStaff);
                uow.Save();
                webResponce = new WebResponce()
                {
                    Code = 1,
                    Message = "Success",
                    Data = salaryPaymentStaff
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

        public WebResponce LoadStaffPayments(int month)
        {
            try
            {
                var paymentDetails = uow.SalaryPaymentStaffRepository.GetAll().Where(x => x.SalaryDate.Month == month).ToList();

                var employeeSalaryVM = new List<EmployeeSalaryVM>();

                foreach (var paymentDetail in paymentDetails)
                {
                    var employeeVM = new EmployeeSalaryVM();

                    var EmployeeDetails = uow.EmployeeRepository.GetByID(paymentDetail.EmployeeId);
                    employeeVM.EmployeeId = paymentDetail.EmployeeId;
                    employeeVM.FirstName = paymentDetail.EmployeeName;
                    employeeVM.FixedSalary = paymentDetail.FixedSalary;
                    employeeVM.Branch = paymentDetail.Branch;
                    employeeVM.CommishanAmount = paymentDetail.CommishanAmount;
                    employeeVM.SalaryDate = paymentDetail.SalaryDate;
                    var Advancepayment = uow.AdvancePaymentStaffRepository.GetAll().Where(x => x.PaymentDate.Month == month && x.EmployeeId == paymentDetail.EmployeeId).ToList(); ;

                    if (Advancepayment != null)
                    {
                        employeeVM.AdvancePaymentStaffs = Advancepayment;
                    }

                    var SalaryPayment = uow.SalaryPaymentStaffRepository.GetAll().Where(x => x.EmployeeId == paymentDetail.EmployeeId && x.SalaryDate.Month == month).ToList();
                    if (SalaryPayment != null)
                    {
                        employeeVM.salaryPaymentStaffs = SalaryPayment;
                    }
                    employeeSalaryVM.Add(employeeVM);
                }
                webResponce = new WebResponce()
                {
                    Code = 1,
                    Message = "Success",
                    Data = employeeSalaryVM
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

        public WebResponce DeleteSalaryPayment(int Id)
        {
            try
            {
                var salarypayment = uow.DbContext.SalaryPaymentStaff.Where(x => x.Id == Id).FirstOrDefault();
                if (salarypayment != null)
                {
                    uow.SalaryPaymentStaffRepository.Delete(salarypayment);
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

        public WebResponce GetDetailsforPersonalTraining(int memberId, string EmpId)
        {
            try
            {
                var memberdetails = uow.MembershipRepository.GetByID(memberId);

                if (memberdetails != null)
                {
                    var emp = uow.EmployeeRepository.GetByID(EmpId);
                    var personalTraining = new PersonalTrainingVM();

                    var employee = uow.EmployeeRepository.GetAll().Where(x => x.Branch == memberdetails.Branch).ToList();

                    employee = emp.UserType == "Admin" || emp.UserType == "TemporaryStaff" ? employee : employee.Where(x => x.EmployeeId == EmpId).ToList();
                   
                    if (employee!=null)
                    {
                        personalTraining.employee = employee;
                    }
                    personalTraining.Branch = memberdetails.Branch;


                    webResponce = new WebResponce()
                    {
                        Code = 1,
                        Message = "Success",
                        Data = personalTraining
                    };

                }
                else
                {
                    webResponce = new WebResponce()
                    {
                        Code = 0,
                        Message = "Invalid membership ID"
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

        public WebResponce SavePersonalTraining(PersonalTraining personalTraining)
        {
            try
            {
                personalTraining.CreatedDate = GetDateTimeByLocalZone.GetDateTime(); 
                uow.PersonalTrainingRepository.Insert(personalTraining);
                uow.Save();
                webResponce = new WebResponce()
                {
                    Code = 1,
                    Message = "Success",
                    Data = personalTraining
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

        public WebResponce LoadPersonalTraining(string branch, int year, int month)
        {
            try
            {
                List<PersonalTraining> personalTrainings = uow.DbContext.PersonalTrainings.Where(x => x.Branch == branch && x.TrainingDate.Year==year && x.TrainingDate.Month== month).OrderBy(x=>x.TrainingDate).ToList();

                if (personalTrainings != null && personalTrainings.Count>0)
                {
                   webResponce = new WebResponce()
                    {
                        Code = 1,
                        Message = "Success",
                        Data = personalTrainings
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

        public WebResponce DeletePersonalTraining(int Id)
        {
            try
            {
                var personalTraining = uow.DbContext.PersonalTrainings.Where(x => x.Id == Id).FirstOrDefault();
                if (personalTraining != null)
                {
                    uow.PersonalTrainingRepository.Delete(personalTraining);
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

    }
}
