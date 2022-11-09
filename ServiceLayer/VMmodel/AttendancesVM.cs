using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ServiceLayer.VMmodel
{
    public class AttendancesVM
    {
        public int MemberId { get; set; }
        public string Branch { get; set; }
        public DateTime AttendanceDate { get; set; }
    }
}
