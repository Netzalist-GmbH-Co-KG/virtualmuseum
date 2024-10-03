using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace virtualmuseum.web.api.Migrations
{
    /// <inheritdoc />
    public partial class RenamedAColumn : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "MediaFileImage2DUrl",
                table: "TopographicalTableTopics",
                newName: "MediaFileImage2DId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "MediaFileImage2DId",
                table: "TopographicalTableTopics",
                newName: "MediaFileImage2DUrl");
        }
    }
}
