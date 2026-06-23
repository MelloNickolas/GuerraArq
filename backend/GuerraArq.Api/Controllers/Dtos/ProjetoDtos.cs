namespace GuerraArq.Api.Controllers.Dtos;

// DTOs (Data Transfer Objects): formato dos dados que entram/saem pela API.
// Separar DTO da Entity evita expor campos internos e permite validação específica.

// Payload enviado pelo admin ao criar ou atualizar um projeto.
// Imagens NÃO vêm aqui — upload é feito em endpoint separado que retorna a URL.
public class ProjetoUpsertDto
{
    public string Slug { get; set; } = string.Empty;
    public string Titulo { get; set; } = string.Empty;
    public int Ano { get; set; }
    public string Tipo { get; set; } = "Real";
    public string Categoria { get; set; } = string.Empty;
    public int? AreaM2 { get; set; }
    public string? Localizacao { get; set; }
    public string? Duracao { get; set; }
    public string? Cliente { get; set; }
    public string? Status { get; set; }
    public List<string> Ferramentas { get; set; } = new();
    public List<string> DescricaoParagrafos { get; set; } = new();
    public string? Citacao { get; set; }
    public string CapaUrl { get; set; } = string.Empty;
    public List<GaleriaItemDto> Galeria { get; set; } = new();
    public int Ordem { get; set; } = 0;
}

// Item da galeria enviado no payload (URL já vem do upload prévio + descrição).
public class GaleriaItemDto
{
    public string Url { get; set; } = string.Empty;
    public string? Descricao { get; set; }
    public int Ordem { get; set; } = 0;
}
