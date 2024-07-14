using FStudyForum.Core.Models.DTOs.QRCode;
using FStudyForum.Core.Models.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FStudyForum.Core.Interfaces.IServices
{
    public interface IQRCodeService
    {
        Task<QRCodeDTO?> GenerateVietQRCodeAsync(string amountByUser, string addInfoByUser);
        Task<bool> CheckExistDonate(string tid);
    }
}
