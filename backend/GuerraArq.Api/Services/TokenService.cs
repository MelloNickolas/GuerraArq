using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;

namespace GuerraArq.Api.Services;

// Serviço responsável por emitir tokens JWT para o admin autenticado.
// O token contém apenas a identidade do admin (role "admin") e tem validade limitada.
public class TokenService
{
    private readonly IConfiguration _config;

    public TokenService(IConfiguration config)
    {
        _config = config;
    }

    // Gera um JWT assinado com a chave secreta definida em JWT_SECRET (.env).
    // O front armazena esse token e envia em Authorization: Bearer <token> nas rotas protegidas.
    public (string token, DateTime expira) GerarToken(string usuario)
    {
        // Chave secreta usada pra assinar e validar o token.
        var secret = _config["JWT_SECRET"]
            ?? throw new InvalidOperationException("JWT_SECRET não configurado");

        var chave = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secret));
        var credentials = new SigningCredentials(chave, SecurityAlgorithms.HmacSha256);

        // Claims = informações embutidas no token. Aqui só identificamos o admin.
        var claims = new[]
        {
            new Claim(ClaimTypes.Name, usuario),
            new Claim(ClaimTypes.Role, "admin")
        };

        // Token expira em 12 horas (suficiente pra uma sessão de edição).
        var expira = DateTime.UtcNow.AddHours(12);

        var token = new JwtSecurityToken(
            issuer: "guerraarq-api",
            audience: "guerraarq-admin",
            claims: claims,
            expires: expira,
            signingCredentials: credentials
        );

        var tokenString = new JwtSecurityTokenHandler().WriteToken(token);
        return (tokenString, expira);
    }
}
