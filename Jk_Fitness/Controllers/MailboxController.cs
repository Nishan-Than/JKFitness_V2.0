using DataLayer.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using QuickMailer;
using ServiceLayer;
using ServiceLayer.Email;
using ServiceLayer.EmailAttachment;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Mail;
using System.Threading.Tasks;

namespace Jk_Fitness.Controllers
{
    [ValidCookie]
    public class MailboxController : Controller
    {
        private readonly MailSettings _mailSettings;
        private readonly MailBoxService mailBoxService;
        WebResponce webResponce = null;

        public MailboxController(IOptions<MailSettings> mailSettings, MailBoxService mailBoxService)
        {
            _mailSettings = mailSettings.Value;
            this.mailBoxService = mailBoxService;
        }
        public IActionResult Index()
        {
            return View();
        }

        public bool MailSending(MailAttachment mailAttachment)
        {
            List<string> ToEmails = new List<string>();
            Email email = new Email();
            ToEmails = GetValidMail(mailAttachment.ToEmail);


            List<Attachment> attachments = new List<Attachment>();
            if (mailAttachment.File != null)
            {
                Attachment attachment = new Attachment(mailAttachment.File.OpenReadStream(), mailAttachment.File.FileName);
                attachments.Add(attachment);
            }
            bool IsSend = email.SendEmail(ToEmails, _mailSettings.Mail, _mailSettings.Password, mailAttachment.Subject, mailAttachment.Body, null, null, attachments);
            return IsSend;
        }

        public List<string> GetValidMail(string mails)
        {
            List<string> emailAddresses = new List<string>();
            Email email = new Email();
            if (!string.IsNullOrEmpty(mails))
            {
                var Emails = mails.Split(',');
                foreach (var mail in Emails)
                {
                    bool isValid = email.IsValidEmail(mail.Trim());
                    if (isValid)
                    {
                        emailAddresses.Add(mail.Trim());
                    }
                }
            }
            return emailAddresses;
        }

        [HttpPost]
        public WebResponce GetMemberDetails(MemberShip Member)
        {
            try
            {
                webResponce = mailBoxService.ListMemberShipDetails(Member);
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
    }
}
