using GuerraArq.Api.Controllers.Dtos;
using GuerraArq.Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace GuerraArq.Api.Controllers;

// Endpoint de autenticação do admin.
// Não há tabela de usuários: as credenciais estão fixas no .env (ADMIN_USER e ADMIN_PASSWORD).
// Login bem-sucedido devolve um JWT que o front usa para acessar rotas protegidas.
[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly IConfiguration _config;
    private readonly TokenService _tokenService;

    public AuthController(IConfiguration config, TokenService tokenService)
    {
        _config = config;
        _tokenService = tokenService;
    }

    // POST /api/auth/login
    // Recebe { usuario, senha } e devolve { token, expiraEm } se as credenciais conferirem.
    [HttpPost("login")]
    public IActionResult Login([FromBody] LoginDto dto)
    {
        // Lê as credenciais do ambiente.
        var adminUser = _config["ADMIN_USER"];
        var adminPass = _config["ADMIN_PASSWORD"];

        if (string.IsNullOrWhiteSpace(adminUser) || string.IsNullOrWhiteSpace(adminPass))
        {
            return StatusCode(500, new { erro = "Credenciais do admin não configuradas no servidor." });
        }

        // Comparação simples — em produção real usaríamos hash, mas como é um único
        // usuário fixo definido pelo dono do servidor, plain text no env é aceitável.
        if (dto.Usuario != adminUser || dto.Senha != adminPass)
        {
            return Unauthorized(new { erro = "Usuário ou senha inválidos." });
        }

        // Gera o JWT e devolve pro front.
        var (token, expira) = _tokenService.GerarToken(dto.Usuario);
        return Ok(new LoginResponseDto { Token = token, ExpiraEm = expira });
    }
}
