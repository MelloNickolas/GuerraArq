using GuerraArq.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace GuerraArq.Api.Controllers;

// Endpoint de upload de imagens. Apenas o admin autenticado pode usar.
// O front faz POST com multipart/form-data e recebe a URL final do Cloudinary.
// Essa URL é então enviada nos payloads de projeto/studio.
[ApiController]
[Route("api/upload")]
[Authorize(Roles = "admin")]
public class UploadController : ControllerBase
{
    private readonly CloudinaryService _cloudinary;

    public UploadController(CloudinaryService cloudinary)
    {
        _cloudinary = cloudinary;
    }

    // POST /api/upload (campo "arquivo")
    // Devolve { url: "https://res.cloudinary.com/..." }
    [HttpPost]
    public async Task<IActionResult> Upload([FromForm] IFormFile arquivo)
    {
        if (arquivo == null || arquivo.Length == 0)
            return BadRequest(new { erro = "Nenhum arquivo enviado." });

        // Valida tipo de arquivo — só imagens.
        var tiposPermitidos = new[] { "image/jpeg", "image/png", "image/webp", "image/avif" };
        if (!tiposPermitidos.Contains(arquivo.ContentType))
            return BadRequest(new { erro = "Formato inválido. Use JPG, PNG, WEBP ou AVIF." });

        var url = await _cloudinary.UploadImagemAsync(arquivo);
        return Ok(new { url });
    }
}
