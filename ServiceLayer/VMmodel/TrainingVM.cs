﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ServiceLayer.VMmodel
{
    public class TrainingVM
    {
        public string TimeSlot { get; set; }
        public int MemberId { get; set; }
        public string MemberName { get; set; }
        public string Status { get; set; }
        public DateTime Date { get; set; }
        public string Trainer { get; set; }
        public string EmployeeId { get; set; }
        public int Month { get; set; }
    }
}
