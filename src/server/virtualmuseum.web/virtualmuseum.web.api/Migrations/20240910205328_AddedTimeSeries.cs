using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace virtualmuseum.web.api.Migrations
{
    /// <inheritdoc />
    public partial class AddedTimeSeries : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "GeoEventGroupId",
                table: "TopographicalTableGeoEventGroups",
                newName: "TimeSeriesId");

            migrationBuilder.AddColumn<Guid>(
                name: "TimeSeriesId",
                table: "GeoEventGroups",
                type: "TEXT",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.CreateTable(
                name: "TimeSeries",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "TEXT", nullable: false),
                    Name = table.Column<string>(type: "TEXT", nullable: false),
                    Description = table.Column<string>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TimeSeries", x => x.Id);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "TimeSeries");

            migrationBuilder.DropColumn(
                name: "TimeSeriesId",
                table: "GeoEventGroups");

            migrationBuilder.RenameColumn(
                name: "TimeSeriesId",
                table: "TopographicalTableGeoEventGroups",
                newName: "GeoEventGroupId");
        }
    }
}
