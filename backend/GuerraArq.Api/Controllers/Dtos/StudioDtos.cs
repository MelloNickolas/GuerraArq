namespace GuerraArq.Api.Controllers.Dtos;

// DTO usado pelo admin para atualizar as informações do estúdio.
// Imagens (FotoArquitetaUrl, FotoEstudioUrl) já vêm com URL do upload prévio.
public class StudioInfoUpsertDto
{
    public string? Whatsapp { get; set; }
    public string? Instagram { get; set; }
    public string? Pinterest { get; set; }
    public string? Linkedin { get; set; }
    public string? Email { get; set; }
    public int? AnoFundacao { get; set; }
    public string? StatCustomLabel { get; set; }
    public string? StatCustomValor { get; set; }
    public List<string> SobreParagrafos { get; set; } = new();
    public List<string> Servicos { get; set; } = new();
    public string? FotoArquitetaUrl { get; set; }
    public string? FotoEstudioUrl { get; set; }
}

// DTO retornado nas chamadas públicas — inclui também as estatísticas calculadas
// (número de projetos cadastrados e anos de estúdio), pra evitar dois requests no front.
public class StudioInfoPublicoDto
{
    public string? Whatsapp { get; set; }
    public string? Instagram { get; set; }
    public string? Pinterest { get; set; }
    public string? Linkedin { get; set; }
    public string? Email { get; set; }
    public int? AnoFundacao { get; set; }
    public string? StatCustomLabel { get; set; }
    public string? StatCustomValor { get; set; }
    public List<string> SobreParagrafos { get; set; } = new();
    public List<string> Servicos { get; set; } = new();
    public string? FotoArquitetaUrl { get; set; }
    public string? FotoEstudioUrl { get; set; }

    // Contadores calculados automaticamente.
    public int TotalProjetos { get; set; }
    public int AnosDeEstudio { get; set; }
}
