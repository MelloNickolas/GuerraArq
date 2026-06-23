using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace GuerraArq.Api.Models;

// Item individual da galeria de um projeto.
// Cada imagem tem sua própria descrição, que aparece no hover na página pública.
public class GaleriaItem
{
    public int Id { get; set; }

    // URL da imagem hospedada no Cloudinary.
    [Required]
    public string Url { get; set; } = string.Empty;

    // Texto que aparece quando o usuário passa o mouse sobre a imagem.
    [MaxLength(300)]
    public string? Descricao { get; set; }

    // Ordem da imagem dentro da galeria (drag-and-drop no admin futuramente).
    public int Ordem { get; set; } = 0;

    // FK para o projeto pai. JsonIgnore evita loop ao serializar.
    public int ProjetoId { get; set; }

    [JsonIgnore]
    public Projeto? Projeto { get; set; }
}
