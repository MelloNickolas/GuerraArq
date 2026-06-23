namespace GuerraArq.Api.Controllers.Dtos;

// Payload do login: usuário e senha enviados pelo formulário do admin.
public class LoginDto
{
    public string Usuario { get; set; } = string.Empty;
    public string Senha { get; set; } = string.Empty;
}

// Resposta do login bem-sucedido: token JWT que o front armazena (localStorage)
// e envia no header Authorization de todas as requisições autenticadas.
public class LoginResponseDto
{
    public string Token { get; set; } = string.Empty;
    public DateTime ExpiraEm { get; set; }
}
