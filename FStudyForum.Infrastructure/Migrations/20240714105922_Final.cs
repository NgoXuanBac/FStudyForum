using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace FStudyForum.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class Final : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.EnsureSchema(
                name: "dbo");

            migrationBuilder.CreateTable(
                name: "tblCategories",
                schema: "dbo",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Description = table.Column<string>(type: "nvarchar(300)", maxLength: 300, nullable: false),
                    Type = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ModifiedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_tblCategories", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "tblRoles",
                schema: "dbo",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: true),
                    NormalizedName = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: true),
                    ConcurrencyStamp = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_tblRoles", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "tblTopics",
                schema: "dbo",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(25)", maxLength: 25, nullable: false),
                    Description = table.Column<string>(type: "nvarchar(300)", maxLength: 300, nullable: false),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false),
                    Panner = table.Column<string>(type: "nvarchar(300)", maxLength: 300, nullable: false),
                    Avatar = table.Column<string>(type: "nvarchar(300)", maxLength: 300, nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ModifiedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_tblTopics", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "tblUsers",
                schema: "dbo",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    RefreshToken = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    RefreshTokenExpiryTime = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UserName = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: true),
                    NormalizedUserName = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: true),
                    Email = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: true),
                    NormalizedEmail = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: true),
                    EmailConfirmed = table.Column<bool>(type: "bit", nullable: false),
                    PasswordHash = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    SecurityStamp = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ConcurrencyStamp = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    PhoneNumber = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    PhoneNumberConfirmed = table.Column<bool>(type: "bit", nullable: false),
                    TwoFactorEnabled = table.Column<bool>(type: "bit", nullable: false),
                    LockoutEnd = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: true),
                    LockoutEnabled = table.Column<bool>(type: "bit", nullable: false),
                    AccessFailedCount = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_tblUsers", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "tblRoleClaims",
                schema: "dbo",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    RoleId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    ClaimType = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ClaimValue = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_tblRoleClaims", x => x.Id);
                    table.ForeignKey(
                        name: "FK_tblRoleClaims_tblRoles_RoleId",
                        column: x => x.RoleId,
                        principalSchema: "dbo",
                        principalTable: "tblRoles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "tblTopicCategories",
                schema: "dbo",
                columns: table => new
                {
                    CategoriesId = table.Column<long>(type: "bigint", nullable: false),
                    TopicsId = table.Column<long>(type: "bigint", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_tblTopicCategories", x => new { x.CategoriesId, x.TopicsId });
                    table.ForeignKey(
                        name: "FK_tblTopicCategories_tblCategories_CategoriesId",
                        column: x => x.CategoriesId,
                        principalSchema: "dbo",
                        principalTable: "tblCategories",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_tblTopicCategories_tblTopics_TopicsId",
                        column: x => x.TopicsId,
                        principalSchema: "dbo",
                        principalTable: "tblTopics",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "tblDonations",
                schema: "dbo",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Amount = table.Column<long>(type: "bigint", nullable: false),
                    Message = table.Column<string>(type: "nvarchar(300)", maxLength: 300, nullable: false),
                    UserId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Tid = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ModifiedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_tblDonations", x => x.Id);
                    table.ForeignKey(
                        name: "FK_tblDonations_tblUsers_UserId",
                        column: x => x.UserId,
                        principalSchema: "dbo",
                        principalTable: "tblUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "tblFeeds",
                schema: "dbo",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CreaterId = table.Column<string>(type: "nvarchar(450)", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ModifiedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_tblFeeds", x => x.Id);
                    table.ForeignKey(
                        name: "FK_tblFeeds_tblUsers_CreaterId",
                        column: x => x.CreaterId,
                        principalSchema: "dbo",
                        principalTable: "tblUsers",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "tblModerators",
                schema: "dbo",
                columns: table => new
                {
                    ModeratedByUsersId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    ModeratedTopicsId = table.Column<long>(type: "bigint", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_tblModerators", x => new { x.ModeratedByUsersId, x.ModeratedTopicsId });
                    table.ForeignKey(
                        name: "FK_tblModerators_tblTopics_ModeratedTopicsId",
                        column: x => x.ModeratedTopicsId,
                        principalSchema: "dbo",
                        principalTable: "tblTopics",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_tblModerators_tblUsers_ModeratedByUsersId",
                        column: x => x.ModeratedByUsersId,
                        principalSchema: "dbo",
                        principalTable: "tblUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "tblPosts",
                schema: "dbo",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Title = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    Content = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false),
                    IsDeletedForever = table.Column<bool>(type: "bit", nullable: false),
                    TopicId = table.Column<long>(type: "bigint", nullable: true),
                    CreaterId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ModifiedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_tblPosts", x => x.Id);
                    table.ForeignKey(
                        name: "FK_tblPosts_tblTopics_TopicId",
                        column: x => x.TopicId,
                        principalSchema: "dbo",
                        principalTable: "tblTopics",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_tblPosts_tblUsers_CreaterId",
                        column: x => x.CreaterId,
                        principalSchema: "dbo",
                        principalTable: "tblUsers",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "tblProfiles",
                schema: "dbo",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    FirstName = table.Column<string>(type: "nvarchar(25)", maxLength: 25, nullable: false),
                    LastName = table.Column<string>(type: "nvarchar(25)", maxLength: 25, nullable: false),
                    Gender = table.Column<int>(type: "int", nullable: false),
                    Major = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Bio = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Phone = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Avatar = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    Banner = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    UserId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ModifiedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_tblProfiles", x => x.Id);
                    table.ForeignKey(
                        name: "FK_tblProfiles_tblUsers_UserId",
                        column: x => x.UserId,
                        principalSchema: "dbo",
                        principalTable: "tblUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "tblReports",
                schema: "dbo",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Type = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Content = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ResponseContent = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CreaterId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ModifiedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_tblReports", x => x.Id);
                    table.ForeignKey(
                        name: "FK_tblReports_tblUsers_CreaterId",
                        column: x => x.CreaterId,
                        principalSchema: "dbo",
                        principalTable: "tblUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "tblTopicBans",
                schema: "dbo",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    TopicId = table.Column<long>(type: "bigint", nullable: false),
                    BannedTime = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ModifiedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_tblTopicBans", x => x.Id);
                    table.ForeignKey(
                        name: "FK_tblTopicBans_tblTopics_TopicId",
                        column: x => x.TopicId,
                        principalSchema: "dbo",
                        principalTable: "tblTopics",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_tblTopicBans_tblUsers_UserId",
                        column: x => x.UserId,
                        principalSchema: "dbo",
                        principalTable: "tblUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "tblUserClaims",
                schema: "dbo",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    ClaimType = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ClaimValue = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_tblUserClaims", x => x.Id);
                    table.ForeignKey(
                        name: "FK_tblUserClaims_tblUsers_UserId",
                        column: x => x.UserId,
                        principalSchema: "dbo",
                        principalTable: "tblUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "tblUserLogins",
                schema: "dbo",
                columns: table => new
                {
                    LoginProvider = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    ProviderKey = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    ProviderDisplayName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    UserId = table.Column<string>(type: "nvarchar(450)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_tblUserLogins", x => new { x.LoginProvider, x.ProviderKey });
                    table.ForeignKey(
                        name: "FK_tblUserLogins_tblUsers_UserId",
                        column: x => x.UserId,
                        principalSchema: "dbo",
                        principalTable: "tblUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "tblUserRoles",
                schema: "dbo",
                columns: table => new
                {
                    UserId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    RoleId = table.Column<string>(type: "nvarchar(450)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_tblUserRoles", x => new { x.UserId, x.RoleId });
                    table.ForeignKey(
                        name: "FK_tblUserRoles_tblRoles_RoleId",
                        column: x => x.RoleId,
                        principalSchema: "dbo",
                        principalTable: "tblRoles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_tblUserRoles_tblUsers_UserId",
                        column: x => x.UserId,
                        principalSchema: "dbo",
                        principalTable: "tblUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "tblUserTokens",
                schema: "dbo",
                columns: table => new
                {
                    UserId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    LoginProvider = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Value = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_tblUserTokens", x => new { x.UserId, x.LoginProvider, x.Name });
                    table.ForeignKey(
                        name: "FK_tblUserTokens_tblUsers_UserId",
                        column: x => x.UserId,
                        principalSchema: "dbo",
                        principalTable: "tblUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "tblTopicFeeds",
                schema: "dbo",
                columns: table => new
                {
                    FeedsId = table.Column<long>(type: "bigint", nullable: false),
                    TopicsId = table.Column<long>(type: "bigint", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_tblTopicFeeds", x => new { x.FeedsId, x.TopicsId });
                    table.ForeignKey(
                        name: "FK_tblTopicFeeds_tblFeeds_FeedsId",
                        column: x => x.FeedsId,
                        principalSchema: "dbo",
                        principalTable: "tblFeeds",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_tblTopicFeeds_tblTopics_TopicsId",
                        column: x => x.TopicsId,
                        principalSchema: "dbo",
                        principalTable: "tblTopics",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "tblAttachments",
                schema: "dbo",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Type = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    Name = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    Size = table.Column<int>(type: "int", nullable: false),
                    Url = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    PostId = table.Column<long>(type: "bigint", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ModifiedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_tblAttachments", x => x.Id);
                    table.ForeignKey(
                        name: "FK_tblAttachments_tblPosts_PostId",
                        column: x => x.PostId,
                        principalSchema: "dbo",
                        principalTable: "tblPosts",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "tblRecentPosts",
                schema: "dbo",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    PostId = table.Column<long>(type: "bigint", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ModifiedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_tblRecentPosts", x => x.Id);
                    table.ForeignKey(
                        name: "FK_tblRecentPosts_tblPosts_PostId",
                        column: x => x.PostId,
                        principalSchema: "dbo",
                        principalTable: "tblPosts",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_tblRecentPosts_tblUsers_UserId",
                        column: x => x.UserId,
                        principalSchema: "dbo",
                        principalTable: "tblUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "tblSavedPosts",
                schema: "dbo",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    PostId = table.Column<long>(type: "bigint", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ModifiedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_tblSavedPosts", x => x.Id);
                    table.ForeignKey(
                        name: "FK_tblSavedPosts_tblPosts_PostId",
                        column: x => x.PostId,
                        principalSchema: "dbo",
                        principalTable: "tblPosts",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_tblSavedPosts_tblUsers_UserId",
                        column: x => x.UserId,
                        principalSchema: "dbo",
                        principalTable: "tblUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "tblComments",
                schema: "dbo",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Content = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false),
                    CreaterId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    PostId = table.Column<long>(type: "bigint", nullable: false),
                    AttachmentId = table.Column<long>(type: "bigint", nullable: true),
                    ReplyToId = table.Column<long>(type: "bigint", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ModifiedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_tblComments", x => x.Id);
                    table.ForeignKey(
                        name: "FK_tblComments_tblAttachments_AttachmentId",
                        column: x => x.AttachmentId,
                        principalSchema: "dbo",
                        principalTable: "tblAttachments",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_tblComments_tblComments_ReplyToId",
                        column: x => x.ReplyToId,
                        principalSchema: "dbo",
                        principalTable: "tblComments",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_tblComments_tblPosts_PostId",
                        column: x => x.PostId,
                        principalSchema: "dbo",
                        principalTable: "tblPosts",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_tblComments_tblUsers_CreaterId",
                        column: x => x.CreaterId,
                        principalSchema: "dbo",
                        principalTable: "tblUsers",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "tblVotes",
                schema: "dbo",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    IsUp = table.Column<bool>(type: "bit", nullable: false),
                    VoterId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    PostId = table.Column<long>(type: "bigint", nullable: true),
                    CommentId = table.Column<long>(type: "bigint", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ModifiedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_tblVotes", x => x.Id);
                    table.ForeignKey(
                        name: "FK_tblVotes_tblComments_CommentId",
                        column: x => x.CommentId,
                        principalSchema: "dbo",
                        principalTable: "tblComments",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_tblVotes_tblPosts_PostId",
                        column: x => x.PostId,
                        principalSchema: "dbo",
                        principalTable: "tblPosts",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_tblVotes_tblUsers_VoterId",
                        column: x => x.VoterId,
                        principalSchema: "dbo",
                        principalTable: "tblUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.InsertData(
                schema: "dbo",
                table: "tblRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[,]
                {
                    { "408b5ddf-5a65-456a-a5b7-9699b27267ac", null, "User", "USER" },
                    { "5e184ab5-6a74-4020-8813-f9f2b1d688dd", null, "Moderator", "MODERATOR" },
                    { "c86effce-aad1-4ada-9432-a4834b32b59a", null, "Admin", "ADMIN" }
                });

            migrationBuilder.CreateIndex(
                name: "IX_tblAttachments_PostId",
                schema: "dbo",
                table: "tblAttachments",
                column: "PostId");

            migrationBuilder.CreateIndex(
                name: "IX_tblComments_AttachmentId",
                schema: "dbo",
                table: "tblComments",
                column: "AttachmentId");

            migrationBuilder.CreateIndex(
                name: "IX_tblComments_CreaterId",
                schema: "dbo",
                table: "tblComments",
                column: "CreaterId");

            migrationBuilder.CreateIndex(
                name: "IX_tblComments_PostId",
                schema: "dbo",
                table: "tblComments",
                column: "PostId");

            migrationBuilder.CreateIndex(
                name: "IX_tblComments_ReplyToId",
                schema: "dbo",
                table: "tblComments",
                column: "ReplyToId");

            migrationBuilder.CreateIndex(
                name: "IX_tblDonations_UserId",
                schema: "dbo",
                table: "tblDonations",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_tblFeeds_CreaterId",
                schema: "dbo",
                table: "tblFeeds",
                column: "CreaterId");

            migrationBuilder.CreateIndex(
                name: "IX_tblModerators_ModeratedTopicsId",
                schema: "dbo",
                table: "tblModerators",
                column: "ModeratedTopicsId");

            migrationBuilder.CreateIndex(
                name: "IX_tblPosts_CreaterId",
                schema: "dbo",
                table: "tblPosts",
                column: "CreaterId");

            migrationBuilder.CreateIndex(
                name: "IX_tblPosts_TopicId",
                schema: "dbo",
                table: "tblPosts",
                column: "TopicId");

            migrationBuilder.CreateIndex(
                name: "IX_tblProfiles_UserId",
                schema: "dbo",
                table: "tblProfiles",
                column: "UserId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_tblRecentPosts_PostId",
                schema: "dbo",
                table: "tblRecentPosts",
                column: "PostId");

            migrationBuilder.CreateIndex(
                name: "IX_tblRecentPosts_UserId",
                schema: "dbo",
                table: "tblRecentPosts",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_tblReports_CreaterId",
                schema: "dbo",
                table: "tblReports",
                column: "CreaterId");

            migrationBuilder.CreateIndex(
                name: "IX_tblRoleClaims_RoleId",
                schema: "dbo",
                table: "tblRoleClaims",
                column: "RoleId");

            migrationBuilder.CreateIndex(
                name: "RoleNameIndex",
                schema: "dbo",
                table: "tblRoles",
                column: "NormalizedName",
                unique: true,
                filter: "[NormalizedName] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_tblSavedPosts_PostId",
                schema: "dbo",
                table: "tblSavedPosts",
                column: "PostId");

            migrationBuilder.CreateIndex(
                name: "IX_tblSavedPosts_UserId",
                schema: "dbo",
                table: "tblSavedPosts",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_tblTopicBans_TopicId",
                schema: "dbo",
                table: "tblTopicBans",
                column: "TopicId");

            migrationBuilder.CreateIndex(
                name: "IX_tblTopicBans_UserId",
                schema: "dbo",
                table: "tblTopicBans",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_tblTopicCategories_TopicsId",
                schema: "dbo",
                table: "tblTopicCategories",
                column: "TopicsId");

            migrationBuilder.CreateIndex(
                name: "IX_tblTopicFeeds_TopicsId",
                schema: "dbo",
                table: "tblTopicFeeds",
                column: "TopicsId");

            migrationBuilder.CreateIndex(
                name: "IX_tblTopics_Name",
                schema: "dbo",
                table: "tblTopics",
                column: "Name",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_tblUserClaims_UserId",
                schema: "dbo",
                table: "tblUserClaims",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_tblUserLogins_UserId",
                schema: "dbo",
                table: "tblUserLogins",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_tblUserRoles_RoleId",
                schema: "dbo",
                table: "tblUserRoles",
                column: "RoleId");

            migrationBuilder.CreateIndex(
                name: "EmailIndex",
                schema: "dbo",
                table: "tblUsers",
                column: "NormalizedEmail");

            migrationBuilder.CreateIndex(
                name: "UserNameIndex",
                schema: "dbo",
                table: "tblUsers",
                column: "NormalizedUserName",
                unique: true,
                filter: "[NormalizedUserName] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_tblVotes_CommentId",
                schema: "dbo",
                table: "tblVotes",
                column: "CommentId");

            migrationBuilder.CreateIndex(
                name: "IX_tblVotes_PostId",
                schema: "dbo",
                table: "tblVotes",
                column: "PostId");

            migrationBuilder.CreateIndex(
                name: "IX_tblVotes_VoterId",
                schema: "dbo",
                table: "tblVotes",
                column: "VoterId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "tblDonations",
                schema: "dbo");

            migrationBuilder.DropTable(
                name: "tblModerators",
                schema: "dbo");

            migrationBuilder.DropTable(
                name: "tblProfiles",
                schema: "dbo");

            migrationBuilder.DropTable(
                name: "tblRecentPosts",
                schema: "dbo");

            migrationBuilder.DropTable(
                name: "tblReports",
                schema: "dbo");

            migrationBuilder.DropTable(
                name: "tblRoleClaims",
                schema: "dbo");

            migrationBuilder.DropTable(
                name: "tblSavedPosts",
                schema: "dbo");

            migrationBuilder.DropTable(
                name: "tblTopicBans",
                schema: "dbo");

            migrationBuilder.DropTable(
                name: "tblTopicCategories",
                schema: "dbo");

            migrationBuilder.DropTable(
                name: "tblTopicFeeds",
                schema: "dbo");

            migrationBuilder.DropTable(
                name: "tblUserClaims",
                schema: "dbo");

            migrationBuilder.DropTable(
                name: "tblUserLogins",
                schema: "dbo");

            migrationBuilder.DropTable(
                name: "tblUserRoles",
                schema: "dbo");

            migrationBuilder.DropTable(
                name: "tblUserTokens",
                schema: "dbo");

            migrationBuilder.DropTable(
                name: "tblVotes",
                schema: "dbo");

            migrationBuilder.DropTable(
                name: "tblCategories",
                schema: "dbo");

            migrationBuilder.DropTable(
                name: "tblFeeds",
                schema: "dbo");

            migrationBuilder.DropTable(
                name: "tblRoles",
                schema: "dbo");

            migrationBuilder.DropTable(
                name: "tblComments",
                schema: "dbo");

            migrationBuilder.DropTable(
                name: "tblAttachments",
                schema: "dbo");

            migrationBuilder.DropTable(
                name: "tblPosts",
                schema: "dbo");

            migrationBuilder.DropTable(
                name: "tblTopics",
                schema: "dbo");

            migrationBuilder.DropTable(
                name: "tblUsers",
                schema: "dbo");
        }
    }
}
