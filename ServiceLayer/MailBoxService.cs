using DataLayer;
using DataLayer.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ServiceLayer
{
    public class MailBoxService
    {
        private readonly UnitOfWork uow;
        WebResponce webResponce = null;

        public MailBoxService(UnitOfWork uow) {
            this.uow = uow;
        }

        public WebResponce ListMemberShipDetails(MemberShip Mem)
        {
            try
            {
                var Member = uow.MembershipRepository.GetAll().Where(x => x.Branch == Mem.Branch && x.Active == Mem.Active && x.Gender == Mem.Gender).Select(x => x.Email).ToList();

                if (Member != null && Member.Count > 0)
                {
                    webResponce = new WebResponce()
                    {
                        Code = 1,
                        Message = "Success",
                        Data = Member
                    };
                }
                else
                {
                    webResponce = new WebResponce()
                    {
                        Code = 0,
                        Message = "Seems Like Doesn't have Records!"
                    };
                }
            }
            catch (Exception ex)
            {
                webResponce = new WebResponce()
                {
                    Code = -1,
                    Message = ex.Message.ToString()
                };
            }
            return webResponce;
        }

    }
}
