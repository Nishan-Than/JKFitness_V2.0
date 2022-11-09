using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataLayer.Models
{
    public class MenuRights
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        public string MenuName { get; set; }
        public int Admin { get; set; }
        public int Staff { get; set; }
        public int ParentId { get; set; }
        public float SortOrder { get; set; }
        public int TemporaryStaff { get; set; }
    }
}
