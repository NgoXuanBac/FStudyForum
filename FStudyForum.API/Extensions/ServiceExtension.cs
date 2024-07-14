using FStudyForum.Core.Interfaces.IRepositories;
using FStudyForum.Core.Interfaces.IServices;
using FStudyForum.Core.Models.Entities;
using FStudyForum.Infrastructure.Repositories;
using FStudyForum.Infrastructure.Services;

namespace FStudyForum.API.Extensions;

public static class ServiceExtension
{

    public static IServiceCollection RegisterService(this IServiceCollection services)
    {
        #region Services
        services.AddScoped<ITokenService, TokenService>();
        services.AddScoped<IUserService, UserService>();
        services.AddScoped<IFeedService, FeedService>();

        services.AddScoped<IProfileService, ProfileService>();
        services.AddScoped<IIdentityService, IdentityService>();
        services.AddScoped<IEmailService, EmailService>();
        services.AddScoped<ITopicService, TopicService>();
        services.AddScoped<ICategoryService, CategoryService>();
        services.AddScoped<IPostService, PostService>();
        services.AddScoped<IVoteService, VoteService>();
        services.AddScoped<ICommentService, CommentService>();
        services.AddScoped<IPaymentService, PaymentService>();
        services.AddScoped<IReportService, ReportService>();
        services.AddScoped<IQRCodeService, QRCodeService>();
        services.AddScoped<IDonateService, DonateService>();
        #endregion

        #region Repositories
        services.AddTransient<IUserRepository, UserRepository>();
        services.AddTransient<IFeedRepository, FeedRepository>();
        services.AddTransient<ITopicRepository, TopicRepository>();
        services.AddTransient<IBaseRepository<Profile>, BaseRepository<Profile>>();
        services.AddTransient<IProfileRepository, ProfileRepository>();
        services.AddTransient<IPostRepository, PostRepository>();
        services.AddTransient<IVoteRepository, VoteRepository>();
        services.AddTransient<ICategoryRepository, CategoryRepository>();
        services.AddTransient<ICommentRepository, CommentRepository>();
        services.AddTransient<IDonationRepository, DonationRepository>();
        services.AddTransient<IReportRepository, ReportRepository>();
        #endregion


        return services;
    }
}