using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace DataLayer
{
    public class Branch
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        public string BranchCode { get; set; }
        public string BranchName { get; set; }
        public int MembershipInitialRangeFrom { get;set;}
        public int MembershipInitialRangeTo { get; set; }
        public int MembershipActiveMonthRange { get; set; }
        public string CreatedBy { get; set; }
        public DateTime CreatedDate { get; set; }
        public string ModifiedBy { get; set; }
        public DateTime ModifiedDate { get; set; }
        public bool IsDeleteble { get; set; }
        public bool IsCurrent { get; set; }
    }
}
