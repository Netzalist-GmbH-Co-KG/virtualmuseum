using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace virtualmuseum.web.api.Migrations
{
    /// <inheritdoc />
    public partial class FixedMultimediaPresentations : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ItemIDs",
                table: "MultimediaPresentations");

            migrationBuilder.AddColumn<Guid>(
                name: "MultimediaPresentationId",
                table: "PresentationItems",
                type: "TEXT",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "MultimediaPresentationId",
                table: "PresentationItems");

            migrationBuilder.AddColumn<string>(
                name: "ItemIDs",
                table: "MultimediaPresentations",
                type: "TEXT",
                nullable: false,
                defaultValue: "");
        }
    }
}
