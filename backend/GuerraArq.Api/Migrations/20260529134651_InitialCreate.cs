using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace GuerraArq.Api.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Projetos",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Slug = table.Column<string>(type: "character varying(120)", maxLength: 120, nullable: false),
                    Titulo = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    Ano = table.Column<int>(type: "integer", nullable: false),
                    Tipo = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    Categoria = table.Column<string>(type: "character varying(80)", maxLength: 80, nullable: false),
                    AreaM2 = table.Column<int>(type: "integer", nullable: true),
                    Localizacao = table.Column<string>(type: "character varying(120)", maxLength: 120, nullable: true),
                    Duracao = table.Column<string>(type: "character varying(60)", maxLength: 60, nullable: true),
                    Cliente = table.Column<string>(type: "character varying(120)", maxLength: 120, nullable: true),
                    Status = table.Column<string>(type: "character varying(40)", maxLength: 40, nullable: true),
                    Ferramentas = table.Column<string>(type: "text", nullable: false),
                    DescricaoParagrafos = table.Column<string>(type: "text", nullable: false),
                    Citacao = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    CapaUrl = table.Column<string>(type: "text", nullable: false),
                    Ordem = table.Column<int>(type: "integer", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Projetos", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "StudioInfo",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Whatsapp = table.Column<string>(type: "character varying(40)", maxLength: 40, nullable: true),
                    Instagram = table.Column<string>(type: "character varying(80)", maxLength: 80, nullable: true),
                    Pinterest = table.Column<string>(type: "character varying(80)", maxLength: 80, nullable: true),
                    Linkedin = table.Column<string>(type: "character varying(120)", maxLength: 120, nullable: true),
                    Email = table.Column<string>(type: "character varying(120)", maxLength: 120, nullable: true),
                    AnoFundacao = table.Column<int>(type: "integer", nullable: true),
                    StatCustomLabel = table.Column<string>(type: "character varying(60)", maxLength: 60, nullable: true),
                    StatCustomValor = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: true),
                    SobreParagrafos = table.Column<string>(type: "text", nullable: false),
                    Servicos = table.Column<string>(type: "text", nullable: false),
                    FotoArquitetaUrl = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    FotoEstudioUrl = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_StudioInfo", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "GaleriaItens",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Url = table.Column<string>(type: "text", nullable: false),
                    Descricao = table.Column<string>(type: "character varying(300)", maxLength: 300, nullable: true),
                    Ordem = table.Column<int>(type: "integer", nullable: false),
                    ProjetoId = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_GaleriaItens", x => x.Id);
                    table.ForeignKey(
                        name: "FK_GaleriaItens_Projetos_ProjetoId",
                        column: x => x.ProjetoId,
                        principalTable: "Projetos",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.InsertData(
                table: "StudioInfo",
                columns: new[] { "Id", "AnoFundacao", "Email", "FotoArquitetaUrl", "FotoEstudioUrl", "Instagram", "Linkedin", "Pinterest", "Servicos", "SobreParagrafos", "StatCustomLabel", "StatCustomValor", "Whatsapp" },
                values: new object[] { 1, 2018, null, null, null, null, null, null, "[]", "[]", "Sob medida", "100%", null });

            migrationBuilder.CreateIndex(
                name: "IX_GaleriaItens_ProjetoId",
                table: "GaleriaItens",
                column: "ProjetoId");

            migrationBuilder.CreateIndex(
                name: "IX_Projetos_Slug",
                table: "Projetos",
                column: "Slug",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "GaleriaItens");

            migrationBuilder.DropTable(
                name: "StudioInfo");

            migrationBuilder.DropTable(
                name: "Projetos");
        }
    }
}
