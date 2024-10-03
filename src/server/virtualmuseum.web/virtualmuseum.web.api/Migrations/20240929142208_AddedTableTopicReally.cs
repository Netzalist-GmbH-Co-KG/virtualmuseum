using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace virtualmuseum.web.api.Migrations
{
    /// <inheritdoc />
    public partial class AddedTableTopicReally : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_TopographicalTableGeoEventGroups",
                table: "TopographicalTableGeoEventGroups");

            migrationBuilder.RenameTable(
                name: "TopographicalTableGeoEventGroups",
                newName: "TopographicalTableTopicTimeSeries");

            migrationBuilder.AddPrimaryKey(
                name: "PK_TopographicalTableTopicTimeSeries",
                table: "TopographicalTableTopicTimeSeries",
                column: "Id");

            migrationBuilder.CreateTable(
                name: "TopographicalTableTopics",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "TEXT", nullable: false),
                    TopographicalTableId = table.Column<Guid>(type: "TEXT", nullable: false),
                    Topic = table.Column<string>(type: "TEXT", nullable: false),
                    Description = table.Column<string>(type: "TEXT", nullable: false),
                    MediaFileImage2DUrl = table.Column<Guid>(type: "TEXT", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TopographicalTableTopics", x => x.Id);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "TopographicalTableTopics");

            migrationBuilder.DropPrimaryKey(
                name: "PK_TopographicalTableTopicTimeSeries",
                table: "TopographicalTableTopicTimeSeries");

            migrationBuilder.RenameTable(
                name: "TopographicalTableTopicTimeSeries",
                newName: "TopographicalTableGeoEventGroups");

            migrationBuilder.AddPrimaryKey(
                name: "PK_TopographicalTableGeoEventGroups",
                table: "TopographicalTableGeoEventGroups",
                column: "Id");
        }
    }
}
