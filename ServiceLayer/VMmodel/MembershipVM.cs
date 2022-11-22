using DataLayer.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ServiceLayer.VMmodel
{
    public class MembershipVM
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string PackageType { get; set; }
        public decimal PackageAmount { get; set; }
        public bool IsPartialPayment { get; set; }
        public bool IsAdvancePayment { get; set; }
        public string Branch { get; set; }
        public string BranchId { get; set; }
        public int PackageId { get; set; }
        public DateTime PackageExpirationDate { get; set; }

        public List<PartialPayments> PartialPayments { get; set; }
        public MembershipPayments PaymentDetails { get; set; }
    }

    public class PaymentYears
    {
        public int StartYear { get; set; }
        public int EndYear { get; set; }
    }

    public class TrainingYears
    {
        public int StartYear { get; set; }
        public int EndYear { get; set; }
    }

    public class EmployeeSalaryVM
    {
        public string EmployeeId { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Branch { get; set; }
        public string BranchCode { get; set; }
        public decimal FixedSalary { get; set; }
        public decimal TotalAdvanceAmount { get; set; }
        public List<AdvancePaymentStaff> AdvancePaymentStaffs { get; set; }
        public decimal CommishanAmount { get; set; }
        public decimal PTAmount { get; set; }
        public decimal SupplimentCommission { get; set; }
        public decimal TotalAmount { get; set; }
        public DateTime SalaryDate { get; set; }
        public List<SalaryPaymentStaff> salaryPaymentStaffs { get; set; }

    }
}
