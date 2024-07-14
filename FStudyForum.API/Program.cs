using System.Text;
using FStudyForum.API.Extensions;
using FStudyForum.API.Hubs;
using FStudyForum.API.Mapper;
using FStudyForum.Core.Constants;
using FStudyForum.Core.Models.Configs;
using FStudyForum.Core.Models.Entities;
using FStudyForum.Infrastructure.Data;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Newtonsoft.Json;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddControllers();
var jwtSection = builder.Configuration.GetSection("JWT");
builder.Services.Configure<JwtConfig>(jwtSection);
builder.Services.Configure<GoogleConfig>(builder.Configuration.GetSection("Google"));
builder.Services.Configure<VNPayConfig>(builder.Configuration.GetSection("VnPay"));
builder.Services.Configure<EmailConfig>(builder.Configuration.GetSection("EmailApiKey"));
var jwtConfig = jwtSection.Get<JwtConfig>()
    ?? throw new Exception("Jwt options have not been set!");
builder.Services.AddDbContext<ApplicationDBContext>(options =>
    {
        var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
        options.UseSqlServer(connectionString);
    }
);
builder.Services.AddCors(options =>
{
    options.AddPolicy(Policy.SINGLE_PAGE_APP, policy =>
    {
        policy.WithOrigins(jwtConfig.Audience);
        policy.AllowAnyHeader();
        policy.AllowAnyMethod();
        policy.AllowCredentials();
    });
});
builder.Services.AddControllersWithViews()
            .AddNewtonsoftJson(options =>
            {
                options.SerializerSettings.ReferenceLoopHandling = ReferenceLoopHandling.Ignore;
            });
builder.Services.AddHttpClient();
builder.Services.AddAutoMapper(typeof(MapperProfile));
builder.Services.AddIdentity<ApplicationUser, IdentityRole>(options =>
    {
        options.Password.RequiredLength = 8;
        options.Password.RequireUppercase =
            options.Password.RequireLowercase =
                options.Password.RequireNonAlphanumeric = false;

        options.User.RequireUniqueEmail = true;
        options.SignIn.RequireConfirmedEmail = true;
        options.Tokens.PasswordResetTokenProvider = TokenOptions.DefaultEmailProvider;
        options.Tokens.EmailConfirmationTokenProvider = TokenOptions.DefaultEmailProvider;
        options.Tokens.AuthenticatorTokenProvider = TokenOptions.DefaultEmailProvider;
    }
).AddEntityFrameworkStores<ApplicationDBContext>()
.AddDefaultTokenProviders();

builder.Services
    .AddAuthentication(options =>
    {
        options.DefaultAuthenticateScheme =
            options.DefaultChallengeScheme =
                options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
    })
    .AddJwtBearer(option =>
    {
        option.TokenValidationParameters = new()
        {
            ValidateIssuerSigningKey = true,
            ClockSkew = TimeSpan.Zero,
            ValidIssuer = jwtConfig.Issuer,
            ValidAudience = jwtConfig.Audience,
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(jwtConfig.SigningKey)
            )
        };
        option.Events = new()
        {
            OnMessageReceived = context =>
            {
                context.Request.Cookies.TryGetValue(jwtConfig.AccessTokenKey, out var accessToken);
                if (!string.IsNullOrEmpty(accessToken))
                    context.Token = accessToken;
                return Task.CompletedTask;
            }
        };
    });
builder.Services.AddSignalR();
builder.Services.RegisterService();
var app = builder.Build();

app.UseCors(Policy.SINGLE_PAGE_APP);
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.MapHub<TestHub>("/test-hub");
app.Run();
