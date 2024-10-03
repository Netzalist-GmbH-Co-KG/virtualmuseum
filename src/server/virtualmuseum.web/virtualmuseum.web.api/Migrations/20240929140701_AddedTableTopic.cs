using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace virtualmuseum.web.api.Migrations
{
    /// <inheritdoc />
    public partial class AddedTableTopic : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "TopographicalTableId",
                table: "TopographicalTableGeoEventGroups",
                newName: "TopographicalTableTopicId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "TopographicalTableTopicId",
                table: "TopographicalTableGeoEventGroups",
                newName: "TopographicalTableId");
        }
    }
}
