using CloudinaryDotNet;
using CloudinaryDotNet.Actions;

namespace GuerraArq.Api.Services;

// Serviço que encapsula o upload de imagens para o Cloudinary.
// Mantém a SDK isolada — controllers chamam só este serviço.
public class CloudinaryService
{
    private readonly Cloudinary _cloudinary;

    public CloudinaryService(IConfiguration config)
    {
        // As 3 credenciais vêm do painel do Cloudinary (Dashboard -> API Keys).
        var cloud = config["CLOUDINARY_CLOUD_NAME"];
        var apiKey = config["CLOUDINARY_API_KEY"];
        var apiSecret = config["CLOUDINARY_API_SECRET"];

        if (string.IsNullOrWhiteSpace(cloud) || string.IsNullOrWhiteSpace(apiKey) || string.IsNullOrWhiteSpace(apiSecret))
            throw new InvalidOperationException("Credenciais do Cloudinary não configuradas.");

        var account = new Account(cloud, apiKey, apiSecret);
        _cloudinary = new Cloudinary(account);
    }

    // Faz upload de uma imagem (IFormFile do ASP.NET) e devolve a URL segura.
    // A pasta "guerraarq" organiza tudo num lugar só no painel do Cloudinary.
    public async Task<string> UploadImagemAsync(IFormFile arquivo, string pasta = "guerraarq")
    {
        if (arquivo.Length == 0)
            throw new ArgumentException("Arquivo vazio.");

        // Abre o stream do arquivo enviado e prepara os parâmetros do upload.
        using var stream = arquivo.OpenReadStream();
        var parametros = new ImageUploadParams
        {
            File = new FileDescription(arquivo.FileName, stream),
            Folder = pasta,
            // Limita a maior dimensão a 2000px e otimiza qualidade (economiza banda do cliente).
            Transformation = new Transformation()
                .Width(2000).Crop("limit")
                .Quality("auto")
                .FetchFormat("auto")
        };

        var resultado = await _cloudinary.UploadAsync(parametros);
        if (resultado.Error != null)
            throw new Exception($"Erro no upload: {resultado.Error.Message}");

        // SecureUrl é HTTPS — usar sempre essa.
        return resultado.SecureUrl.ToString();
    }
}
