using SendGrid;
using SendGrid.Helpers.Mail;
using FStudyForum.Core.Interfaces.IServices;
using FStudyForum.Core.Models.Configs;
using Microsoft.Extensions.Options;

namespace FStudyForum.Infrastructure.Services
{
    public class EmailService : IEmailService
    {
        private readonly EmailConfig _emailConfig;

        public EmailService(IOptions<EmailConfig> emailConfig)
        {
            _emailConfig = emailConfig.Value;
        }

        public async Task SendEmailAsync(string toEmail, string subject, string verificationLink)
        {
            var apiKey = _emailConfig.Key;
            var client = new SendGridClient(apiKey);
            var from = new EmailAddress(_emailConfig.OwnerMail, _emailConfig.Company);
            var to = new EmailAddress(toEmail);
            var msg = MailHelper.CreateSingleEmail(from, to, subject, null, verificationLink);
            var response = await client.SendEmailAsync(msg);
        }
    }
}