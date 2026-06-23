using System.ComponentModel.DataAnnotations;

namespace GuerraArq.Api.Models;

// Entidade Projeto: representa um projeto de arquitetura exibido no portfólio.
// Cada projeto tem uma capa única e uma galeria com várias imagens.
public class Projeto
{
    // Identificador único do projeto (gerado pelo banco).
    public int Id { get; set; }

    // Slug usado na URL pública (ex: "residencia-horizonte"). Único.
    [Required, MaxLength(120)]
    public string Slug { get; set; } = string.Empty;

    // Título exibido nos cards e no detalhe do projeto.
    [Required, MaxLength(200)]
    public string Titulo { get; set; } = string.Empty;

    // Ano de execução/conclusão do projeto.
    public int Ano { get; set; }

    // Tipo do projeto: "Real" (executado) ou "Estudo" (conceitual).
    [Required, MaxLength(20)]
    public string Tipo { get; set; } = "Real";

    // Categoria/segmento: Residencial, Comercial, Interiores, etc.
    [Required, MaxLength(80)]
    public string Categoria { get; set; } = string.Empty;

    // Área em metros quadrados (pode ser nulo para projetos de estudo).
    public int? AreaM2 { get; set; }

    // Localização do projeto (cidade/UF ou texto livre).
    [MaxLength(120)]
    public string? Localizacao { get; set; }

    // Duração total do projeto (ex: "10 meses").
    [MaxLength(60)]
    public string? Duracao { get; set; }

    // Nome do cliente (ou genérico "Família X" para preservar privacidade).
    [MaxLength(120)]
    public string? Cliente { get; set; }

    // Status atual: Construído, Em obra, Render, Estudo, etc.
    [MaxLength(40)]
    public string? Status { get; set; }

    // Lista de ferramentas/softwares usados — armazenada como string separada por vírgulas no banco.
    public List<string> Ferramentas { get; set; } = new();

    // Parágrafos da descrição longa exibidos na página de detalhe.
    public List<string> DescricaoParagrafos { get; set; } = new();

    // Citação destacada (frase em quote) opcional.
    [MaxLength(500)]
    public string? Citacao { get; set; }

    // URL da imagem de capa (Cloudinary). Capa é única e exibida no card e topo da página.
    [Required]
    public string CapaUrl { get; set; } = string.Empty;

    // Galeria de imagens (relação 1:N com GaleriaItem).
    public List<GaleriaItem> Galeria { get; set; } = new();

    // Ordem manual de exibição no portfólio (menor = aparece primeiro).
    public int Ordem { get; set; } = 0;

    // Data de criação do registro — usada para fallback de ordenação e estatísticas.
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
