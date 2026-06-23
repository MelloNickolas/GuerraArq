using GuerraArq.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace GuerraArq.Api.Data;

// Contexto do Entity Framework Core: representa a sessão com o banco de dados.
// Cada DbSet<T> corresponde a uma tabela. As migrations são geradas a partir daqui.
public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    // Tabela de projetos do portfólio.
    public DbSet<Projeto> Projetos => Set<Projeto>();

    // Tabela de itens individuais da galeria (relação 1:N com Projeto).
    public DbSet<GaleriaItem> GaleriaItens => Set<GaleriaItem>();

    // Tabela singleton com infos do estúdio (sempre um único registro com Id=1).
    public DbSet<StudioInfo> StudioInfo => Set<StudioInfo>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // === Configuração de Projeto ===

        // Slug deve ser único para servir como identificador na URL pública.
        modelBuilder.Entity<Projeto>()
            .HasIndex(p => p.Slug)
            .IsUnique();

        // Listas de strings (Ferramentas, DescricaoParagrafos) são serializadas como
        // JSON em uma única coluna do Postgres — abordagem simples e suficiente.
        var listConverter = new Microsoft.EntityFrameworkCore.Storage.ValueConversion.ValueConverter<List<string>, string>(
            v => System.Text.Json.JsonSerializer.Serialize(v, (System.Text.Json.JsonSerializerOptions?)null),
            v => System.Text.Json.JsonSerializer.Deserialize<List<string>>(v, (System.Text.Json.JsonSerializerOptions?)null) ?? new List<string>()
        );

        // Comparador necessário para o EF detectar mudanças em listas (referência muda sempre).
        var listComparer = new Microsoft.EntityFrameworkCore.ChangeTracking.ValueComparer<List<string>>(
            (a, b) => (a ?? new List<string>()).SequenceEqual(b ?? new List<string>()),
            v => v.Aggregate(0, (acc, str) => HashCode.Combine(acc, str.GetHashCode())),
            v => v.ToList()
        );

        modelBuilder.Entity<Projeto>()
            .Property(p => p.Ferramentas)
            .HasConversion(listConverter)
            .Metadata.SetValueComparer(listComparer);

        modelBuilder.Entity<Projeto>()
            .Property(p => p.DescricaoParagrafos)
            .HasConversion(listConverter)
            .Metadata.SetValueComparer(listComparer);

        // Relação Projeto -> GaleriaItem: ao deletar projeto, deleta as imagens junto.
        modelBuilder.Entity<Projeto>()
            .HasMany(p => p.Galeria)
            .WithOne(g => g.Projeto)
            .HasForeignKey(g => g.ProjetoId)
            .OnDelete(DeleteBehavior.Cascade);

        // === Configuração de StudioInfo ===

        // SobreParagrafos e Servicos também serializados como JSON.
        modelBuilder.Entity<StudioInfo>()
            .Property(s => s.SobreParagrafos)
            .HasConversion(listConverter)
            .Metadata.SetValueComparer(listComparer);

        modelBuilder.Entity<StudioInfo>()
            .Property(s => s.Servicos)
            .HasConversion(listConverter)
            .Metadata.SetValueComparer(listComparer);

        // Seed: garante que sempre exista um registro padrão de StudioInfo com Id=1.
        // O cliente edita esse registro pelo admin — nunca cria/deleta.
        modelBuilder.Entity<StudioInfo>().HasData(new StudioInfo
        {
            Id = 1,
            AnoFundacao = 2018,
            StatCustomLabel = "Sob medida",
            StatCustomValor = "100%"
        });
    }
}
