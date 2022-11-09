using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataLayer.Models
{
    public class SalaryPaymentStaff
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        public string EmployeeId { get; set; }
        public string EmployeeName { get; set; }
        public string Branch { get; set; }
        public DateTime SalaryDate { get; set; }
        public decimal FixedSalary { get; set; }
        public decimal AdvancePayment { get; set; }
        public decimal CommishanAmount { get; set; }
        public decimal PTAmount { get; set; }
        public decimal SupplimentCommission { get; set; }
        public decimal TotalAmount { get; set; }
        public string CreatedBy { get; set; }
        public DateTime CreatedDate { get; set; }
        public string ModifiedBy { get; set; }
        public DateTime ModifiedDate { get; set; }

    }
}
