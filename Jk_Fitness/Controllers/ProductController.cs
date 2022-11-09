using DataLayer.Models;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using ServiceLayer;
using ServiceLayer.Password;
using ServiceLayer.VMmodel;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace Jk_Fitness.Controllers
{
    public class ProductController : Controller
    {
        private readonly ProductService products;
        private readonly SettingsService Setting;
        WebResponce webResponce = null;

        public ProductController(ProductService products, SettingsService Setting)
        {
            this.products = products;
            this.Setting = Setting;
        }
        public IActionResult Index()
        {
            var userType = Request.Cookies["Role"];
            List<int> result1 = Setting.GetUserRightsbyUsertype(userType);
            if (result1.Count() > 0)
            {
                ViewBag.Add = result1[39];
                ViewBag.Edit = result1[40];
                ViewBag.Delete = result1[41];
            }
            return View();
        }

        public IActionResult ProductList()
        {
            return View();
        }

        public IActionResult ViewSoldProducts()
        {
            var userType = Request.Cookies["Role"];
            List<int> result1 = Setting.GetUserRightsbyUsertype(userType);
            if (result1.Count() > 0)
            {
                ViewBag.Delete = result1[60];
            }
            return View();
        }

        [HttpPost]
        public WebResponce SaveProduct(ProductVM files)
        {
            try
            {
                Product product = JsonConvert.DeserializeObject<Product>(files.Product);
                if (files.file != null)
                {
                    using (var ms = new MemoryStream())
                    {
                        files.file.CopyTo(ms);
                        var fileBytes = ms.ToArray();
                        product.ProductImage = fileBytes;
                    }
                }
                product.CreatedBy = Crypto.DecryptString(Request.Cookies["jkfitness.cookie"]);
                webResponce = products.SaveProduct(product);
                return webResponce;
            }
            catch (Exception Ex)
            {
                webResponce = new WebResponce()
                {
                    Code = -1,
                    Message = Ex.Message
                };
                return webResponce;
            }
        }

        [HttpPost]
        public WebResponce UpdateProduct(ProductVM files)
        {
            try
            {
                Product product = JsonConvert.DeserializeObject<Product>(files.Product);
                if (files.file != null)
                {
                    using (var ms = new MemoryStream())
                    {
                        files.file.CopyTo(ms);
                        var fileBytes = ms.ToArray();
                        product.ProductImage = fileBytes;
                    }
                }
                product.ModifiedBy = Crypto.DecryptString(Request.Cookies["jkfitness.cookie"]);
                webResponce = products.UpdateProduct(product);
                return webResponce;
            }
            catch (Exception Ex)
            {
                webResponce = new WebResponce()
                {
                    Code = -1,
                    Message = Ex.Message
                };
                return webResponce;
            }
        }

        [HttpGet]
        public WebResponce GetProductDetails(string BranchId)
        {
            try
            {
                webResponce = products.ListProductDetails(BranchId);
                return webResponce;
            }
            catch (Exception Ex)
            {
                webResponce = new WebResponce()
                {
                    Code = -1,
                    Message = Ex.Message
                };
                return webResponce;
            }
        }

        [HttpPost]
        public WebResponce DeleteProduct([FromBody] Product product)
        {
            try
            {
                webResponce = products.DeleteProduct(product);
                return webResponce;
            }
            catch (Exception Ex)
            {
                webResponce = new WebResponce()
                {
                    Code = -1,
                    Message = Ex.Message
                };
                return webResponce;
            }
        }

        [HttpGet]
        public WebResponce UpdateProductQuantity(SoldProducts soldProducts)
        {
            try
            {
                soldProducts.CreatedBy = Crypto.DecryptString(Request.Cookies["jkfitness.cookie"]);

                webResponce = products.UpdateProductQuantity(soldProducts);
                return webResponce;
            }
            catch (Exception Ex)
            {
                webResponce = new WebResponce()
                {
                    Code = -1,
                    Message = Ex.Message
                };
                return webResponce;
            }
        }

        [HttpPost]
        public WebResponce LoadSoldProductsList(string branch, int year, int month)
        {
            try
            {
                webResponce = products.LoadSoldProductsList(branch, year, month);
                return webResponce;
            }
            catch (Exception Ex)
            {
                webResponce = new WebResponce()
                {
                    Code = -1,
                    Message = Ex.Message
                };
                return webResponce;
            }
        }

        [HttpPost]
        public WebResponce DeleteSoldProduct([FromBody] SoldProducts soldProducts)
        {
            try
            {
                webResponce = products.DeleteSoldProduct(soldProducts);
                return webResponce;
            }
            catch (Exception Ex)
            {
                webResponce = new WebResponce()
                {
                    Code = -1,
                    Message = Ex.Message
                };
                return webResponce;
            }
        }

        #region
        public IActionResult ViewSoldProductsReport()
        {
            var userType = Request.Cookies["Role"];
            List<int> result1 = Setting.GetUserRightsbyUsertype(userType);
            if (result1.Count() > 0)
            {
                ViewBag.Delete = result1[60];
            }
            return View();
        }
        #endregion
    }
}
