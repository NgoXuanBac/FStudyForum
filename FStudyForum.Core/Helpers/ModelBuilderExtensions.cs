using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace FStudyForum.Core.Helpers;

public static class ModelBuilderExtensions
{
    public static void SeedDatabase(this ModelBuilder builder)
    {
        var roles = new List<IdentityRole>();
        foreach (var role in Constants.UserRole.All)
        {
            roles.Add(new IdentityRole
            {
                Id = Guid.NewGuid().ToString(),
                Name = role,
                NormalizedName = role.ToUpper()
            });
        }

        builder.Entity<IdentityRole>().HasData(roles);
    }

}
