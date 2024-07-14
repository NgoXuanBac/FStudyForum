using FStudyForum.Core.Models.DTOs.Profile;
using FStudyForum.Core.Models.DTOs.User;
using FStudyForum.Core.Models.Entities;
using FStudyForum.Core.Models.DTOs.Topic;
using FStudyForum.Core.Models.DTOs;
using FStudyForum.Core.Models.DTOs.Post;
using FStudyForum.Core.Models.DTOs.Donation;
using FStudyForum.Core.Models.DTOs.Category;
using FStudyForum.Core.Models.DTOs.Report;
using Newtonsoft.Json;
using FStudyForum.Core.Models.DTOs.Attachment;
namespace FStudyForum.API.Mapper;

public class MapperProfile : AutoMapper.Profile
{
    public MapperProfile()
    {
        CreateMap<ApplicationUser, UserDTO>();
        CreateMap<Attachment, AttachmentDTO>();
        CreateMap<Topic, TopicDTO>().ReverseMap();
        CreateMap<Topic, TopicDTO>()
            .ForMember(dest => dest.Categories, opt => opt.MapFrom(src => src.Categories.Select(c => c.Id)));
        CreateMap<ProfileDTO, Profile>().ReverseMap();
        CreateMap<PaginatedData<Post>, PaginatedData<PostDTO>>().ReverseMap();
        CreateMap<SavedPost, SavePostDTO>().ReverseMap();
        CreateMap<RecentPost, RecentPostDTO>().ReverseMap();
        CreateMap<Donation, DonationDTO>().ReverseMap();
        CreateMap<Donation, CreateDonationDTO>().ReverseMap();
        CreateMap<Donation, UpdateDonationDTO>().ReverseMap();
        CreateMap<Category, CategoryDTO>().ReverseMap();

        // Post Mapper
        CreateMap<PostDTO, Post>().ReverseMap();

        // Report Mapper
        CreateMap<Report, ReportDTO>()
            .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Id))
            .ForMember(dest => dest.Type, opt => opt.MapFrom(src => src.Type))
            .ForMember(dest => dest.Content, opt => opt.MapFrom(src =>
                JsonConvert.DeserializeObject<ReportContent>(src.Content) ?? new ReportContent()))
            .ForMember(dest => dest.ResponseContent, opt => opt.MapFrom(src => src.ResponseContent))
            .ForMember(dest => dest.Creater, opt => opt.MapFrom(src => src.Creater.Email));

        CreateMap<ReportDTO, Report>()
            .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Id))
            .ForMember(dest => dest.Type, opt => opt.MapFrom(src => src.Type))
            .ForMember(dest => dest.Content, opt => opt.MapFrom(src =>
                JsonConvert.SerializeObject(src.Content) ?? string.Empty))
            .ForMember(dest => dest.ResponseContent, opt => opt.MapFrom(src => src.ResponseContent))
            .ForMember(dest => dest.Creater, opt => opt.MapFrom<ReportResolver>());
    }
}
