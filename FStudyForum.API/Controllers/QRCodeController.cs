using FStudyForum.Core.Interfaces.IServices;
using FStudyForum.Core.Models.DTOs;
using Microsoft.AspNetCore.Mvc;

namespace FStudyForum.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class QRCodeController : ControllerBase
    {
        private readonly IQRCodeService _qrCodeService;
        public QRCodeController(IQRCodeService qrCodeService)
        {
            _qrCodeService = qrCodeService;
        }
        [HttpGet("generate/{amountByUser}/{addInfoByUser}")]
        public async Task<IActionResult> GenerateQrCode(string amountByUser, string addInfoByUser)
        {
            try
            {
                var qrCodeData = await _qrCodeService.GenerateVietQRCodeAsync(amountByUser, addInfoByUser);
                if(qrCodeData == null)
                {
                    return BadRequest(new Response
                    {
                        Data = qrCodeData?.Data,
                        Status = ResponseStatus.ERROR,
                        Message = "Generate QR code failed!"
                    });
                }
                    
                return Ok(new Response
                {
                    Data = qrCodeData?.Data,
                    Status = ResponseStatus.SUCCESS,
                    Message = "Generate QR code successfully"
                });
            }
            catch (HttpRequestException ex)
            {
                return BadRequest(new Response
                {
                    Status = ResponseStatus.ERROR,
                    Message = ex.Message
                });
            }
        }
        [HttpGet("isExistTid/{tid}")]
        public async Task<IActionResult> CheckExistDonate(string tid)
        {
            try
            {
                var isExist = await _qrCodeService.CheckExistDonate(tid);
                return Ok(new Response
                {
                    Data = isExist,
                    Status = ResponseStatus.SUCCESS,
                    Message = "Check exist donate successfully"
                });
            } catch (Exception ex)
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
