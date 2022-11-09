using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataLayer.Models
{
    public class SoldProducts
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int SoldId { get; set; }
        public int ProductId { get; set; }
        public string ProductName { get; set; }
        public string Branch { get; set; }
        public int Quantity { get; set; }
        public decimal PricePerProduct { get; set; }
        public decimal SoldPricePerProduct { get; set; }
        public decimal TotalSoldPrice { get; set; }
        public DateTime SoldDate { get; set; }
        public string CreatedBy { get; set; }
        public DateTime CreatedDate { get; set; }
        public string ModifiedBy { get; set; }
        public DateTime ModifiedDate { get; set; }
    }
}
