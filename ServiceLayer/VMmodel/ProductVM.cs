using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ServiceLayer.VMmodel
{
    public class ProductVM
    {
        public string Product { get; set; }
        public IFormFile file { get; set; }
    }
}
