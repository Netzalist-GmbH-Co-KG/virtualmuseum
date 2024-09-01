using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace virtualmuseum.web.api.Migrations
{
    /// <inheritdoc />
    public partial class AddUsernameToUserRole2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Username",
                table: "UserRoles",
                type: "TEXT",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Username",
                table: "UserRoles");
        }
    }
}
