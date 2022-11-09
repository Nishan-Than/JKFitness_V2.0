using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataLayer.Models
{
    public class MembershipPayments
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        public int MemberId { get; set; }
        public int PackageType { get; set; }
        public DateTime PaymentDate { get; set; }
        public decimal PackageAmount { get; set; }
        public bool IsPartialPay { get; set; }
        public bool IsAdvancePay { get; set; }
        public decimal BalanceAmount { get; set; }
        public string CreatedBy { get; set; }
        public DateTime CreatedDate { get; set; }
        public string ModifiedBy { get; set; }
        public DateTime ModifiedDate { get; set; }
        public string Branch { get; set; }
        public bool IsPastPay { get; set; }
    }
}
