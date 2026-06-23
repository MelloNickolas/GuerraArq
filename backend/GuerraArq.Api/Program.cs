using System.Text;
using DotNetEnv;
using GuerraArq.Api.Data;
using GuerraArq.Api.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

// Arquivo de boot da API. Aqui registramos serviços, middleware, autenticação e rotas.

var builder = WebApplication.CreateBuilder(args);

// === Carregamento de variáveis de ambiente ===
// Em desenvolvimento local lemos do arquivo .env (que NÃO vai pro git).
// Em produção (Render), as variáveis são injetadas pela própria plataforma.
Env.TraversePath().Load();

// Mescla as variáveis do ambiente do processo com a Configuration do ASP.NET,
// pra acessar tudo via _config["NOME_DA_VAR"].
builder.Configuration.AddEnvironmentVariables();

// === CORS ===
// O front (Vercel) está em domínio diferente da API (Render).
// Sem essa config, o navegador bloqueia as chamadas.
var origensPermitidas = builder.Configuration["CORS_ORIGIN"]?.Split(',')
    ?? new[] { "http://localhost:5173" };

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
        policy.WithOrigins(origensPermitidas)
              .AllowAnyHeader()
              .AllowAnyMethod());
});

// === Banco de dados (Postgres via EF Core) ===
// A connection string vem de DATABASE_URL (Neon). Em dev pode ser local.
var connStr = builder.Configuration["DATABASE_URL"]
    ?? throw new InvalidOperationException("DATABASE_URL não configurada.");

// Neon envia DATABASE_URL no formato URI; convertemos para formato Npgsql.
connStr = ConverterUrlPostgresParaNpgsql(connStr);

builder.Services.AddDbContext<AppDbContext>(opt =>
    opt.UseNpgsql(connStr));

// === Serviços customizados ===
builder.Services.AddSingleton<TokenService>();
builder.Services.AddSingleton<CloudinaryService>();

// === Autenticação JWT ===
// Valida o token enviado pelo front em todas as rotas com [Authorize].
var jwtSecret = builder.Configuration["JWT_SECRET"]
    ?? throw new InvalidOperationException("JWT_SECRET não configurada.");

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(opt =>
    {
        opt.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = "guerraarq-api",
            ValidAudience = "guerraarq-admin",
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSecret))
        };
    });

builder.Services.AddAuthorization();

// === Controllers ===
builder.Services.AddControllers();

var app = builder.Build();

// === Migrations automáticas em produção ===
// Ao iniciar, aplica as migrations pendentes — assim não precisamos rodar comando manual no deploy.
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.Migrate();
}

// === Middleware pipeline ===
app.UseCors();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.Run();


// Helper: converte URI Postgres (formato Neon/Heroku) para connection string Npgsql.
// Entrada: postgres://user:pass@host:5432/dbname?sslmode=require
// Saída:   Host=host;Port=5432;Database=dbname;Username=user;Password=pass;SSL Mode=Require
static string ConverterUrlPostgresParaNpgsql(string url)
{
    // Se já está no formato Npgsql (contém "Host="), retorna como está.
    if (url.Contains("Host=", StringComparison.OrdinalIgnoreCase))
        return url;

    var uri = new Uri(url);
    var userInfo = uri.UserInfo.Split(':');
    var user = Uri.UnescapeDataString(userInfo[0]);
    var senha = userInfo.Length > 1 ? Uri.UnescapeDataString(userInfo[1]) : "";
    var host = uri.Host;
    var porta = uri.Port > 0 ? uri.Port : 5432;
    var database = uri.AbsolutePath.TrimStart('/');

    // Neon exige SSL. Trust Server Certificate evita erro de cert auto-assinado.
    return $"Host={host};Port={porta};Database={database};Username={user};Password={senha};SSL Mode=Require;Trust Server Certificate=true";
}
