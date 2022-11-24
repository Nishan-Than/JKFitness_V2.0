using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataLayer.Models
{
    public class MemberShip
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        public int MemberId { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Gender { get; set; }
        public string NIC { get; set; }
        public string HouseNo { get; set; }
        public string Street { get; set; }
        public int District { get; set; }
        public int Province { get; set; }
        public string ContactNo { get; set; }
        public DateTime DateofBirth { get; set; }
        public string Email { get; set; }
        public string Branch { get; set; }
        public int Age { get; set; }
        public decimal Height { get; set; }
        public decimal Weight { get; set; }
        public decimal BMI { get; set; }
        public int MemberPackage { get; set; }
        public decimal Payment { get; set; }
        public string EmergencyContactNo { get; set; }
        public string RelationShip { get; set; }
        public string IntroducedBy { get; set; }
        public bool Smoking { get; set; }
        public bool Discomfort { get; set; }
        public bool Cholesterol { get; set; }
        public bool Herina { get; set; }
        public bool Diabets { get; set; }
        public bool Pain { get; set; }
        public bool Complaint { get; set; }
        public bool Incorrigible { get; set; }
        public bool Doctors { get; set; }
        public bool Pregnant { get; set; }
        public bool Aliments { get; set; }
        public bool Surgery { get; set; }
        public bool Pressure { get; set; }
        public bool Trace { get; set; }
        public bool Musele { get; set; }
        public bool Fat { get; set; }
        public bool Body { get; set; }
        public bool Fitness { get; set; }
        public bool Athletics { get; set; }
        public bool Active { get; set; }
        public DateTime JoinDate { get; set; }
        public string CreatedBy { get; set; }
        public DateTime CreatedDate { get; set; }
        public string ModifiedBy { get; set; }
        public DateTime ModifiedDate { get; set; }
        public DateTime PackageExpirationDate { get; set; }
        public bool IsFreeMembership { get; set; }
        public DateTime MembershipExpirationDate { get; set; }
        public bool NoNic { get; set; }
        public bool IsNewPartialPay { get; set; }
        public bool IsFirstTime { get; set; }
        public string Password { get; set; }
    }

}
