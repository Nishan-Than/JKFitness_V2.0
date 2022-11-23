using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace DataLayer
{
    public class Employee
    {
        [Key]
        [Required]
        public string EmployeeId { get; set; }
        public string Salutation { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string HouseNo { get; set; }
        public string Street { get; set; }
        public int District { get; set; }
        public int Province { get; set; }
        public byte[] Image { get; set; }
        public string Email { get; set; }
        public string PhoneNo { get; set; }
        public string Branch { get; set; }
        public string UserType { get; set; }
        public bool Active { get; set; }
        public string MorningInTime { get; set; }
        public string MorningOutTime { get; set; }
        public string EveningInTime { get; set; }
        public string EveningOutTime { get; set; }
        public string CreatedBy { get; set; }
        public DateTime CreatedDate { get; set; }
        public string ModifiedBy { get; set; }
        public DateTime ModifiedDate { get; set; }
        public bool IsFirstTime { get; set; }
        public string Password { get; set; }
        public decimal Salary { get; set; }
        public bool IsTrainer { get; set; }

    }
}
