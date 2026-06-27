using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GuerraArq.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddHeroFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "HeroLead",
                table: "StudioInfo",
                type: "character varying(600)",
                maxLength: 600,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "HeroTitulo",
                table: "StudioInfo",
                type: "character varying(300)",
                maxLength: 300,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "HeroTituloDestaque",
                table: "StudioInfo",
                type: "character varying(150)",
                maxLength: 150,
                nullable: true);

            migrationBuilder.UpdateData(
                table: "StudioInfo",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "HeroLead", "HeroTitulo", "HeroTituloDestaque" },
                values: new object[] { null, null, null });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "HeroLead",
                table: "StudioInfo");

            migrationBuilder.DropColumn(
                name: "HeroTitulo",
                table: "StudioInfo");

            migrationBuilder.DropColumn(
                name: "HeroTituloDestaque",
                table: "StudioInfo");
        }
    }
}
