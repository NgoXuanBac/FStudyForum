using FStudyForum.Core.Interfaces.IServices;
using FStudyForum.Core.Models.DTOs;
using FStudyForum.Core.Models.DTOs.Donation;
using FStudyForum.Core.Models.Entities;
using Microsoft.AspNetCore.Mvc;


namespace FStudyForum.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PaymentController : ControllerBase
    {
        private readonly IPaymentService _paymentService;
        public PaymentController(IPaymentService paymentService)
        {
            _paymentService = paymentService;
        }
        [HttpPost("generate-payment-url")]
        public async Task<IActionResult> GeneratePaymentUrl([FromBody] VNPayPayment paymentData)
        {
            try
            {
                var ipAddress = HttpContext.Connection.RemoteIpAddress?.ToString();

                var paymentUrl = await _paymentService.GeneratePaymentUrlAsync(paymentData, HttpContext);
                return Ok( new Response
                {
                    Data = paymentUrl,
                    Message = "Payment url generated successfully",
                    Status = ResponseStatus.SUCCESS
                }
                    );
            }
            catch (Exception ex)
            {
                return BadRequest(new Response
                {
                    Status = ResponseStatus.ERROR,
                    Message = ex.Message
                });
            }
        }
        [HttpGet("payment-response")]
        public async Task<IActionResult> PaymentResponse()
        {
            try
            {
                var response = await _paymentService.PaymentResponse(Request.Query);
                return Ok(new Response
                {
                    Data = response,
                    Message = "Payment response received successfully",
                    Status = ResponseStatus.SUCCESS
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new Response
                {
                    Status = ResponseStatus.ERROR,
                    Message = ex.Message
                });
            }
        }
        [HttpPost("save-user-donate")]
        public async Task<IActionResult> SaveUserDonate([FromBody] DonationDTO donationDTO)
        {
            try
            {
                var donation = await _paymentService.SaveUserDonate(donationDTO);
                return Ok(new Response
                {
                    Data = donation,
                    Message = "Donation saved successfully",
                    Status = ResponseStatus.SUCCESS
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new Response
                {
                    Status = ResponseStatus.ERROR,
                    Message = ex.Message
                });
            }
        }
        
    }
}
