using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace GuerraArq.Api.Data;

// Factory usada APENAS em tempo de design (quando rodamos "dotnet ef migrations add ...").
// Permite gerar migrations sem precisar de uma DATABASE_URL real configurada.
// O EF CLI procura essa classe automaticamente.
public class AppDbContextFactory : IDesignTimeDbContextFactory<AppDbContext>
{
    public AppDbContext CreateDbContext(string[] args)
    {
        var options = new DbContextOptionsBuilder<AppDbContext>()
            // Connection string fake — só serve pra que o EF entenda o provider Postgres
            // e gere SQL compatível. Nenhum acesso ao banco real acontece aqui.
            .UseNpgsql("Host=localhost;Database=design_time;Username=postgres;Password=postgres")
            .Options;

        return new AppDbContext(options);
    }
}
