using System.ComponentModel.DataAnnotations;

namespace GuerraArq.Api.Models;

// Singleton: existe apenas um registro dessa tabela (Id sempre = 1).
// Contém todas as informações do escritório que o cliente pode editar pelo admin.
public class StudioInfo
{
    public int Id { get; set; } = 1;

    // === Contato e redes sociais ===
    // Esses campos alimentam todos os links do site (header, footer, botões).

    [MaxLength(40)]
    public string? Whatsapp { get; set; } // só números, ex: "5511999998888"

    [MaxLength(80)]
    public string? Instagram { get; set; } // handle sem @, ex: "guerra.arq"

    [MaxLength(80)]
    public string? Pinterest { get; set; }

    [MaxLength(120)]
    public string? Linkedin { get; set; } // URL completa do perfil

    [MaxLength(120)]
    public string? Email { get; set; }

    // === Identidade ===

    // Ano de fundação do estúdio — usado para calcular automaticamente o contador "X anos de estúdio".
    public int? AnoFundacao { get; set; }

    // Texto livre da terceira stat (ex: "100% Sob medida"). As outras duas são calculadas.
    [MaxLength(60)]
    public string? StatCustomLabel { get; set; } = "Sob medida";

    [MaxLength(20)]
    public string? StatCustomValor { get; set; } = "100%";

    // === Hero (banner principal da home) ===

    // Texto principal do título (parte sem destaque).
    // Ex: "Projetos que traduzem o jeito de"
    [MaxLength(300)]
    public string? HeroTitulo { get; set; }

    // Trecho destacado em verde no título.
    // Ex: "viver e habitar."
    [MaxLength(150)]
    public string? HeroTituloDestaque { get; set; }

    // Parágrafo descritivo abaixo do título.
    [MaxLength(600)]
    public string? HeroLead { get; set; }

    // === Seção "Sobre" ===

    // Parágrafos do texto sobre o estúdio.
    public List<string> SobreParagrafos { get; set; } = new();

    // Lista de serviços oferecidos (ex: "Arquitetura residencial", "Interiores"...).
    public List<string> Servicos { get; set; } = new();

    // === Fotos ===

    // Foto da arquiteta (aparece na hero da home).
    [MaxLength(500)]
    public string? FotoArquitetaUrl { get; set; }

    // Foto do estúdio (aparece na seção sobre).
    [MaxLength(500)]
    public string? FotoEstudioUrl { get; set; }
}
