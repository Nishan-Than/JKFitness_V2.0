using DataLayer.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ServiceLayer.VMmodel
{
    public class NotificationVM
    {
        public List<MemberShip> PackageExpirationThisMonth { get; set; }
        public List<MemberShip> PackageExpirationNextMonth { get; set; }
        public List<MemberShip> PackageExpirationLastMonth { get; set; }
        public List<MemberShip> MemberShipExpirationThisMonth { get; set; }
        public List<MemberShip> MemberShipExpirationNextMonth { get; set; }
        public List<MemberShip> MemberShipExpirationLastMonth { get; set; }
    }
}
