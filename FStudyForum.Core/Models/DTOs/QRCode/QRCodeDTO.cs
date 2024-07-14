using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Xml.Linq;

namespace FStudyForum.Core.Models.DTOs.QRCode
{
    public class QRCodeDTO
    {
        public string Code { get; set; } = string.Empty;
        public string Desc { get; set; } = string.Empty;
        public QRCodeData? Data { get; set; } 
    }
}
