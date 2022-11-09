using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ServiceLayer.VMmodel
{
    public class AccountsVM
    {
        public string SummaryName { get; set; }
        public string SummaryId { get; set; }
        public bool isIncome { get; set; }
        public List<SummaryByBranch> SummarybyBranch { get; set; }
        public decimal TotalIncome { get; set; }
        public decimal TotalExpense { get; set; }

    }

    public class SummaryByBranch
    {
        public string Branch { get; set; }
        public decimal TotalByBranch { get; set; }

        public List<TotalbyMonth> SummarybyMonth { get; set; }
    }
    public class TotalbyMonth
    {
        public string Month { get; set; }
        public decimal Amount { get; set; }
    }
}
